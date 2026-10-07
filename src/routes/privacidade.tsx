import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SettingsProvider, useI18n } from "@/hooks/useSettings";
import { PRIVACY_CONTENT } from "@/data/privacy";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade • BitTab" },
      {
        name: "description",
        content:
          "Saiba quais dados do BitTab ficam apenas no seu navegador e como funcionam as requisições para serviços externos, como clima, cotações e busca.",
      },
      { property: "og:title", content: "Política de Privacidade • BitTab" },
      {
        property: "og:description",
        content:
          "BitTab não cria contas nem guarda seus dados em servidores: tudo fica no seu navegador. Entenda cada recurso externo.",
      },
      { property: "og:url", content: "https://bittab.lovable.app/privacidade" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://bittab.lovable.app/privacidade" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SettingsProvider>
      <PrivacyContent />
      <Toaster />
    </SettingsProvider>
  );
}

function PrivacyContent() {
  const { t } = useI18n();
  const content = PRIVACY_CONTENT[useI18n().lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent-color hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("privacy.back")}
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          {t("privacy.title")}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
          {content.updated}
        </p>

        {content.intro.map((paragraph) => (
          <p key={paragraph} className="mt-5 leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}

        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-14 border-t pt-5 text-center text-[0.66rem] text-muted-foreground">
          BitTab • Sua nova guia. Do seu jeito.
          <span className="mx-1.5 opacity-40">|</span>
          <a
            href="https://www.bit01tec.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-color hover:underline"
          >
            @bit01tec — www.bit01tec.com.br
          </a>
        </footer>
      </main>
    </div>
  );
}
