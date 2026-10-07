# BitTab

**Sua nova guia. Do seu jeito.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Repositório: [github.com/alefurquim1/bittab](https://github.com/alefurquim1/bittab)

BitTab é uma página inicial / Nova Guia personalizada para navegadores, com foco em produtividade, acesso rápido e personalização visual.

## Funcionalidades

- Relógio em tempo real com saudação e data
- Barra de busca com vários mecanismos
- Atalhos editáveis (arraste para reordenar)
- Widgets: clima real, notas rápidas, tarefas, pomodoro, cotação de moedas, teste de conexão e plataformas por categoria
- Temas: escuro, claro, sistema e hacker/cyberpunk
- Plano de fundo personalizável (wallpapers, gradiente, cor sólida ou imagem própria)
- Interface em português, inglês e espanhol
- Tudo salvo localmente no navegador

## Extensão para navegador

- **Firefox**: instale diretamente pelo [Firefox Add-ons](https://addons.mozilla.org/pt-BR/firefox/addon/bittab/).
- **Chrome, Edge e Brave**: baixe o arquivo `bittab-extensao.zip` em **Personalizar → Geral**, descompacte e carregue sem compactação em `chrome://extensions`.

## Página inicial

Para usar o BitTab como página inicial, copie o endereço em **Personalizar → Geral → Definir como página inicial** e cole nas configurações do navegador.

## Desenvolvimento

```sh
bun install
bun run dev
```

Outros comandos úteis:

```sh
bun run build   # gera a versão de produção
bun run lint    # verifica o código
bun run format  # organiza o formato do código
```

## Contribuindo

Correções, melhorias e novos widgets são bem-vindos. Abra uma issue antes de começar uma mudança grande e veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Marca

O nome **BitTab**, o logotipo e a identidade visual da **Bit01Tec** (@bit01tec, [www.bit01tec.com.br](https://www.bit01tec.com.br)) **não** estão incluídos nesta licença. Ao copiar ou redistribuir o código, remova ou substitua o nome, o logotipo, os links e demais sinais distintivos — a licença cobre apenas o software.

## Licença

Distribuído sob a licença [MIT](LICENSE). © 2026 Alexandre Furquim (Bit01Tec).

Resumo: você pode usar, estudar, modificar e redistribuir o código, inclusive comercialmente, desde que mantenha o aviso de copyright e esta licença nas cópias. O software é fornecido sem garantias. A marca segue a seção acima.

## Tecnologias

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS
