import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "NyayGrid — Legal Lead Management",
  description: "Premium admin dashboard for managing and assigning legal leads to lawyers. Built for NyayGrid CRM.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}