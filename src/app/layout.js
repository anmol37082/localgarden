import "bootstrap/dist/css/bootstrap.min.css";
import localFont from "next/font/local";
import Header from "../features/home/components/header";
import FooterSection from "../features/home/components/FooterSection";
import "./globals.css";

const SITE_URL = "https://localgarden.co.in";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Best Organic Liquid Fertilizer for Plant",
    template: "%s | Best Organic Liquid Fertilizer for Plant",
  },
  description:
    "Boost growth naturally with the best organic liquid fertilizer for plants. Perfect for both indoor houseplants and outdoor gardens to deliver lush greens and vibrant blooms fast. Shop now for 100% natural plant care!",
  keywords: [
    "best organic liquid fertilizer for plant",
    "organic liquid fertilizer",
    "plant growth enhancer",
    "indoor plant care",
    "outdoor garden fertilizer",
    "natural plant care",
    "flower booster",
    "bio npk granules",
  ],
  icons: {
    icon: "/weblogo.png",
    shortcut: "/weblogo.png",
    apple: "/weblogo.png",
  },
  openGraph: {
    title: "Best Organic Liquid Fertilizer for Plant",
    description:
      "Boost growth naturally with the best organic liquid fertilizer for plants. Perfect for both indoor houseplants and outdoor gardens to deliver lush greens and vibrant blooms fast. Shop now for 100% natural plant care!",
    url: SITE_URL,
    siteName: "Local Garden",
    images: [
      {
        url: "/weblogo.png",
        width: 512,
        height: 512,
        alt: "Local Garden",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Organic Liquid Fertilizer for Plant",
    description:
      "Boost growth naturally with the best organic liquid fertilizer for plants. Perfect for both indoor houseplants and outdoor gardens to deliver lush greens and vibrant blooms fast. Shop now for 100% natural plant care!",
    images: ["/weblogo.png"],
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Local Garden",
    url: SITE_URL,
    logo: "/weblogo.png",
    sameAs: [
      "https://www.instagram.com/local_garden_in/",
      "https://www.facebook.com/LocalGardenIn",
    ],
    description:
      "Boost growth naturally with the best organic liquid fertilizer for plants. Perfect for both indoor houseplants and outdoor gardens to deliver lush greens and vibrant blooms fast.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["en"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${interTitle.variable} ${interBody.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <FooterSection />
      </body>
    </html>
  );
}
