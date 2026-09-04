import { useState } from "react";
import { Copy, Home } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FALLBACK_URL = "https://bittab.lovable.app/";

/**
 * Helper to set BitTab as the browser homepage. Browsers do not allow a page
 * to change this setting, so we copy the address and show where to paste it.
 */
export function HomepageCard() {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.origin + "/" : FALLBACK_URL;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Endereço copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copie manualmente: " + url);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-glass-border p-4">
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Home className="size-4 text-accent-color" aria-hidden /> Definir como página inicial
        </p>
        <p className="text-xs text-muted-foreground">
          Por segurança, os navegadores só permitem essa troca nas próprias configurações. Copie o endereço e cole no
          campo de página inicial.
        </p>
      </div>

      <Button type="button" variant="secondary" onClick={copy} className="w-full">
        <Copy className="size-4" aria-hidden />
        {copied ? "Endereço copiado!" : "Copiar endereço do BitTab"}
      </Button>

      <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
        <li>
          Chrome / Brave: <span className="font-medium text-foreground">chrome://settings/onStartup</span> → "Abrir uma
          página específica" → colar o endereço.
        </li>
        <li>
          Edge: <span className="font-medium text-foreground">edge://settings/startHomeNTP</span> → botão Página
          inicial → colar o endereço.
        </li>
        <li>
          Firefox: <span className="font-medium text-foreground">about:preferences#home</span> → Página inicial →
          "URLs personalizados" → colar o endereço.
        </li>
      </ol>
    </div>
  );
}
