import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:"رأس المال",description:"منصة محاكاة الأعمال والاستثمار"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
