import { ThemeProvider } from "../components/ThemeProvider";
import { Navbar } from "../components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Cypher — Phishing Detection Platform",
  description:
    "Instantly analyse any URL for phishing indicators, domain age, blacklist membership, and more. Free, fast, and privacy-focused.",
  keywords: "phishing detection, URL scanner, malicious URL, cybersecurity, phishtank",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-text-primary font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="py-12 text-center">
              <div className="max-w-5xl mx-auto px-4">
                <div className="h-px bg-border-solid w-full mb-8 opacity-50" />
                <p className="text-text-muted text-sm font-medium mb-2">
                  © {new Date().getFullYear()} Cypher — Intelligent Security
                </p>
                <p className="text-text-muted/60 text-xs">
                  Built for educational purposes. <span className="text-accent underline decoration-accent/30 underline-offset-4">Free &amp; Open Source.</span>
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
