import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}