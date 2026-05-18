import "bootstrap/dist/css/bootstrap.min.css";
import localFont from "next/font/local";
import Header from "../components/header";
import "./globals.css";

const interTitle = localFont({
  src: "../fonts/static/Inter_18pt-SemiBold.ttf",
  display: "swap",
  variable: "--font-inter-title",
});

const interBody = localFont({
  src: "../fonts/static/Inter_18pt-Light.ttf",
  display: "swap",
  variable: "--font-inter-body",
});

export const metadata = {
  title: "PlantBoost",
  description: "Premium plant growth enhancer landing page built with Next.js and Bootstrap.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${interTitle.variable} ${interBody.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}
