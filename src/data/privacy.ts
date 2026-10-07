import type { Language } from "@/types";

export type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type PrivacyContent = {
  updated: string;
  intro: string[];
  sections: PrivacySection[];
};

const pt: PrivacyContent = {
  updated: "Última atualização: 7 de outubro de 2026",
  intro: [
    "O BitTab é uma página inicial personalizada que funciona inteiramente no seu navegador. Não criamos contas de usuário, não mantemos banco de dados de pessoas usuárias e não recebemos, armazenamos ou vendemos seus dados pessoais em servidores nossos.",
  ],
  sections: [
    {
      title: "Dados que ficam apenas no seu navegador",
      paragraphs: [
        "Todas as suas informações são salvas localmente (armazenamento local do navegador) e nunca são enviadas para servidores do BitTab:",
      ],
      bullets: [
        "Configurações e preferências: tema, cor de destaque, transparência, plano de fundo, idioma, formato do relógio e widgets ativados.",
        "Seus atalhos, incluindo os dois atalhos iniciais padrão.",
        "Notas rápidas e tarefas.",
        "Estado do Pomodoro (ciclos e fases).",
        "Categorias do LinkHub que você recolheu.",
        "Cidade configurada no widget de clima e preferências de cotação de moedas.",
        "Imagem de fundo enviada por você (guardada no armazenamento local do navegador).",
      ],
    },
    {
      title: "Como apagar seus dados",
      paragraphs: [
        "Como nada sai do seu dispositivo, o controle é todo seu: limpar os dados de navegação do navegador (ou usar as opções \"Limpar notas\" e \"Limpar concluídas\" dos widgets) apaga essas informações permanentemente. Não há como recuperá-las, pois não existem cópias em nossos servidores.",
      ],
    },
    {
      title: "Requisições para serviços externos",
      paragraphs: [
        "O BitTab não insere cookies, rastreadores nem ferramentas de análise próprias. Requisições externas acontecem apenas quando você usa um recurso que precisa delas:",
      ],
      bullets: [
        "Clima (Open-Meteo): o nome da cidade configurada é enviado ao serviço de geocodificação, e a previsão é buscada pelas coordenadas retornadas. A Open-Meteo não usa cookies nem identifica pessoas usuárias.",
        "Cotação de moedas (AwesomeAPI): recebe apenas o par de moedas escolhido (ex.: USD-BRL).",
        "Teste de conexão (speed.cloudflare.com): as medidas de download, upload e latência são feitas diretamente contra servidores da Cloudflare.",
        "Pesquisa na web: o texto digitado é enviado ao mecanismo escolhido (Google, DuckDuckGo, Bing ou outros), que aplica a própria política de privacidade.",
        "Atalhos e plataformas (LinkHub): ao clicar em um link, você é direcionado ao site de destino, que possui política de privacidade própria.",
      ],
    },
    {
      title: "Extensão do navegador",
      paragraphs: [
        "A extensão do BitTab apenas abre o endereço do BitTab em cada nova guia do navegador. Ela não coleta histórico de navegação, não lê o conteúdo de outras páginas e não envia dados para nós.",
      ],
    },
    {
      title: "Seus direitos (LGPD)",
      paragraphs: [
        "Como não coletamos dados pessoais em servidores, não existem dados para solicitar, corrigir ou excluir conosco — tudo permanece no seu navegador, sob seu controle, e pode ser apagado a qualquer momento por você.",
      ],
    },
    {
      title: "Alterações e contato",
      paragraphs: [
        "Esta política pode ser atualizada para refletir mudanças no BitTab; a data no topo indica a versão vigente.",
        "Dúvidas ou solicitações: Alexandre Furquim / Bit01Tec — www.bit01tec.com.br.",
      ],
    },
  ],
};

const en: PrivacyContent = {
  updated: "Last updated: October 7, 2026",
  intro: [
    "BitTab is a personalized start page that runs entirely in your browser. We do not create user accounts, do not keep a user database, and do not receive, store or sell your personal data on our servers.",
  ],
  sections: [
    {
      title: "Data that stays only in your browser",
      paragraphs: [
        "All of your information is saved locally (the browser's local storage) and is never sent to BitTab servers:",
      ],
      bullets: [
        "Settings and preferences: theme, accent color, transparency, background, language, clock format and enabled widgets.",
        "Your shortcuts, including the two default initial shortcuts.",
        "Quick notes and tasks.",
        "Pomodoro state (cycles and phases).",
        "LinkHub categories you collapsed.",
        "The city configured in the weather widget and your currency preferences.",
        "The background image you upload (kept in the browser's local storage).",
      ],
    },
    {
      title: "How to erase your data",
      paragraphs: [
        "Since nothing leaves your device, you are in full control: clearing your browser's browsing data (or using the widgets' \"Clear notes\" and \"Clear completed\" options) erases this information permanently. It cannot be recovered, because no copies exist on our servers.",
      ],
    },
    {
      title: "Requests to external services",
      paragraphs: [
        "BitTab does not add its own cookies, trackers or analytics. External requests happen only when you use a feature that needs them:",
      ],
      bullets: [
        "Weather (Open-Meteo): the configured city name is sent to the geocoding service, and the forecast is fetched using the returned coordinates. Open-Meteo does not use cookies or identify users.",
        "Currency rates (AwesomeAPI): receives only the currency pair you chose (e.g. USD-BRL).",
        "Connection test (speed.cloudflare.com): download, upload and latency are measured directly against Cloudflare servers.",
        "Web search: the text you type is sent to the selected engine (Google, DuckDuckGo, Bing or others), which applies its own privacy policy.",
        "Shortcuts and platforms (LinkHub): clicking a link takes you to the destination site, which has its own privacy policy.",
      ],
    },
    {
      title: "Browser extension",
      paragraphs: [
        "The BitTab extension only opens the BitTab address in each new browser tab. It does not collect browsing history, does not read the content of other pages and does not send data to us.",
      ],
    },
    {
      title: "Your rights (LGPD)",
      paragraphs: [
        "Since we do not collect personal data on servers, there is no data to request, correct or delete from us — everything stays in your browser, under your control, and can be erased by you at any time.",
      ],
    },
    {
      title: "Changes and contact",
      paragraphs: [
        "This policy may be updated to reflect changes in BitTab; the date at the top shows the current version.",
        "Questions or requests: Alexandre Furquim / Bit01Tec — www.bit01tec.com.br.",
      ],
    },
  ],
};

const es: PrivacyContent = {
  updated: "Última actualización: 7 de octubre de 2026",
  intro: [
    "BitTab es una página de inicio personalizada que funciona íntegramente en tu navegador. No creamos cuentas de usuario, no mantenemos una base de datos de personas usuarias y no recibimos, almacenamos ni vendemos tus datos personales en servidores nuestros.",
  ],
  sections: [
    {
      title: "Datos que quedan solo en tu navegador",
      paragraphs: [
        "Toda tu información se guarda localmente (almacenamiento local del navegador) y nunca se envía a servidores de BitTab:",
      ],
      bullets: [
        "Configuraciones y preferencias: tema, color de acento, transparencia, fondo, idioma, formato del reloj y widgets activados.",
        "Tus accesos rápidos, incluidos los dos accesos iniciales predeterminados.",
        "Notas rápidas y tareas.",
        "Estado del Pomodoro (ciclos y fases).",
        "Categorías del LinkHub que colapsaste.",
        "La ciudad configurada en el widget del clima y tus preferencias de cotización de monedas.",
        "La imagen de fondo que subes (guardada en el almacenamiento local del navegador).",
      ],
    },
    {
      title: "Cómo borrar tus datos",
      paragraphs: [
        "Como nada sale de tu dispositivo, el control es totalmente tuyo: borrar los datos de navegación del navegador (o usar las opciones \"Borrar notas\" y \"Borrar completadas\" de los widgets) elimina esta información de forma permanente. No se puede recuperar, porque no existen copias en nuestros servidores.",
      ],
    },
    {
      title: "Solicitudes a servicios externos",
      paragraphs: [
        "BitTab no añade cookies, rastreadores ni herramientas de análisis propias. Las solicitudes externas ocurren solo cuando usas una función que las necesita:",
      ],
      bullets: [
        "Clima (Open-Meteo): el nombre de la ciudad configurada se envía al servicio de geocodificación y la previsión se consulta con las coordenadas devueltas. Open-Meteo no usa cookies ni identifica a las personas usuarias.",
        "Cotización de monedas (AwesomeAPI): recibe solo el par de monedas elegido (p. ej., USD-BRL).",
        "Prueba de conexión (speed.cloudflare.com): la descarga, la subida y la latencia se miden directamente contra servidores de Cloudflare.",
        "Búsqueda en la web: el texto escrito se envía al motor elegido (Google, DuckDuckGo, Bing u otros), que aplica su propia política de privacidad.",
        "Accesos rápidos y plataformas (LinkHub): al pulsar un enlace, eres dirigido al sitio de destino, que tiene su propia política de privacidad.",
      ],
    },
    {
      title: "Extensión del navegador",
      paragraphs: [
        "La extensión de BitTab solo abre la dirección de BitTab en cada nueva pestaña del navegador. No recoge el historial de navegación, no lee el contenido de otras páginas y no nos envía datos.",
      ],
    },
    {
      title: "Tus derechos (LGPD)",
      paragraphs: [
        "Como no recogemos datos personales en servidores, no hay datos que solicitar, corregir o eliminarnos: todo permanece en tu navegador, bajo tu control, y puedes borrarlo en cualquier momento.",
      ],
    },
    {
      title: "Cambios y contacto",
      paragraphs: [
        "Esta política puede actualizarse para reflejar cambios en BitTab; la fecha de arriba indica la versión vigente.",
        "Dudas o solicitudes: Alexandre Furquim / Bit01Tec — www.bit01tec.com.br.",
      ],
    },
  ],
};

export const PRIVACY_CONTENT: Record<Language, PrivacyContent> = { "pt-BR": pt, en, es };
