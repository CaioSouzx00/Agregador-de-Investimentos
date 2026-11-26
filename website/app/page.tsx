import { ArrowDown, ArrowRight, ArrowUpRight, Blocks, ChartNoAxesCombined, Code2, Database, LockKeyhole, Smartphone, WalletCards } from 'lucide-react';

const repo = 'https://github.com/CaioSouzx00/Agregador-de-Investimentos';
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const stack = ['Java 21', 'Spring Boot 3.5', 'React Native', 'Expo', 'MySQL', 'Docker'];

function Header() {
  return <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
    <a href="#inicio" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-ink"><ChartNoAxesCombined size={20} /></span> <span>invest<span className="text-mint">.</span>aggregator</span></a>
    <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex"><a className="hover:text-white" href="#recursos">Recursos</a><a className="hover:text-white" href="#tecnologia">Tecnologia</a><a className="hover:text-white" href="/api/">API</a><a className="hover:text-white" href="/sobre/">Sobre</a></nav>
    <a href={repo} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-mint/60 hover:text-mint">Ver repositório <ArrowUpRight size={15} /></a>
  </header>;
}

function Hero() {
  return <section id="inicio" className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
    <div className="grid-bg absolute inset-0 opacity-70" /><div className="glow absolute -top-24 left-1/4 h-[540px] w-[700px]" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
      <div><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1.5 text-xs text-mint"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> API de investimentos + app mobile</div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-.055em] sm:text-6xl lg:text-7xl">Sua carteira,<br />em <span className="text-mint">perspectiva.</span></h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Uma base sólida para organizar contas e posições em ações, consultar cotações e acompanhar o valuation do portfólio.</p>
        <div className="mt-9 flex flex-wrap gap-3"><a href={`${apiBase}/swagger-ui.html`} className="inline-flex items-center gap-2 rounded-lg bg-mint px-5 py-3 font-semibold text-ink transition hover:bg-emerald-300">Explorar a API <ArrowRight size={17} /></a><a href="#recursos" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-slate-200 hover:border-white/30">Conhecer o projeto <ArrowDown size={16} /></a></div>
        <div className="mt-10 flex flex-wrap gap-2">{stack.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-xs text-slate-400">{item}</span>)}</div>
      </div>
      <div className="relative mx-auto w-full max-w-lg">
        <div className="absolute -inset-5 rounded-[32px] bg-mint/[.07] blur-2xl" /><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1714]/95 p-6 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">VISÃO GERAL DA CARTEIRA</p><p className="mt-1 text-sm text-slate-300">Todas as contas</p></div><span className="rounded-full border border-mint/20 bg-mint/10 px-2.5 py-1 text-xs text-mint">valuation</span></div>
          <div className="mt-8 rounded-xl border border-white/[.08] bg-black/20 p-4"><div className="flex items-center gap-2"><span className="rounded bg-mint/10 px-2 py-1 font-mono text-[10px] font-bold text-mint">GET</span><code className="text-xs text-slate-300">/v1/users/{"{userId}"}/valuation</code></div><div className="my-4 h-px bg-white/[.07]"/><div className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole size={13} className="text-mint"/> Bearer token · JWT</div></div>
          <div className="mt-5 grid grid-cols-3 gap-3">{["Contas","Posições","Valuation"].map((label,i)=><div key={label} className="rounded-lg border border-white/[.07] bg-white/[.025] p-3"><span className="block h-1 w-6 rounded bg-mint/60"/><span className="mt-3 block text-xs text-slate-400">{label}</span><span className="mt-1 block h-2 w-10 rounded bg-white/10" style={{opacity:.65-i*.12}}/></div>)}</div>
        </div><div className="absolute -bottom-5 -left-8 hidden items-center gap-3 rounded-xl border border-white/10 bg-[#10201b] px-4 py-3 shadow-xl sm:flex"><span className="grid h-9 w-9 place-items-center rounded-lg bg-mint/10 text-mint"><LockKeyhole size={17} /></span><span><span className="block text-xs text-slate-500">Acesso protegido</span><span className="text-sm">Autenticação JWT</span></span></div>
      </div>
    </div>
  </section>;
}

const features = [
  { icon: WalletCards, title: 'Contas e posições', body: 'Organize contas de investimento e associe ativos com suas respectivas quantidades.' },
  { icon: ChartNoAxesCombined, title: 'Valuation de carteira', body: 'Consulte o valor agregado das posições por conta e para o conjunto do usuário.' },
  { icon: LockKeyhole, title: 'API protegida', body: 'Autenticação stateless com JWT, validação de entrada e respostas de erro consistentes.' },
  { icon: Database, title: 'Dados versionados', body: 'Persistência relacional em MySQL com schema evoluído por migrações Flyway.' },
  { icon: Smartphone, title: 'Experiência mobile', body: 'Aplicativo Expo para navegar pelo dashboard, contas e posições da carteira.' },
  { icon: Code2, title: 'API documentada', body: 'Contrato OpenAPI disponível no Swagger UI para explorar os endpoints.' },
];

function Features() {
  return <section id="recursos" className="border-y border-white/[.07] bg-white/[.015] px-6 py-24 lg:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">O que já existe</p><div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Ferramentas essenciais para entender sua carteira.</h2><p className="max-w-md text-sm leading-6 text-slate-400">Uma fundação prática, construída com camadas claras e tecnologias amplamente adotadas.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,title,body})=><article key={title} className="rounded-xl border border-white/[.08] bg-[#0a1512] p-6 transition hover:border-mint/25"><span className="grid h-10 w-10 place-items-center rounded-lg bg-mint/10 text-mint"><Icon size={19} /></span><h3 className="mt-5 font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{body}</p></article>)}</div></div></section>;
}

function Technology() {
  return <section id="tecnologia" className="px-6 py-24 lg:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Stack de tecnologia</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Cada peça no seu lugar.</h2><p className="mt-5 max-w-md leading-7 text-slate-400">Backend, aplicativo e site ficam em projetos independentes dentro do mesmo repositório, com responsabilidades fáceis de localizar.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[{name:'Java 21',desc:'Runtime backend'},{name:'Spring Boot',desc:'API REST'},{name:'React Native',desc:'App mobile'},{name:'Expo',desc:'Toolchain mobile'},{name:'MySQL + Flyway',desc:'Dados e migrations'},{name:'Next.js',desc:'Site estático'}].map((item)=><div key={item.name} className="rounded-xl border border-white/10 bg-white/[.025] p-5"><Blocks size={18} className="text-mint"/><p className="mt-4 font-medium">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.desc}</p></div>)}</div></div></section>;
}

function About() {
  return <section id="sobre" className="px-6 pb-24 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-2xl border border-mint/15 bg-gradient-to-br from-mint/[.08] to-transparent p-8 sm:p-12 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Comece aqui</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight">Conheça a API e explore o código.</h2><p className="mt-3 text-slate-400">Veja os endpoints no Swagger ou acompanhe o desenvolvimento no GitHub.</p></div><div className="flex flex-wrap gap-3"><a href={`${apiBase}/swagger-ui.html`} className="inline-flex items-center gap-2 rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-ink hover:bg-emerald-300">Abrir Swagger <ArrowUpRight size={16}/></a><a href={repo} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm hover:border-white/30">GitHub <ArrowUpRight size={16}/></a></div></div></section>;
}

export default function Home() {
  return <main><Header/><Hero/><Features/><Technology/><About/><footer className="border-t border-white/[.07] px-6 py-7 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-slate-600 sm:flex-row"><span>© {new Date().getFullYear()} Agregador de Investimentos</span><span>Java · Spring Boot · Expo</span></div></footer></main>;
}
