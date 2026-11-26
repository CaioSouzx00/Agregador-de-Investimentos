import { ArrowLeft, ArrowUpRight, LockKeyhole } from 'lucide-react';

const routes: [string, string, string, boolean][] = [
  ['POST', '/v1/auth/login', 'Autentica usuário e retorna token JWT', false],
  ['POST', '/v1/users', 'Cria usuário', false],
  ['GET', '/v1/users', 'Lista usuários', true],
  ['GET · PUT · DELETE', '/v1/users/{userId}', 'Consulta, atualiza ou remove usuário', true],
  ['POST · GET', '/v1/users/{userId}/accounts', 'Cria ou lista contas do usuário', true],
  ['GET', '/v1/users/{userId}/valuation', 'Consulta valuation agregado do usuário', true],
  ['POST · GET', '/v1/stocks', 'Registra ou lista ações', true],
  ['GET', '/v1/stocks/{stockId}', 'Consulta ação', true],
  ['GET', '/v1/stocks/{stockId}/quote', 'Consulta cotação de mercado', true],
  ['POST · GET', '/v1/accounts/{accountId}/stocks', 'Associa ou consulta posições', true],
  ['GET', '/v1/accounts/{accountId}/valuation', 'Consulta valuation da conta', true],
];
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ApiPage() {
  return <main className="min-h-screen px-6 py-12 lg:px-10"><div className="mx-auto max-w-5xl"><a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-mint"><ArrowLeft size={16}/> Página inicial</a><p className="mt-12 text-xs font-semibold uppercase tracking-[.2em] text-mint">Referência da API</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Endpoints disponíveis</h1><p className="mt-4 max-w-2xl leading-7 text-slate-400">Resumo das rotas existentes. Para detalhes de parâmetros, schemas e respostas, consulte a especificação OpenAPI gerada pelo backend.</p><a className="mt-7 inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-2.5 text-sm font-semibold text-ink" href={`${apiBase}/swagger-ui.html`}>Abrir Swagger UI <ArrowUpRight size={16}/></a><div className="mt-10 overflow-hidden rounded-xl border border-white/10">{routes.map(([method,path,description,auth])=><div key={path} className="grid gap-2 border-b border-white/[.07] bg-[#0b1714] px-5 py-4 last:border-0 sm:grid-cols-[150px_1fr_auto] sm:items-center"><span className="font-mono text-xs font-semibold text-mint">{method}</span><span><code className="text-sm text-slate-200">{path}</code><span className="mt-1 block text-xs text-slate-500">{description}</span></span>{auth && <span className="flex items-center gap-1 text-xs text-slate-500"><LockKeyhole size={12}/> Bearer JWT</span>}</div>)}</div><p className="mt-5 text-xs leading-5 text-slate-500">As rotas protegidas exigem o header <code>Authorization: Bearer &lt;token&gt;</code>. Base configurada: <code>{apiBase}</code>.</p></div></main>;
}
