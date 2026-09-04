import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ZIP_PATH = "/bittab-extensao.zip";

const STORE_PACKAGES = [
  {
    file: "bittab-chrome-webstore.zip",
    label: "Pacote Chrome Web Store",
    portal: "https://chromewebstore.google.com/category/extensions",
    portalLabel: "Chrome Web Store",
  },
  {
    file: "bittab-firefox-addons.zip",
    label: "Pacote Firefox Add-ons",
    portal: "https://addons.mozilla.org/en-US/firefox/extensions/",
    portalLabel: "Firefox Add-ons",
  },
];

/**
 * Download + install instructions for the browser extension that turns
 * BitTab into the browser's new tab page (Chrome, Edge, Brave, Firefox).
 */
export function ExtensionCard() {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(ZIP_PATH);
      if (!res.ok) throw new Error(`Falha ao baixar (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bittab-extensao.zip";
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Download iniciado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível baixar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-glass-border p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Usar como Nova Guia do navegador</p>
        <p className="text-xs text-muted-foreground">
          Baixe a extensão e o BitTab abre sozinho a cada nova guia no Chrome, Edge, Brave ou Firefox.
        </p>
      </div>

      <Button type="button" onClick={download} disabled={busy} className="w-full">
        <Download className="size-4" aria-hidden />
        {busy ? "Preparando…" : "Baixar extensão"}
      </Button>

      <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
        <li>Descompacte o arquivo baixado.</li>
        <li>
          No Chrome, Edge ou Brave: abra <span className="font-medium text-foreground">chrome://extensions</span>, ative
          o <span className="font-medium text-foreground">Modo do desenvolvedor</span> e clique em{" "}
          <span className="font-medium text-foreground">Carregar sem compactação</span>, escolhendo a pasta.
        </li>
        <li>
          No Firefox: abra <span className="font-medium text-foreground">about:debugging</span> →{" "}
          <span className="font-medium text-foreground">Este Firefox</span> →{" "}
          <span className="font-medium text-foreground">Carregar temporário</span> e escolha o arquivo{" "}
          <span className="font-medium text-foreground">manifest.json</span>.
        </li>
        <li>Abra uma nova guia. Para trocar o endereço exibido, use as opções da extensão.</li>
      </ol>
    </div>
  );
}
