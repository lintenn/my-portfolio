import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { localeFromParams } from "@/i18n/server";

export const alt = "Luis Miguel García Marín — Software Engineer · AI & Full-Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Social preview image (LinkedIn, X, Slack…), one per language, generated at build time. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeFromParams(params);
  const { profile, experience } = getContent(locale);
  const t = await getTranslations({ locale, namespace: "Og" });
  const current = experience.find((e) => !e.end);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #17142a 0%, #1e1b4b 55%, #0c4a6e 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: "linear-gradient(100deg, #b45cf6, #6366f1, #38bdf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          LG
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>luismigarcia.com</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
        <div style={{ fontSize: 36, opacity: 0.85 }}>{profile.role}</div>
        {current && (
          <div style={{ fontSize: 28, opacity: 0.65 }}>
            {`${current.role} @ ${current.company} · ${profile.location}`}
          </div>
        )}
      </div>
      <div style={{ display: "flex", fontSize: 26, opacity: 0.8 }}>{t("cta")}</div>
    </div>,
    size,
  );
}
