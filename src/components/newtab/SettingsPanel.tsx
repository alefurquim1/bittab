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
import { ACCENTS, useStore, WALLPAPERS } from "@/hooks/useSettings";
import { SEARCH_ENGINES } from "@/services/searchService";
import { clearBackgroundImage, saveBackgroundImage } from "@/services/imageStore";
import type { BackgroundKind, SearchEngineId, ThemeMode, WidgetToggles } from "@/types";

interface Props {
  open: boolean;
  tab: string;
  onOpenChange: (open: boolean) => void;
  onTabChange: (tab: string) => void;
}

const WIDGET_LABELS: Array<{ key: keyof WidgetToggles; label: string }> = [
  { key: "weather", label: "Clima" },
  { key: "notes", label: "Notas rápidas" },
  { key: "tools", label: "Ferramentas" },
  { key: "shortcuts", label: "Atalhos" },
  { key: "tasks", label: "Tarefas" },
  { key: "pomodoro", label: "Pomodoro" },
];

export function SettingsPanel({ open, tab, onOpenChange, onTabChange }: Props) {
  const { settings, update, updateBackground, tools, setTools } = useStore();
  const bg = settings.background;
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(file: File) {
    if (file.size > 6_000_000) {
      toast.error("Imagem muito grande (máx. 6 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await saveBackgroundImage(String(reader.result));
      updateBackground({ kind: "image", hasUpload: true });
      toast.success("Plano de fundo atualizado.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Personalizar</SheetTitle>
          <SheetDescription>Ajuste sua nova guia. Tudo fica salvo neste navegador.</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={onTabChange} className="px-4 pb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="aparencia">Visual</TabsTrigger>
            <TabsTrigger value="pesquisa">Busca</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="privacidade">
              <ShieldCheck className="size-3.5" aria-hidden />
            </TabsTrigger>
          </TabsList>

          {/* GERAL */}
          <TabsContent value="geral" className="mt-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="set-name">Nome do usuário</Label>
              <Input
                id="set-name"
                value={settings.userName}
                onChange={(e) => update({ userName: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <Row label="Formato 24 horas" id="set-24h">
              <Switch id="set-24h" checked={settings.clock24h} onCheckedChange={(v) => update({ clock24h: v })} />
            </Row>
            <Row label="Mostrar segundos" id="set-sec">
              <Switch id="set-sec" checked={settings.showSeconds} onCheckedChange={(v) => update({ showSeconds: v })} />
            </Row>
            <Row label="Mostrar data" id="set-date">
              <Switch id="set-date" checked={settings.showDate} onCheckedChange={(v) => update({ showDate: v })} />
            </Row>
            <div className="space-y-1.5">
              <Label htmlFor="set-city">Cidade do clima</Label>
              <Input
                id="set-city"
                value={settings.weatherCity}
                onChange={(e) => update({ weatherCity: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              O clima é obtido em tempo real, sem necessidade de cadastro ou chave.
            </p>
          </TabsContent>

          {/* APARÊNCIA */}
          <TabsContent value="aparencia" className="mt-5 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="set-theme">Tema</Label>
              <Select value={settings.theme} onValueChange={(v) => update({ theme: v as ThemeMode })}>
                <SelectTrigger id="set-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cor de destaque</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={`Cor de destaque ${a.label}`}
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
              label={`Transparência dos cards (${settings.cardOpacity}%)`}
              value={settings.cardOpacity}
              onChange={(v) => update({ cardOpacity: v })}
            />

            <div className="space-y-2">
              <Label htmlFor="set-bg">Plano de fundo</Label>
              <Select value={bg.kind} onValueChange={(v) => updateBackground({ kind: v as BackgroundKind })}>
                <SelectTrigger id="set-bg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallpaper">Wallpaper</SelectItem>
                  <SelectItem value="gradient">Gradiente</SelectItem>
                  <SelectItem value="solid">Cor sólida</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
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
                <Label htmlFor="set-color">Cor</Label>
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
                <Label htmlFor="set-grad">Gradiente (CSS)</Label>
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
                  <Label htmlFor="set-img">URL da imagem</Label>
                  <Input
                    id="set-img"
                    value={bg.imageUrl}
                    onChange={(e) => updateBackground({ imageUrl: e.target.value, hasUpload: false })}
                    placeholder="https://…/wallpaper.jpg"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload className="size-3.5" aria-hidden /> Enviar imagem
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
                      <Trash2 className="size-3.5" aria-hidden /> Remover envio
                    </Button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Enviar imagem de fundo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            <SliderRow
              label={`Desfoque (${bg.blur}px)`}
              value={bg.blur}
              max={30}
              onChange={(v) => updateBackground({ blur: v })}
            />
            <SliderRow
              label={`Opacidade (${bg.opacity}%)`}
              value={bg.opacity}
              onChange={(v) => updateBackground({ opacity: v })}
            />
            <SliderRow
              label={`Escurecimento (${bg.dim}%)`}
              value={bg.dim}
              onChange={(v) => updateBackground({ dim: v })}
            />
          </TabsContent>

          {/* PESQUISA */}
          <TabsContent value="pesquisa" className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="set-engine">Mecanismo padrão</Label>
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
            <p className="text-xs text-muted-foreground">
              Endereços digitados na barra são abertos diretamente quando reconhecidos como URL.
            </p>
          </TabsContent>

          {/* WIDGETS */}
          <TabsContent value="widgets" className="mt-5 space-y-5">
            {WIDGET_LABELS.map((w) => (
              <Row key={w.key} label={w.label} id={`set-w-${w.key}`}>
                <Switch
                  id={`set-w-${w.key}`}
                  checked={settings.widgets[w.key]}
                  onCheckedChange={(v) => update({ widgets: { ...settings.widgets, [w.key]: v } })}
                />
              </Row>
            ))}

            <div className="space-y-2 border-t border-glass-border pt-4">
              <Label>Links de ferramentas</Label>
              <ul className="space-y-1">
                {tools.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">{t.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Remover ${t.name}`}
                      onClick={() => setTools((prev) => prev.filter((x) => x.id !== t.id))}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
              <form
                className="flex flex-wrap gap-2 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const name = String(data.get("tname") ?? "").trim();
                  const url = String(data.get("turl") ?? "").trim();
                  if (!name || !url) return;
                  setTools((prev) => [...prev, { id: crypto.randomUUID(), name, url }]);
                  e.currentTarget.reset();
                  toast.success("Ferramenta adicionada.");
                }}
              >
                <Input name="tname" placeholder="Nome" className="min-w-24 flex-1" aria-label="Nome da ferramenta" />
                <Input name="turl" placeholder="https://…" className="min-w-32 flex-1" aria-label="URL da ferramenta" />
                <Button type="submit" size="sm">
                  Adicionar
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* PRIVACIDADE */}
          <TabsContent value="privacidade" className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p className="text-foreground">Suas configurações são armazenadas localmente neste navegador.</p>
            <p>
              Nada é enviado para servidores externos. Atalhos, notas, tema e preferências ficam apenas no seu
              dispositivo, e a imagem de fundo enviada é guardada no armazenamento local do navegador.
            </p>
            <p>
              Requisições externas acontecem somente quando você pesquisa, abre um atalho ou configura uma chave de API
              de clima.
            </p>
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
