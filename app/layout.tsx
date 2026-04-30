import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oysterable — Reduce. Collect. Trace.",
  description:
    "AI와 IoT가 도시의 자원을 측정 가능한 흐름으로 만듭니다. 1,041대의 로봇, 112,000명의 시민, 624톤의 자원이 다시 순환했습니다.",
  metadataBase: new URL("https://oysterable.com"),
  openGraph: {
    title: "Oysterable — Reduce. Collect. Trace.",
    description: "The OS for the circular economy. AI · IoT · Urban Circularity.",
    url: "https://oysterable.com",
    siteName: "Oysterable",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
