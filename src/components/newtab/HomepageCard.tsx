import { useState } from "react";
import { Copy, Home } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useSettings";

const FALLBACK_URL = "https://bittab.lovable.app/";

/**
 * Helper to set BitTab as the browser homepage. Browsers do not allow a page
 * to change this setting, so we copy the address and show where to paste it.
 */
export function HomepageCard() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.origin + "/" : FALLBACK_URL;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("home.copiedToast"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("home.copyManual") + url);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-glass-border p-4">
      <div className="space-y-1">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Home className="size-4 text-accent-color" aria-hidden /> {t("home.title")}
        </p>
        <p className="text-xs text-muted-foreground">{t("home.desc")}</p>
      </div>

      <Button type="button" variant="secondary" onClick={copy} className="w-full">
        <Copy className="size-4" aria-hidden />
        {copied ? t("home.copied") : t("home.copy")}
      </Button>

      <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
        <li>{t("home.step1")}</li>
        <li>{t("home.step2")}</li>
        <li>{t("home.step3")}</li>
      </ol>
    </div>
  );
}
