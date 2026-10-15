// Script de registro técnico do Galo Wars no Anytype
const token = process.env.ANYTYPE_API_KEY || 'addaCb9D4imLnqfbESgmSOahREVy1w4Uo1FHX5MYQMc=';
const space = 'bafyreiesudr3yvac65l3vtyfyu7oesc6cpkr2p5cluqhnhjgvch5shuugy.n5psirv676ui';
const parentCatalogId = 'bafyreicwlrg4hk75l65qmydrylmqvtllrnm66or36coo7a4upof6qza32i';

const markdownContent = `# 🐓 Galo Wars — Tamagotchi & Rinha Cibernética

> O simulador definitivo de Galo-Gotchi, rinha clandestina com anabolizantes, apostas em moeda fictícia ($MILHO) e editor de skins pixel art desenhadas na mão para navegador.

---

### 📌 Ficha Técnica
- **Repositório GitHub:** [https://github.com/ApenasGabs/galo-wars](https://github.com/ApenasGabs/galo-wars)
- **URL em Produção (Vercel):** [https://galo-wars.vercel.app](https://galo-wars.vercel.app)
- **Visibilidade:** Público
- **Stack Principal:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, DaisyUI v5, Lucide Icons, Canvas-Confetti, Web Audio API
- **Plataforma de Deploy:** Vercel (Hobby Team \`Gabs' projects\`)
- **Status:** 🟢 Produção (MVP Entregue)
- **Roda no Homelab:** Não (Frontend Web estático / SPA hospedado na Vercel com persistência via LocalStorage)

---

### 🎯 1. Objetivo & Mecânicas do Jogo

O **Galo Wars** combina a nostalgia dos jogos de bichinho virtual (Tamagotchi/Pou) com humor e alta rejogabilidade:
1. **Galo-Gotchi:**
   - Gestão de status vitais: Fome, Energia, Higiene e Felicidade.
   - Ações: Dar Milho Selecionado (custa 10 $MILHO), Banho de Areia, Treino de Espora e Descanso no Poleiro.
2. **Farmácia Clandestina (Bomba & Risco de Infarto):**
   - Suplementos: Creatina de Granja, Potenay 5000, Trembolona de Aviário, Monster Césio-137 e Elixir Bico de Adamantium.
   - **Risco vs Recompensa:** Doping aumenta brutalmente Força, Velocidade e Defesa, mas eleva o risco de parada cardíaca na rinha.
3. **Arena de Rinha & GaloBet:**
   - Combates automatizados com animações retrô e efeitos sonoros 8-bit.
   - Sistema de apostas com odds dinâmicas contra 5 lutadores clandestinos (de Frango da Sadia até o CYBER-GALO X-9000).
   - Eventos de golpe crítico e chance real de piripaque por excesso de doping!
4. **Skin Studio (Desenho na Mão):**
   - Canvas 16x16 pixel art interativo com lápis, balde de tinta, borracha, conta-gotas e paleta retrô.
   - Presets prontos (Clássico, Cyber Neon, Dourado dos Crias) e botão para vestir a arte diretamente no galo.

---

### 🛠️ 2. Arquitetura Técnica & Decisões de Engenharia

- **Arquitetura 100% Client-Side:** O jogo roda com latência zero e custo de infraestrutura R$ 0,00, persistindo estado (savegame, moedas, status e skin pixel art) em \`localStorage\`.
- **Renderizador de Sprites em Canvas 2D:** \`GaloVisualizer\` desenha a matriz 16x16 com \`image-rendering: pixelated\` e anima respiração sincronizada com os BPMs cardíacos.
- **Sintetizador Sonoro Nativo (Web Audio API):** Som de socos, sininho de rinha ("Ding Ding!"), cacarejos e arpeggios de vitória sintetizados via osciladores, eliminando dependência de arquivos mp3 pesados.
- **Tailwind CSS v4 + DaisyUI:** Layout moderno, responsivo para desktop e mobile, com tema escuro e efeitos de scanlines retrô.

---

### 🚀 3. Comandos de Desenvolvimento e Deploy

\`\`\`bash
# Clonar repositório
git clone https://github.com/ApenasGabs/galo-wars.git
cd galo-wars

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Deploy na Vercel
vercel --prod
\`\`\`

---

### 📂 4. Estrutura de Arquivos

\`\`\`text
galo-wars/
├── src/
│   ├── components/
│   │   ├── FarmaciaClandestina.tsx  # Loja de bombas e monitor cardíaco
│   │   ├── GaloGotchi.tsx           # Galinheiro, status vitais e ações
│   │   ├── GaloVisualizer.tsx       # Renderizador de pixel art em Canvas 2D
│   │   ├── Navbar.tsx               # Barra superior, saldo $MILHO e abas
│   │   ├── RinhaArena.tsx           # Octógono de combate e GaloBet
│   │   └── SkinStudio.tsx           # Editor pixel art 16x16 na mão
│   ├── hooks/
│   │   └── useGameState.ts          # State machine e persistência local
│   ├── types/
│   │   └── game.ts                  # Tipagens TypeScript do jogo
│   ├── utils/
│   │   ├── audio.ts                 # Sintetizador sonoro Web Audio API
│   │   └── constants.ts             # Sprite padrão 16x16, bombas e oponentes
│   ├── App.tsx                      # Componente raiz e toasts
│   ├── index.css                    # Estilos globais e Tailwind v4
│   └── main.tsx                     # Entrypoint React 19
├── index.html                       # HTML base com fontes retrô
├── package.json
└── vite.config.ts
\`\`\`
`;

async function run() {
  console.log('1. Criando objeto no Anytype...');
  const res = await fetch('http://192.168.31.60:31009/v1/spaces/' + space + '/objects', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type_key: 'page',
      name: '🐓 Galo Wars — Tamagotchi & Rinha Cibernética',
      body: markdownContent,
      properties: [
        { key: 'created_in_context', objects: [parentCatalogId] }
      ]
    })
  });

  const data = await res.json();
  console.log('Create result:', res.status, data);

  const newObjectId = data?.object?.id || data?.id;

  if (newObjectId) {
    console.log('2. Vinculando à lista do Catálogo de Projetos...');
    const resList = await fetch('http://192.168.31.60:31009/v1/spaces/' + space + '/lists/' + parentCatalogId + '/objects', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ objects: [newObjectId] })
    });
    console.log('Add to list status:', resList.status);

    console.log('3. Atualizando link no documento Pai...');
    try {
      const resParent = await fetch('http://192.168.31.60:31009/v1/spaces/' + space + '/objects/' + parentCatalogId, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const parentData = await resParent.json();
      const parentMarkdown = parentData?.object?.markdown || '';

      const galoLine = '- **[Galo Wars](anytype://object?objectId=' + newObjectId + '&spaceId=' + space + ')** — Simulador de Tamagotchi, rinha de galo cibernética com bombas e apostas no navegador ([Demo na Vercel](https://galo-wars.vercel.app)).\n';

      if (!parentMarkdown.includes('Galo Wars')) {
        const updatedMarkdown = parentMarkdown + '\n' + galoLine;
        await fetch('http://192.168.31.60:31009/v1/spaces/' + space + '/objects/' + parentCatalogId, {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ markdown: updatedMarkdown })
        });
        console.log('Parent markdown updated with Galo Wars reference!');
      }
    } catch (e) {
      console.warn('Erro ao atualizar parent markdown:', e.message);
    }
  }

  console.log('Registro concluído com sucesso!');
}

run().catch(console.error);
