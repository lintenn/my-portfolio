import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container className="flex flex-col items-center gap-6 py-28 text-center">
      <p className="animate-float text-gradient font-mono text-8xl font-semibold">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("description")}</p>
      <ButtonLink href="/">
        <ArrowLeft />
        {t("back")}
      </ButtonLink>
    </Container>
  );
}
