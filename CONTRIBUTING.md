# Contribuindo ao BitTab

Obrigado pelo interesse em melhorar o BitTab. Este documento explica como participar.

## Antes de começar

- **Bugs e sugestões**: abra uma issue descrevendo o comportamento esperado e o atual, com passos para reproduzir e, se possível, o navegador e a versão da extensão.
- **Mudanças grandes** (novo widget, nova categoria de links, alteração de interface): abra uma issue antes de programar, para alinhar a ideia e evitar trabalho perdido.

## Ambiente de desenvolvimento

Pré-requisitos: [Bun](https://bun.sh) e Node.js 20+.

```sh
bun install
bun run dev
```

O site abre em `http://localhost:8080`.

## Fluxo de trabalho

1. Faça um *fork* do repositório e crie um branch a partir da branch principal (`git checkout -b minha-melhoria`).
2. Trabalhe apenas no que a issue propõe — mudanças não relacionadas dificultam a revisão.
3. Rode as verificações antes de enviar:

   ```sh
   bun run lint
   bun run format
   bun run build
   ```

4. Abra um *pull request* explicando **o que** mudou e **por quê**, com capturas de tela quando houver mudança visual.

## Convenções

- Código em TypeScript, componentes React em `src/components/`, rotas em `src/routes/`.
- Textos da interface passam pelo arquivo de traduções (`src/i18n/index.tsx`) e precisam existir em português, inglês e espanhol.
- Novos widgets: criar o componente em `src/components/newtab/`, registrar o tipo e as configurações padrão, e adicionar as traduções.
- Predefinições de atalhos e categorias de links ficam em `src/hooks/useSettings.tsx` e `src/data/linkHub.ts`.
- Preferências do usuário são salvas no navegador; mantenha compatibilidade com dados já existentes.

## Licença e marca

Ao enviar uma contribuição, você concorda que ela seja distribuída sob a licença MIT deste projeto.

Contribuições **não** incluem direito de uso da marca: não adicione o nome BitTab, o logotipo ou a identidade visual da Bit01Tec ao que você enviar.
