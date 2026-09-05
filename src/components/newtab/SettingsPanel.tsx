import { useRef } from "react";
import { Check, ShieldCheck, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtensionCard } from "@/components/newtab/ExtensionCard";
import { HomepageCard } from "@/components/newtab/HomepageCard";
import { ACCENTS, useI18n, useStore, WALLPAPERS } from "@/hooks/useSettings";
import { LANGUAGES } from "@/i18n";
import { SEARCH_ENGINES } from "@/services/searchService";
import { clearBackgroundImage, saveBackgroundImage } from "@/services/imageStore";
import type { BackgroundKind, Language, SearchEngineId, ThemeMode, WidgetToggles } from "@/types";

interface Props {
  open: boolean;
  tab: string;
  onOpenChange: (open: boolean) => void;
  onTabChange: (tab: string) => void;
}

const WIDGET_KEYS: Array<keyof WidgetToggles> = [
  "weather",
  "notes",
  "links",
  "shortcuts",
  "tasks",
  "pomodoro",
  "currency",
  "speed",
];

export function SettingsPanel({ open, tab, onOpenChange, onTabChange }: Props) {
  const { settings, update, updateBackground } = useStore();
  const { t } = useI18n();
  const bg = settings.background;
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(file: File) {
    if (file.size > 6_000_000) {
      toast.error(t("settings.imageTooBig"));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await saveBackgroundImage(String(reader.result));
      updateBackground({ kind: "image", hasUpload: true });
      toast.success(t("settings.bgUpdated"));
    };
    reader.readAsDataURL(file);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("settings.title")}</SheetTitle>
          <SheetDescription>{t("settings.desc")}</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={onTabChange} className="px-4 pb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">{t("settings.tab.general")}</TabsTrigger>
            <TabsTrigger value="aparencia">{t("settings.tab.visual")}</TabsTrigger>
            <TabsTrigger value="pesquisa">{t("settings.tab.search")}</TabsTrigger>
            <TabsTrigger value="widgets">{t("settings.tab.widgets")}</TabsTrigger>
            <TabsTrigger value="privacidade">
              <ShieldCheck className="size-3.5" aria-hidden />
            </TabsTrigger>
          </TabsList>

          {/* GERAL */}
          <TabsContent value="geral" className="mt-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="set-lang">{t("settings.language")}</Label>
              <Select
                value={settings.language}
                onValueChange={(v) => update({ language: v as Language })}
              >
                <SelectTrigger id="set-lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t("settings.languageHint")}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="set-name">{t("settings.userName")}</Label>
              <Input
                id="set-name"
                value={settings.userName}
                onChange={(e) => update({ userName: e.target.value })}
                placeholder={t("settings.userNamePlaceholder")}
              />
            </div>
            <Row label={t("settings.clock24h")} id="set-24h">
              <Switch id="set-24h" checked={settings.clock24h} onCheckedChange={(v) => update({ clock24h: v })} />
            </Row>
            <Row label={t("settings.seconds")} id="set-sec">
              <Switch id="set-sec" checked={settings.showSeconds} onCheckedChange={(v) => update({ showSeconds: v })} />
            </Row>
            <Row label={t("settings.date")} id="set-date">
              <Switch id="set-date" checked={settings.showDate} onCheckedChange={(v) => update({ showDate: v })} />
            </Row>
            <div className="space-y-1.5">
              <Label htmlFor="set-city">{t("settings.city")}</Label>
              <Input
                id="set-city"
                value={settings.weatherCity}
                onChange={(e) => update({ weatherCity: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("settings.weatherNote")}</p>
            <ExtensionCard />
            <HomepageCard />
          </TabsContent>

          {/* APARÊNCIA */}
          <TabsContent value="aparencia" className="mt-5 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="set-theme">{t("settings.theme")}</Label>
              <Select value={settings.theme} onValueChange={(v) => update({ theme: v as ThemeMode })}>
                <SelectTrigger id="set-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t("settings.theme.dark")}</SelectItem>
                  <SelectItem value="light">{t("settings.theme.light")}</SelectItem>
                  <SelectItem value="system">{t("settings.theme.system")}</SelectItem>
                  <SelectItem value="hacker">{t("settings.theme.hacker")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("settings.accent")}</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={t("settings.accentAria", { name: a.label })}
                    onClick={() => update({ accent: a.value })}
                    className="grid size-8 place-items-center rounded-full border border-glass-border transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    style={{ background: a.value }}
                  >
                    {settings.accent === a.value && <Check className="size-4 text-background" aria-hidden />}
                  </button>
                ))}
              </div>
            </div>

            <SliderRow
              label={t("settings.cardOpacity", { n: settings.cardOpacity })}
              value={settings.cardOpacity}
              onChange={(v) => update({ cardOpacity: v })}
            />

            <div className="space-y-2">
              <Label htmlFor="set-bg">{t("settings.background")}</Label>
              <Select value={bg.kind} onValueChange={(v) => updateBackground({ kind: v as BackgroundKind })}>
                <SelectTrigger id="set-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallpaper">{t("settings.bg.wallpaper")}</SelectItem>
                  <SelectItem value="gradient">{t("settings.bg.gradient")}</SelectItem>
                  <SelectItem value="solid">{t("settings.bg.solid")}</SelectItem>
                  <SelectItem value="image">{t("settings.bg.image")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bg.kind === "wallpaper" && (
              <div className="grid grid-cols-2 gap-2">
                {WALLPAPERS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => updateBackground({ wallpaper: w.id })}
                    className={`h-16 rounded-xl border text-[0.68rem] font-medium text-white/85 transition-transform hover:scale-[1.02] ${
                      bg.wallpaper === w.id ? "accent-glow border-transparent" : "border-glass-border"
                    }`}
                    style={{ background: w.value }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            )}

            {bg.kind === "solid" && (
              <div className="space-y-1.5">
                <Label htmlFor="set-color">{t("settings.color")}</Label>
                <Input
                  id="set-color"
                  type="color"
                  value={bg.color}
                  onChange={(e) => updateBackground({ color: e.target.value })}
                  className="h-10 w-20 p-1"
                />
              </div>
            )}

            {bg.kind === "gradient" && (
              <div className="space-y-1.5">
                <Label htmlFor="set-grad">{t("settings.gradientCss")}</Label>
                <Input
                  id="set-grad"
                  value={bg.gradient}
                  onChange={(e) => updateBackground({ gradient: e.target.value })}
                />
              </div>
            )}

            {bg.kind === "image" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="set-img">{t("settings.imageUrl")}</Label>
                  <Input
                    id="set-img"
                    value={bg.imageUrl}
                    onChange={(e) => updateBackground({ imageUrl: e.target.value, hasUpload: false })}
                    placeholder="https://…/wallpaper.jpg"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="size-3.5" aria-hidden /> {t("settings.upload")}
                  </Button>
                  {bg.hasUpload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await clearBackgroundImage();
                        updateBackground({ hasUpload: false });
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden /> {t("settings.removeUpload")}
                    </Button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label={t("settings.uploadAria")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            <SliderRow
              label={t("settings.blur", { n: bg.blur })}
              value={bg.blur}
              max={30}
              onChange={(v) => updateBackground({ blur: v })}
            />
            <SliderRow
              label={t("settings.opacity", { n: bg.opacity })}
              value={bg.opacity}
              onChange={(v) => updateBackground({ opacity: v })}
            />
            <SliderRow
              label={t("settings.dim", { n: bg.dim })}
              value={bg.dim}
              onChange={(v) => updateBackground({ dim: v })}
            />
          </TabsContent>

          {/* PESQUISA */}
          <TabsContent value="pesquisa" className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="set-engine">{t("settings.engine")}</Label>
              <Select
                value={settings.searchEngine}
                onValueChange={(v) => update({ searchEngine: v as SearchEngineId })}
              >
                <SelectTrigger id="set-engine">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SEARCH_ENGINES).map(([id, e]) => (
                    <SelectItem key={id} value={id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">{t("settings.engineNote")}</p>
          </TabsContent>

          {/* WIDGETS */}
          <TabsContent value="widgets" className="mt-5 space-y-5">
            {WIDGET_KEYS.map((key) => (
              <Row key={key} label={t(`widget.${key}`)} id={`set-w-${key}`}>
                <Switch
                  id={`set-w-${key}`}
                  checked={settings.widgets[key]}
                  onCheckedChange={(v) => update({ widgets: { ...settings.widgets, [key]: v } })}
                />
              </Row>
            ))}
          </TabsContent>

          {/* PRIVACIDADE */}
          <TabsContent value="privacidade" className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p className="text-foreground">{t("settings.privacy1")}</p>
            <p>{t("settings.privacy2")}</p>
            <p>{t("settings.privacy3")}</p>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-normal">{label}</Label>
      <Slider value={[value]} max={max} step={1} onValueChange={([v]) => onChange(v ?? 0)} aria-label={label} />
    </div>
  );
}
