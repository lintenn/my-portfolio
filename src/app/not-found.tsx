import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <p className="text-gradient font-mono text-7xl font-semibold">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
      <p className="max-w-md text-muted-foreground">
        Maybe it moved, or maybe the link is wrong. You can go back home — or ask the AI assistant what you
        were looking for.
      </p>
      <ButtonLink href="/">
        <ArrowLeft />
        Back home
      </ButtonLink>
    </Container>
  );
}
