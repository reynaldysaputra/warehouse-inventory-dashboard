import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Warehouse Inventory Dashboard",
  description: "Maker-Checker Workflow Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}