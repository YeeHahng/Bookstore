// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ConfigureAmplify from "@/utils/configure"; // Keep this if you have it

export const metadata: Metadata = {
  title: "Bookstore",
  description: "Shop for your favorite books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigureAmplify /> {/* Keep this if you have it */}
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Bookstore</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/books" className="hover:underline">Books</a></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}