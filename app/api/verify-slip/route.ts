import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { put } from '@vercel/blob';

// ---- ตั้งค่า Firebase Admin (ฝั่ง server) ----
function getAdminDb() {
  if (!getApps().length) {
    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      console.warn("FIREBASE_ADMIN_PRIVATE_KEY is missing. Database will not be initialized correctly during build phase.");
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
  }
  return getFirestore();
}

// ---- ค่าคงที่ ----
const MONTHLY_LIMIT = 90; // จำนวนสลิปสูงสุดต่อเดือน

// ---- รับ POST request สำหรับตรวจสอบสลิป ----
export async function POST(req: NextRequest) {
  try {
    // อ่านข้อมูล form-data ที่ส่งมา (ควรมี field "slip" เป็นไฟล์รูปภาพ)
    const formData = await req.formData();
    const slipFile = formData.get("slip") as File | null;
    const billId = formData.get("billId") as string | null;
    const type = formData.get("type") as string || "bill"; // "bill" หรือ "deposit"

    if (!billId) {
      return NextResponse.json(
        { success: false, message: type === "deposit" ? "กรุณาระบุรหัสคำขอจองห้อง" : "กรุณาระบุรหัสบิล" },
        { status: 400 }
      );
    }
    
    if (!slipFile) {
      return NextResponse.json(
        { success: false, message: "กรุณาแนบไฟล์สลิป" },
        { status: 400 }
      );
    }

    // ---- คีย์เดือนปัจจุบัน เช่น "2026-03" ----
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // ---- ตรวจสอบ counter ใน Firestore ----
    const adminDb = getAdminDb();
    
    // ---- ดึงข้อมูลบิลหรือคำขอเพื่อเช็คยอดเงิน ----
    let expectedAmount = 0;
    const docRef = type === "deposit" 
      ? adminDb.collection("room_requests").doc(billId)
      : adminDb.collection("bills").doc(billId);
      
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: type === "deposit" ? "ไม่พบคำขอจองห้องนี้ในระบบ" : "ไม่พบบิลนี้ในระบบ" },
        { status: 404 }
      );
    }
    
    if (type === "deposit") {
      let depositFee = docSnap.data()?.depositFee;
      if (!depositFee) {
        const settingsSnap = await adminDb.collection("settings").doc("general").get();
        if (settingsSnap.exists) {
          depositFee = settingsSnap.data()?.depositFee;
        }
      }
      expectedAmount = depositFee || docSnap.data()?.rentPrice || 0;
    } else {
      expectedAmount = docSnap.data()?.totalAmount || 0;
    }

    const usageRef = adminDb.collection("slipok_usage").doc(monthKey);
    const usageSnap = await usageRef.get();

    const currentCount: number = usageSnap.exists
      ? (usageSnap.data()?.count ?? 0)
      : 0;

    // ---- เช็ค limit 90 สลิป/เดือน ----
    if (currentCount >= MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          message: `เกินโควต้าการตรวจสอบสลิป (${MONTHLY_LIMIT} สลิป/เดือน) แล้ว กรุณารอเดือนถัดไป`,
          currentUsage: currentCount,
          limit: MONTHLY_LIMIT,
        },
        { status: 429 }
      );
    }

    // ---- เรียก SlipOK API ----
    const slipokBranchId = process.env.SLIPOK_BRANCH_ID;
    const slipokApiKey = process.env.SLIPOK_API_KEY;

    if (!slipokBranchId || !slipokApiKey) {
      return NextResponse.json(
        { success: false, message: "ยังไม่ได้ตั้งค่า SlipOK API Key" },
        { status: 500 }
      );
    }

    // แปลงไฟล์เป็น ArrayBuffer แล้วส่งต่อไปยัง SlipOK
    const fileBuffer = await slipFile.arrayBuffer();
    const slipokFormData = new FormData();
    slipokFormData.append(
      "files",
      new Blob([fileBuffer], { type: slipFile.type }),
      slipFile.name
    );

    const slipokResponse = await fetch(
      `https://api.slipok.com/api/line/apikey/${slipokBranchId}`,
      {
        method: "POST",
        headers: {
          "x-authorization": slipokApiKey,
        },
        body: slipokFormData,
      }
    );

    const slipokData = await slipokResponse.json();

    // ---- เพิ่ม counter +1 เมื่อเรียก SlipOK สำเร็จ ----
    await usageRef.set(
      {
        count: currentCount + 1,
        month: monthKey,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // ---- อัปเดตสถานะบิลใน Firestore ถ้าสลิปถูกต้อง ----
    // เช็คว่า SlipOK คืนค่า success: true และ data.success เป็น true ด้วย
    const isSlipValid = slipokData?.success === true || slipokData?.data?.success === true;
    
    if (!isSlipValid) {
      return NextResponse.json(
        { success: false, message: "สลิปไม่ถูกต้อง หรือไม่สามารถตรวจพบ QR Code ได้" },
        { status: 400 }
      );
    }

    // ---- ตรวจสอบยอดเงิน (Amount) ----
    const slipAmount = slipokData?.data?.amount ?? slipokData?.data?.data?.amount;
    
    if (Number(slipAmount) !== Number(expectedAmount)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `ยอดเงินไม่ตรงกัน! ยอดที่ต้องชำระ: ฿${expectedAmount} แต่ยอดโอนจริง: ฿${slipAmount ?? 0}` 
        },
        { status: 400 }
      );
    }

    let slipUrl = null;
    if (billId) {
      try {
        if (type === "deposit") {
          // อัปโหลดรูปลง Vercel Blob สำหรับ deposit
          const buffer = await slipFile.arrayBuffer();
          const blob = await put(`booking_docs/${billId}/slip_${Date.now()}_${slipFile.name}`, buffer, {
            access: 'public',
          });
          slipUrl = blob.url;
          
          await docRef.update({
            slipUrl: slipUrl
          });
        } else {
          await docRef.update({
            status: "paid",
            paidAt: new Date().toISOString(),
          });
        }
      } catch (updateErr) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ/อัปโหลดไฟล์:", updateErr);
      }
    }

    // ---- ส่งผลลัพธ์กลับ ----
    return NextResponse.json({
      success: true,
      data: slipokData,
      slipUrl: slipUrl,
      usage: {
        currentUsage: currentCount + 1,
        limit: MONTHLY_LIMIT,
        remaining: MONTHLY_LIMIT - (currentCount + 1),
      },
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบสลิป:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
