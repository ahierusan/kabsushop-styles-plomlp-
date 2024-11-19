import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // You can add more weights as needed
  display: "swap",
});

export default function RootLayout({
  children,
  // home,
  shops,
  categories,
}: Readonly<{
  children: React.ReactNode;
  home: React.ReactNode;
  shops: React.ReactNode;
  categories: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
            {categories}
            {shops}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
