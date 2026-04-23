# 🏠 CMRU Dormitory Management System

> ระบบบริหารจัดการหอพักออนไลน์ สำหรับมหาวิทยาลัยราชภัฏเชียงใหม่  
> พัฒนาด้วย **Next.js 16** + **Firebase** + **Vercel Blob** รองรับ Mobile Responsive เต็มรูปแบบ

---

## 📌 ภาพรวมโปรเจค

ระบบจัดการหอพักแบบครบวงจรสำหรับผู้ดูแลระบบ (Admin) และผู้เช่า (Tenant) ประกอบด้วย:

- **หน้าสาธารณะ (Public)** – หน้าแสดงข้อมูลหอพัก รายละเอียดห้องพัก
- **แดชบอร์ดผู้ดูแล (Admin)** – จัดการห้องพัก ผู้เช่า บิล การซ่อม รายงาน และตั้งค่าเว็บไซต์
- **แดชบอร์ดผู้เช่า (Tenant)** – จองห้อง ชำระเงิน แจ้งซ่อม แชทกับแอดมิน
- **การแจ้งเตือน Push Notification** – ผ่าน Firebase Cloud Messaging (FCM)
- **ระบบแชทเรียลไทม์** – ระหว่างผู้เช่าและแอดมิน

---

## 🛠️ Tech Stack

| เทคโนโลยี | เวอร์ชัน | ใช้เพื่ออะไร |
|---|---|---|
| Next.js | 16.1.6 | React Framework หลักของโปรเจค (App Router) |
| React | 19.2.3 | UI Library |
| TypeScript | ^5.9.3 | Type Safety สำหรับ JavaScript |
| TailwindCSS | ^4 | Utility-first CSS Framework |
| Firebase | ^12.12.0 | Authentication, Firestore DB, Cloud Storage, FCM |
| Firebase Admin | ^13.8.0 | Server-side Firebase (API Routes) |
| @vercel/blob | ^2.3.1 | Cloud Storage สำหรับรูปภาพ |
| lucide-react | ^0.577.0 | ไลบรารีไอคอน SVG |
| react-easy-crop | ^5.5.7 | Crop / Zoom / Flip รูปภาพก่อนอัปโหลด |

---

## 📦 ไลบรารีที่ติดตั้งและวัตถุประสงค์

### Production Dependencies

#### `firebase` (^12.12.0)
```bash
bun add firebase
```
**ใช้สำหรับ:**
- `firebase/auth` – ระบบ Authentication (Login / Register / Password Reset)
- `firebase/firestore` – ฐานข้อมูล NoSQL สำหรับเก็บข้อมูลห้อง, ผู้เช่า, บิล, แชท ฯลฯ
- `firebase/storage` – Cloud Storage สำหรับไฟล์ (ใช้ควบคู่ Vercel Blob)
- `firebase/messaging` – Firebase Cloud Messaging สำหรับ Push Notifications
- Service Worker (`/public/firebase-messaging-sw.js`) สำหรับรับ notification ในพื้นหลัง

---

#### `firebase-admin` (^13.8.0)
```bash
bun add firebase-admin
```
**ใช้สำหรับ:**
- ทำงานฝั่ง Server (Next.js API Routes) เพื่อส่ง Push Notification ผ่าน FCM Admin SDK
- ใช้ใน `/app/api/send-notification/route.ts` — ส่ง notification ไปยัง FCM Token ของผู้ใช้แต่ละคน
- ป้องกันการปลอมแปลง request จาก client ด้วย Admin privileges

---

#### `@vercel/blob` (^2.3.1)
```bash
bun add @vercel/blob
```
**ใช้สำหรับ:**
- อัปโหลดและจัดการรูปภาพบน Vercel Blob Storage (Cloud CDN)
- ใช้ใน API Routes:
  - `/api/upload-room-image` – อัปโหลดรูปห้องพัก (Hero Banner, ปกหลัก, Gallery)
  - `/api/upload-qr` – อัปโหลดรูป QR Code ชำระเงิน
  - `/api/upload-repair` – อัปโหลดรูปแจ้งซ่อม
  - `/api/delete-blob-image` – ลบรูปเก่าออกจาก Vercel Blob อัตโนมัติ
- ต้องตั้งค่า Environment Variable: `BLOB_READ_WRITE_TOKEN`

---

#### `lucide-react` (^0.577.0)
```bash
bun add lucide-react
```
**ใช้สำหรับ:**
- ไลบรารีไอคอน SVG ที่ใช้ประกอบ UI ทั่วทั้งโปรเจค
- ไอคอนเมนู, ปุ่มกด, สถานะต่างๆ ในทุก Dashboard

---

#### `react-easy-crop` (^5.5.7)
```bash
bun add react-easy-crop
```
**ใช้สำหรับ:**
- ระบบตัดกรอบรูปภาพ (Crop) และพลิกรูป (Flip) สำหรับ Hero Banner ในหน้าตั้งค่าเว็บไซต์
- รองรับ:
  - **Zoom** – ซูมรูปภาพด้วย Slider
  - **Pan** – เลื่อนรูปภาพภายในกรอบ
  - **Flip Horizontal** – พลิกรูปซ้าย-ขวา
  - **Flip Vertical** – พลิกรูปบน-ล่าง
  - **Aspect Ratio Lock** – กรอบสัดส่วน 21:7 สำหรับ Hero Banner
- ใช้ร่วมกับ `lib/cropImage.ts` สำหรับแปลง Canvas เป็น File จริงก่อนอัปโหลด

---

### Dev Dependencies

| แพ็กเกจ | วัตถุประสงค์ |
|---|---|
| `@tailwindcss/postcss` ^4 | PostCSS plugin สำหรับ TailwindCSS v4 |
| `eslint` ^9 | ตรวจสอบคุณภาพโค้ด |
| `eslint-config-next` 16.1.6 | ESLint config มาตรฐานของ Next.js |
| `@types/node` ^25.5.0 | TypeScript types สำหรับ Node.js |
| `@types/react` ^19.2.14 | TypeScript types สำหรับ React |
| `@types/react-dom` ^19.2.3 | TypeScript types สำหรับ React DOM |

---

## 🗂️ โครงสร้างโปรเจค

```
CMRU_Dormitory_System/
├── app/                          # Next.js App Router
│   ├── admin/                    # หน้าสำหรับผู้ดูแลระบบ
│   │   ├── dashboard/            # แดชบอร์ดภาพรวม
│   │   ├── rooms/                # จัดการห้องพัก (เพิ่ม/แก้ไข/ลบ)
│   │   ├── manage_tenants/       # จัดการผู้เช่า + ประวัติ
│   │   ├── room_requests/        # คำขอจองห้อง
│   │   ├── repair_request/       # คำขอซ่อมแซม
│   │   ├── bills_payments/       # สร้างบิลและจัดการการชำระเงิน
│   │   ├── chat/                 # แชทกับผู้เช่าแบบเรียลไทม์
│   │   ├── report/               # รายงานและออกเอกสาร
│   │   ├── settings/             # ตั้งค่าเว็บไซต์ (รูปภาพ, ช่องทางติดต่อ, ลิงก์)
│   │   └── layout.tsx            # Layout Admin + Sidebar Navigation
│   ├── tenant/                   # หน้าสำหรับผู้เช่า
│   │   ├── dashboard/            # แดชบอร์ดผู้เช่า
│   │   ├── room/                 # ดูห้องว่างและจองห้อง
│   │   ├── repair/               # แจ้งซ่อมแซม
│   │   ├── repair-history/       # ประวัติการแจ้งซ่อม
│   │   ├── bills_payments/       # ดูบิลและชำระเงิน
│   │   ├── chat/                 # แชทกับแอดมิน
│   │   ├── profile/              # ข้อมูลส่วนตัว
│   │   └── layout.tsx            # Layout Tenant + Sidebar Navigation
│   ├── auth/                     # หน้า Authentication
│   │   ├── login/                # เข้าสู่ระบบ
│   │   ├── register/             # สมัครสมาชิก
│   │   ├── forgot-password/      # ลืมรหัสผ่าน
│   │   └── action/               # Firebase Auth Actions (Email Verification)
│   ├── details_room/             # หน้ารายละเอียดห้องพัก (สาธารณะ)
│   ├── api/                      # Next.js API Routes (Server-side)
│   │   ├── upload-room-image/    # อัปโหลดรูปห้องพักไปยัง Vercel Blob
│   │   ├── delete-blob-image/    # ลบรูปเก่าจาก Vercel Blob
│   │   ├── send-notification/    # ส่ง FCM Push Notification (Firebase Admin)
│   │   ├── upload-qr/            # อัปโหลดรูป QR Code ชำระเงิน
│   │   ├── upload-repair/        # อัปโหลดรูปแจ้งซ่อม
│   │   └── verify-slip/          # ตรวจสอบสลิปการชำระเงิน
│   ├── page.tsx                  # หน้าหลัก (Public Home Page)
│   ├── layout.tsx                # Root Layout (AuthProvider + NotificationProvider)
│   ├── globals.css               # Global CSS + Design System tokens
│   ├── robots.ts                 # SEO: robots.txt
│   └── sitemap.ts                # SEO: sitemap.xml
├── components/                   # Shared Components
│   ├── AuthProvider.tsx           # Context สำหรับ Authentication state
│   ├── NotificationProvider.tsx   # FCM Push Notification Manager + Banner
│   └── ToastContainer.tsx         # ระบบแสดง Toast Notification (UI)
├── lib/                          # Utility Libraries
│   ├── firebase.ts               # Firebase initialization (Auth, Firestore, Storage)
│   ├── toast.ts                  # Event-based Toast system (ไม่ต้องใช้ Context)
│   └── cropImage.ts              # ฟังก์ชันตัดกรอบรูปบน Canvas สำหรับ react-easy-crop
├── public/                       # Static Assets
│   ├── firebase-messaging-sw.js  # Service Worker สำหรับรับ FCM ในพื้นหลัง
│   └── logo.png                  # โลโก้หอพัก
├── firestore.rules               # Firestore Security Rules
├── storage.rules                 # Firebase Storage Security Rules
├── next.config.ts                # Next.js Configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript Configuration
```

---

## 🔥 Firestore Collections

| Collection | ใช้เก็บอะไร | สิทธิ์การเข้าถึง |
|---|---|---|
| `users` | ข้อมูลผู้ใช้ (role: admin/tenant) | ตัวเองอ่าน/แก้ไขได้, admin ทำได้ทุกอย่าง |
| `rooms` | ข้อมูลห้องพัก (ราคา, ประเภท, สถานะ) | อ่านได้ทุกคน, เขียนได้เฉพาะ admin |
| `room_requests` | คำขอจองห้อง | ผู้เช่าสร้างได้, admin แก้ไข/ลบ |
| `repairs` | คำขอซ่อมแซม | ผู้เช่าสร้างได้, admin + เจ้าของอ่าน/แก้ไข |
| `bills` | บิลค่าเช่า + ค่าสาธารณูปโภค | admin เขียน, ผู้เช่าอ่านของตัวเอง |
| `chats/{tenantId}/messages` | ข้อความแชท admin-ผู้เช่า | admin + เจ้าของห้องแชท |
| `fcm_tokens` | FCM Token สำหรับ Push Notification | เจ้าของ token เท่านั้น |
| `settings` | ตั้งค่าเว็บไซต์ (รูปภาพ, ลิงก์, ติดต่อ) | อ่านได้ทุกคน, เขียนได้เฉพาะ admin |
| `bankAccount` | ข้อมูลบัญชีธนาคารสำหรับชำระเงิน | ผู้ใช้ที่ล็อกอินอ่านได้, admin เขียน |

---

## ⚙️ Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจค:

```env
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (Server-side เท่านั้น)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=
```

---

## 🚀 วิธีติดตั้งและรันโปรเจค

### 1. ติดตั้ง Dependencies

```bash
bun install
```

### 2. ตั้งค่า Environment Variables

คัดลอก `.env.example` และกรอกค่าที่ได้จาก Firebase Console และ Vercel Dashboard

### 3. รัน Development Server

```bash
bun run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 4. Build สำหรับ Production

```bash
bun run build
bun run start
```

---

## 🎯 ฟีเจอร์หลัก

### ฝั่งผู้ดูแล (Admin)
- 📊 **Dashboard** – ภาพรวมสถิติหอพัก ห้องว่าง/ห้องเต็ม
- 🏠 **จัดการห้องพัก** – เพิ่ม/แก้ไข/ลบห้อง พร้อมอัปโหลดรูปภาพแบบ Gallery ไม่จำกัด
- 👥 **จัดการผู้เช่า** – ดูข้อมูลผู้เช่า ประวัติการเช่า
- 📋 **คำขอจองห้อง** – อนุมัติ/ปฏิเสธคำขอ
- 🔧 **จัดการการซ่อม** – ติดตามสถานะคำขอซ่อมแซม
- 💰 **บิลและการชำระเงิน** – สร้างบิลค่าเช่า ตรวจสอบสลิปชำระเงิน
- 💬 **แชท** – สนทนากับผู้เช่าแบบเรียลไทม์ พร้อม Badge แจ้งเตือนข้อความใหม่
- 📈 **รายงาน** – ออกรายงานสรุปข้อมูล
- ⚙️ **ตั้งค่าเว็บไซต์** – จัดการรูปภาพ Hero Banner / Gallery / ช่องทางติดต่อ / Social Media Links

### ฝั่งผู้เช่า (Tenant)
- 🏠 **จองห้อง** – ดูห้องว่าง กรองตามประเภท/ตึก
- 💳 **ชำระเงิน** – อัปโหลดสลิปชำระเงิน
- 🔧 **แจ้งซ่อม** – ส่งคำขอซ่อมแซมพร้อมรูปภาพ
- 💬 **แชทกับแอดมิน** – สอบถามข้อมูลแบบเรียลไทม์
- 🔔 **Push Notification** – รับการแจ้งเตือนสถานะผ่านเบราว์เซอร์

---

## 🌐 Deploy บน Vercel

```bash
vercel deploy
```

ต้องตั้งค่า Environment Variables ใน Vercel Dashboard ให้ครบก่อน Deploy

---

## 📝 หมายเหตุเพิ่มเติม

- **Push Notification** ต้องรันผ่าน HTTPS เท่านั้น (ไม่ทำงานบน HTTP ยกเว้น localhost)
- **Vercel Blob** ต้องเชื่อมต่อโปรเจคกับ Vercel ก่อน จึงจะสร้าง `BLOB_READ_WRITE_TOKEN` ได้
- **Firebase Admin Private Key** ต้องใส่ในรูปแบบที่ถูกต้อง (แทนที่ `\n` ด้วย newline จริง)
- ไฟล์รูปภาพที่อัปโหลดจะถูกลบอัตโนมัติจาก Vercel Blob เมื่อมีการแทนที่ด้วยรูปใหม่
