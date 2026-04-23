"use client";

import { useState } from "react";

interface ReportData {
  month: string;
  revenue: number;
  expenses: number;
  occupancyRate: number;
  newTenants: number;
}

export default function ReportPage() {
  const [reportData] = useState<ReportData[]>([]);

  const exportCSV = () => {
    const headers = ["เดือน", "รายรับ (บาท)", "รายจ่าย (บาท)", "อัตราการเข้าพัก (%)", "ผู้เช่าใหม่ (คน)"];
    const csvContent = [
      headers.join(","),
      ...reportData.map(row => `${row.month},${row.revenue},${row.expenses},${row.occupancyRate},${row.newTenants}`)
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dormitory_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-0 print:m-0 print:p-0 print:bg-white print:text-black">

      {/* ============ Print Layout (แสดงเฉพาะตอนปริ้น) ============ */}
      <div className="hidden print:block">
        {/* แถบสีด้านบน */}
        <div style={{ height: "10px", background: "linear-gradient(to right, #6B3F22, #8B5E3C, #C4874F, #E5B07A)" }} />

        <div style={{ padding: "32px 40px 40px" }}>
          {/* หัวรายงาน */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", borderBottom: "2px solid #E5E7EB", paddingBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: "#1F2937", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                รายงานสถิติและผลประกอบการ
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#6B7280" }}>
                หอพักหยาหยี๋ (Yayee Dormitory)
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                พิมพ์เมื่อ
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#374151" }}>
                {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                {new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
              </div>
            </div>
          </div>

          {/* การ์ดสถิติ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "รายรับเฉลี่ย", value: "0", unit: "บ./เดือน", color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
              { label: "ค่าใช้จ่ายเฉลี่ย", value: "0", unit: "บ./เดือน", color: "#991B1B", bg: "#FEF2F2", border: "#FECACA" },
              { label: "อัตราเข้าพักเฉลี่ย", value: "0", unit: "%", color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
              { label: "ผู้เช่าใหม่ปีนี้", value: "0", unit: "คน", color: "#1E40AF", bg: "#EFF6FF", border: "#BFDBFE" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>
                  {item.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: item.color }}>{item.value}</span>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#9CA3AF" }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* หัวตาราง */}
          <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "4px", height: "18px", background: "#8B5E3C", borderRadius: "2px" }} />
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#1F2937" }}>ข้อมูลรายเดือน ปี 2026</span>
          </div>

          {/* ตาราง */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#F3F4F6" }}>
                <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>เดือน</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>รายรับ (บาท)</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>รายจ่าย (บาท)</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>อัตราเข้าพัก (%)</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>ผู้เช่าใหม่ (คน)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#9CA3AF", fontWeight: "600", border: "1px solid #E5E7EB" }}>
                    ไม่มีข้อมูลรายงาน
                  </td>
                </tr>
              ) : (
                reportData.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB" }}>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: "700", color: "#1F2937", border: "1px solid #E5E7EB" }}>{row.month}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: "700", color: "#065F46", border: "1px solid #E5E7EB" }}>{row.revenue.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: "700", color: "#991B1B", border: "1px solid #E5E7EB" }}>{row.expenses.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: "600", color: "#374151", border: "1px solid #E5E7EB" }}>{row.occupancyRate}%</td>
                    <td style={{ padding: "9px 14px", textAlign: "center", fontWeight: "700", color: "#374151", border: "1px solid #E5E7EB" }}>{row.newTenants}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#D1D5DB", fontWeight: "600" }}>
              Yayee Dormitory Management System
            </span>
            <span style={{ fontSize: "10px", color: "#D1D5DB", fontWeight: "600" }}>
              เอกสารนี้สร้างโดยระบบอัตโนมัติ · ไม่ต้องลงนาม
            </span>
          </div>
        </div>
      </div>

      {/* ============ หน้าจอปกติ (print:hidden) ============ */}

      {/* ส่วนหัว */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">รายงานและสถิติ</h1>
          <p className="text-lg text-[var(--text-muted)] mt-1">สรุปข้อมูลผลประกอบการและการดำเนินงาน</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="glass-button-outline flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all hover:-translate-y-0.5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 18H3"/><path d="m9 14 3 4-3 4"/><path d="M21 15v-1a2 2 0 0 0-2-2H9"/><path d="M14 2H6a2 2 0 0 0-2 2v6"/></svg>
            ส่งออก CSV
          </button>
          <button onClick={exportPDF} className="glass-button flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-all shadow-md group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            ส่งออก PDF
          </button>
        </div>
      </div>

      {/* สรุปสถิติ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10 print:hidden">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-light)] rounded-full mix-blend-multiply filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
          <p className="text-sm font-bold text-[var(--text-muted)] mb-2 relative z-10">รายรับเฉลี่ย</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold text-[var(--text-main)] drop-shadow-sm">0</span>
            <span className="text-sm font-semibold text-[var(--text-muted)]">บ./เดือน</span>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <p className="text-sm font-bold text-[var(--text-muted)] mb-2 relative z-10">ค่าใช้จ่ายเฉลี่ย</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold text-[var(--text-main)] drop-shadow-sm">0</span>
            <span className="text-sm font-semibold text-[var(--text-muted)]">บ./เดือน</span>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-brown)] rounded-full mix-blend-multiply filter blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <p className="text-sm font-bold text-[var(--text-muted)] mb-2 relative z-10">อัตราเข้าพักเฉลี่ย</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold text-[var(--text-main)] drop-shadow-sm">0</span>
            <span className="text-sm font-semibold text-[var(--text-muted)]">%</span>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <p className="text-sm font-bold text-[var(--text-muted)] mb-2 relative z-10">ผู้เช่าใหม่ปีนี้</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold text-[var(--text-main)] drop-shadow-sm">0</span>
            <span className="text-sm font-semibold text-[var(--text-muted)]">คน</span>
          </div>
        </div>
      </div>

      {/* ข้อมูลตาราง */}
      <div className="glass-panel rounded-3xl overflow-hidden relative z-10 print:hidden">
        <div className="p-6 border-b border-[var(--glass-border)] bg-white/40 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-[var(--text-main)]">ข้อมูลรายเดือน ปี 2026</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs font-bold text-[var(--text-muted)] bg-[var(--glass-bg)] uppercase border-b border-[var(--glass-border)]">
              <tr>
                <th className="px-6 py-4 font-bold text-center">เดือน</th>
                <th className="px-6 py-4 font-bold text-right">รายรับ (บาท)</th>
                <th className="px-6 py-4 font-bold text-right">รายจ่าย (บาท)</th>
                <th className="px-6 py-4 font-bold text-center">อัตราการเข้าพัก (%)</th>
                <th className="px-6 py-4 font-bold text-center">ผู้เช่าใหม่ (คน)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/60 transition-colors border-b border-[var(--glass-border)]">
                  <td className="px-6 py-4 font-bold text-[var(--text-main)] text-center">{row.month}</td>
                  <td className="px-6 py-4 text-right text-emerald-700 font-bold">{row.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-red-700 font-bold">{row.expenses.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-[var(--text-main)] font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-white/60 rounded-full overflow-hidden border border-[var(--glass-border)] shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[var(--accent-brown)] to-[var(--accent-dark)] rounded-full" style={{ width: `${row.occupancyRate}%` }} />
                      </div>
                      <span>{row.occupancyRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--text-main)] font-bold">{row.newTenants}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 18H3"/><path d="m9 14 3 4-3 4"/><path d="M21 15v-1a2 2 0 0 0-2-2H9"/><path d="M14 2H6a2 2 0 0 0-2 2v6"/></svg>
                      <p className="font-bold">ไม่มีข้อมูลรายงาน</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
