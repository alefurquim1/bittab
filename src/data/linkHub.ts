export interface LinkItem {
  name: string;
  url: string;
}

export interface LinkCategory {
  id: string;
  icon: string;
  title: string;
  links: LinkItem[];
}

export const LINK_CATEGORIES: LinkCategory[] = [
  {
    id: "trabalho",
    icon: "💼",
    title: "Trabalho",
    links: [
      { name: "LinkedIn", url: "https://www.linkedin.com" },
      { name: "Gmail", url: "https://mail.google.com" },
      { name: "Outlook", url: "https://outlook.live.com" },
      { name: "Google Drive", url: "https://drive.google.com" },
      { name: "Microsoft 365", url: "https://www.office.com" },
      { name: "Slack", url: "https://app.slack.com/client" },
      { name: "Teams", url: "https://teams.microsoft.com" },
      { name: "Trello", url: "https://trello.com" },
      { name: "Notion", url: "https://www.notion.so" },
      { name: "Zoom", url: "https://zoom.us" },
    ],
  },
  {
    id: "tecnologia",
    icon: "💻",
    title: "Tecnologia",
    links: [
      { name: "GitHub", url: "https://github.com" },
      { name: "Stack Overflow", url: "https://stackoverflow.com" },
      { name: "MDN", url: "https://developer.mozilla.org" },
      { name: "Docker", url: "https://hub.docker.com" },
      { name: "npm", url: "https://www.npmjs.com" },
      { name: "Microsoft Learn", url: "https://learn.microsoft.com" },
      { name: "Linux", url: "https://www.kernel.org" },
      { name: "Ubuntu", url: "https://ubuntu.com" },
      { name: "Fedora", url: "https://fedoraproject.org" },
    ],
  },
  {
    id: "seguranca",
    icon: "🛡️",
    title: "Segurança",
    links: [
      { name: "VirusTotal", url: "https://www.virustotal.com" },
      { name: "Have I Been Pwned", url: "https://haveibeenpwned.com" },
      { name: "URLScan", url: "https://urlscan.io" },
      { name: "AbuseIPDB", url: "https://www.abuseipdb.com" },
      { name: "Shodan", url: "https://www.shodan.io" },
      { name: "Censys", url: "https://search.censys.io" },
      { name: "Hybrid Analysis", url: "https://www.hybrid-analysis.com" },
      { name: "CyberChef", url: "https://gchq.github.io/CyberChef" },
      { name: "Exploit Database", url: "https://www.exploit-db.com" },
      { name: "MITRE ATT&CK", url: "https://attack.mitre.org" },
    ],
  },
  {
    id: "ia",
    icon: "🤖",
    title: "IA",
    links: [
      { name: "ChatGPT", url: "https://chatgpt.com" },
      { name: "Gemini", url: "https://gemini.google.com" },
      { name: "Claude", url: "https://claude.ai" },
      { name: "Perplexity", url: "https://www.perplexity.ai" },
      { name: "Microsoft Copilot", url: "https://copilot.microsoft.com" },
      { name: "Hugging Face", url: "https://huggingface.co" },
      { name: "Groq", url: "https://groq.com" },
      { name: "NotebookLM", url: "https://notebooklm.google.com" },
    ],
  },
  {
    id: "entretenimento",
    icon: "📺",
    title: "Entretenimento",
    links: [
      { name: "YouTube", url: "https://www.youtube.com" },
      { name: "Netflix", url: "https://www.netflix.com" },
      { name: "Twitch", url: "https://www.twitch.tv" },
      { name: "Spotify", url: "https://open.spotify.com" },
      { name: "Prime Video", url: "https://www.primevideo.com" },
      { name: "Disney+", url: "https://www.disneyplus.com" },
      { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
    ],
  },
  {
    id: "compras",
    icon: "🛒",
    title: "Compras",
    links: [
      { name: "Amazon", url: "https://www.amazon.com.br" },
      { name: "Mercado Livre", url: "https://www.mercadolivre.com.br" },
      { name: "Shopee", url: "https://shopee.com.br" },
      { name: "AliExpress", url: "https://pt.aliexpress.com" },
      { name: "Kabum", url: "https://www.kabum.com.br" },
      { name: "Magalu", url: "https://www.magazineluiza.com.br" },
    ],
  },
  {
    id: "financas",
    icon: "💰",
    title: "Finanças",
    links: [
      { name: "Nubank", url: "https://app.nubank.com.br" },
      { name: "Inter", url: "https://internetbanking.bancointer.com.br" },
      { name: "Itaú", url: "https://www.itau.com.br" },
      { name: "Santander", url: "https://www.santander.com.br" },
      { name: "Banco do Brasil", url: "https://www.bb.com.br" },
      { name: "Investing", url: "https://br.investing.com" },
      { name: "TradingView", url: "https://www.tradingview.com" },
      { name: "CoinMarketCap", url: "https://coinmarketcap.com" },
    ],
  },
  {
    id: "noticias",
    icon: "📰",
    title: "Notícias",
    links: [
      { name: "Google Notícias", url: "https://news.google.com" },
      { name: "G1", url: "https://g1.globo.com" },
      { name: "UOL", url: "https://www.uol.com.br" },
      { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br" },
      { name: "Tecnoblog", url: "https://tecnoblog.net" },
      { name: "Canaltech", url: "https://canaltech.com.br" },
      { name: "The Hacker News", url: "https://thehackernews.com" },
      { name: "BleepingComputer", url: "https://www.bleepingcomputer.com" },
    ],
  },
  {
    id: "games",
    icon: "🎮",
    title: "Games",
    links: [
      { name: "Steam", url: "https://store.steampowered.com" },
      { name: "Epic Games", url: "https://store.epicgames.com" },
      { name: "Xbox", url: "https://www.xbox.com" },
      { name: "PlayStation", url: "https://www.playstation.com" },
      { name: "Nintendo", url: "https://www.nintendo.com" },
      { name: "Ubisoft", url: "https://www.ubisoft.com" },
      { name: "EA", url: "https://www.ea.com" },
      { name: "Battle.net", url: "https://us.shop.battle.net" },
      { name: "ProtonDB", url: "https://www.protondb.com" },
    ],
  },
  {
    id: "estudos",
    icon: "📚",
    title: "Estudos",
    links: [
      { name: "Coursera", url: "https://www.coursera.org" },
      { name: "Udemy", url: "https://www.udemy.com" },
      { name: "edX", url: "https://www.edx.org" },
      { name: "Khan Academy", url: "https://pt.khanacademy.org" },
      { name: "Google Scholar", url: "https://scholar.google.com" },
      { name: "Wikipedia", url: "https://pt.wikipedia.org" },
      { name: "Duolingo", url: "https://www.duolingo.com" },
    ],
  },
  {
    id: "ferramentas",
    icon: "🧰",
    title: "Ferramentas",
    links: [
      { name: "Speedtest", url: "https://www.speedtest.net" },
      { name: "VirusTotal", url: "https://www.virustotal.com" },
      { name: "Cloudflare", url: "https://dash.cloudflare.com" },
      { name: "DownDetector", url: "https://downdetector.com.br" },
      { name: "Google Translate", url: "https://translate.google.com" },
      { name: "TinyPNG", url: "https://tinypng.com" },
      { name: "Canva", url: "https://www.canva.com" },
      { name: "Photopea", url: "https://www.photopea.com" },
      { name: "Remove.bg", url: "https://www.remove.bg" },
      { name: "Internet Archive", url: "https://archive.org" },
    ],
  },
];
