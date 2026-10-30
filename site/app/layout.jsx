import "./globals.css";
import { Header, Footer, Motion } from "../components/Shell";
import Loader from "../components/Loader";
import { content, copy, siteUrl } from "../lib/content";
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: content.company.name,
    description: content.company.tagline,
    url: siteUrl,
    siteName: content.company.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/img/og.png",
        width: 1200,
        height: 630,
        alt: content.company.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.company.name,
    description: content.company.tagline,
    images: ["/img/og.png"],
  },
  icons: { icon: "/icon.svg" },
};
export default function Layout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      color-scheme="dark"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/funnel-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/funnel-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/img/loader-d-shell.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/img/loader-d-wave.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('dn-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;document.documentElement.setAttribute('color-scheme',t)}}catch(e){}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-dn-loading','');window.dnLoadingTimeout=setTimeout(function(){document.documentElement.removeAttribute('data-dn-loading');window.dispatchEvent(new Event('dn:loaded'))},4500)}`,
          }}
        />
      </head>
      <body>
        <Loader />
        <Header />
        {children}
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
