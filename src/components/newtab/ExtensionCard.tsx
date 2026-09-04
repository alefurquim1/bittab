import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useSettings";

const ZIP_PATH = "/bittab-extensao.zip";

/**
 * Download + install instructions for the browser extension that turns
 * BitTab into the browser's new tab page (Chrome, Edge, Brave, Firefox).
 */
export function ExtensionCard() {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(ZIP_PATH);
      if (!res.ok) throw new Error(`${t("ext.failed")} (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "bittab-extensao.zip";
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(t("ext.started"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("ext.failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-glass-border p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">{t("ext.title")}</p>
        <p className="text-xs text-muted-foreground">{t("ext.desc")}</p>
      </div>

      <Button type="button" onClick={download} disabled={busy} className="w-full">
        <Download className="size-4" aria-hidden />
        {busy ? t("ext.preparing") : t("ext.download")}
      </Button>

      <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
        <li>{t("ext.step1")}</li>
        <li>{t("ext.step2")}</li>
        <li>{t("ext.step3")}</li>
        <li>{t("ext.step4")}</li>
      </ol>
    </div>
  );
}
