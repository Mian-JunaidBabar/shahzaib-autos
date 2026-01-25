import { ThemeProvider } from "@/context/theme-context";

export default function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
