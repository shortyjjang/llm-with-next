import type { Metadata } from "next";
import "@/assets/styles/globals.css";
import QueryProvider from "@/contexts/query/QueryProvider";
import { I18nProvider } from "@/contexts/i18n/I18nProvider";
import LayoutProvider from "@/contexts/layout/LayoutProvider";
import { useMemo } from "react";

export const metadata: Metadata = {
  title: "LLM 챗봇 플랫폼",
  description: "LLM 챗봇 플랫폼",
  keywords: "LLM, 챗봇, 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <I18nProvider>
            <LayoutProvider>{memoizedChildren}</LayoutProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
