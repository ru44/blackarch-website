export default {
  home: {
    copy: "copiar", copied: "copiado", copyLabel: "Copiar comando", quick: "Comando de instalação rápida",
    stats: [
      { n: "2800+", l: "pacotes de ferramentas" },
      { n: "x86_64", l: "+ ARM via Arch ARM" },
      { n: "Rolling", l: "releases via pacman" },
      { n: "2013", l: "primeira versão" },
    ],
    features: [
      { t: "Baseado no Arch", d: "Rolling release, pacman, compatível com o AUR. Sem forks nem versões congeladas." },
      { t: "Qualquer ferramenta com um comando", d: "Mais de 2800 ferramentas, todas disponíveis com pacman -S. Veja a lista na página de ferramentas." },
      { t: "Instalação por categoria", d: "Instale o grupo blackarch completo ou só um deles, como o blackarch-webapp." },
      { t: "Funciona no seu Arch", d: "Adicione o repositório a um sistema existente com o strap.sh. Sem precisar reinstalar." },
    ],
  },
  shots: { title: "Como ele é", full: "ISO completa", slim: "ISO Slim", aria: "Capturas de tela do BlackArch" },
  iso: {
    version: "Versão", size: "Tamanho", download: "Baixar", torrent: "Torrent", copy: "copiar", copied: "copiado",
    tags: ["Recomendada", "Mínima", "Offline", "Máquina virtual"],
    desc: [
      "Desktop XFCE, uma seleção de ferramentas populares e instalador gráfico.",
      "Imagem de boot pequena. Escolha só o que precisa; requer conexão com a internet.",
      "Todas as ferramentas da data da compilação. Pode haver conflitos ao atualizar; para instalação offline.",
      "Imagem pronta para VirtualBox, VMware e QEMU.",
    ],
  },
  people: { copy: "copiar", copied: "copiado", label: "Desenvolvedores do BlackArch" },
  mirrors: {
    title: "Mirrors oficiais do BlackArch Linux",
    summary: (c, m) => `${c} países, ${m} mirrors. Escolha o mais próximo.`,
    placeholder: "Buscar por país ou endereço do mirror…", noMatch: "Nenhum mirror encontrado", clear: "Limpar busca", copy: "copiar", ok: "ok",
  },
  donate: {
    title: "Ajude a manter o BlackArch livre",
    intro: "A equipe trabalha no BlackArch de forma voluntária, no tempo livre. As doações vão apenas para os custos e o desenvolvimento do projeto. Qualquer valor ajuda.",
    method: "Forma de pagamento", paypalTab: "PayPal", btcTab: "Bitcoin",
    paypalText: "Escolha qualquer valor na página segura do PayPal. Cartão ou saldo do PayPal.",
    paypalCta: "Doar com PayPal", wallet: "Abrir na carteira",
    copy: "copiar", copied: "copiado", qrLabel: "QR code do endereço Bitcoin", copyAddr: "Copiar endereço Bitcoin",
    waysTitle: "Outras formas de ajudar",
    costs: [
      { t: "Site e domínio", d: "Hospedagem e domínio blackarch.org." },
      { t: "Mirrors de download", d: "Tráfego e armazenamento para que ISOs e pacotes sejam baixados rápido no mundo todo." },
      { t: "Hardware de build e testes", d: "Máquinas para compilar, assinar e verificar pacotes antes do lançamento." },
      { t: "Desenvolvimento futuro", d: "Novas ferramentas e próximos lançamentos." },
    ],
    ways: [
      { t: "Dê uma estrela", d: "Uma estrela no GitHub ajuda muito.", a: "Abrir GitHub" },
      { t: "Ajude outros usuários", d: "Responda perguntas no Matrix.", a: "Entrar no Matrix" },
      { t: "Traduza", d: "Traduza o guia a partir do código-fonte em LaTeX.", a: "Obter código-fonte" },
      { t: "Patrocínio empresarial", d: "Organizações podem se tornar patrocinadoras oficiais.", a: "Falar com a equipe" },
    ],
  },
  community: {
    channels: [
      { d: "O melhor lugar para pedir ajuda. Chat em tempo real com usuários e a equipe." },
      { d: "Todo o código, scripts de build e o código-fonte do site. Issues e pull requests de qualquer tamanho são bem-vindos." },
      { d: "Novas ferramentas, mirrors e mudanças importantes do projeto. Mencione a gente se achar um bug ou tiver uma ideia." },
      { d: "Vídeos sobre instalação, configuração e uso das principais ferramentas." },
      { d: "Acompanhe o feed de notícias no seu leitor." },
      { d: "Fale diretamente com a equipe principal de desenvolvimento." },
    ],
    newsTitle: "Notícias e atualizações",
    lead: "Estamos sempre trabalhando em novos recursos e melhorias. Você pode acompanhar tudo aqui.",
    updates: [
      { t: "Rastreador de issues", d: "Aqui são registrados e tratados os relatórios de bugs e os pedidos de ferramentas." },
      { t: "Pull requests", d: "O que está sendo empacotado, atualizado e lançado agora." },
      { t: "Anúncios", d: "As novidades saem no Matrix, YouTube e X. Também há um feed RSS." },
    ],
  },
  faq: {
    placeholder: "Buscar no FAQ…", searchLabel: "Buscar perguntas", all: "Todas", noResults: "Nenhuma pergunta encontrada", clear: "Limpar busca",
    copy: "copiar", copied: "copiado", copyLabel: "Copiar comando", count: (n, t) => `${n} de ${t} perguntas`, permalink: "Link para esta pergunta",
  },
  tools: {
    placeholder: "Buscar por nome ou descrição…", searchLabel: "Buscar ferramentas", clear: "Limpar busca", all: "Todas",
    showing: "Mostrando", of: "de", tools: "ferramentas", loading: "Carregando ferramentas…", loadingLabel: "Carregando ferramentas",
    noMatch: "Nenhuma ferramenta encontrada", clearFilters: "Limpar filtros", name: "Nome", version: "Versão", description: "Descrição",
    category: "Categoria", website: "Site", visit: "Visitar site", noSite: "Site não informado", install: "Instalação", copy: "copiar", copied: "copiado",
    copyAria: (n) => `Copiar comando de instalação de ${n}`, expandAria: (n) => `Mostrar detalhes de ${n}`, filterLabel: "Filtrar por categoria",
  },
};
