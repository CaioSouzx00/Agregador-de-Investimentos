# Arquitetura

## Backend

O backend usa uma arquitetura em camadas adequada ao tamanho atual da aplicação:

```text
controller/      HTTP, validação e conversão de DTOs
controller/dto/  contratos de request e response
service/         regras de aplicação e coordenação de operações
repository/      persistência via Spring Data JPA
entity/          modelo persistido e relacionamentos JPA
security/        autenticação JWT e configuração do Spring Security
exception/       erros de domínio/API e tratamento global
```

Os controladores mantêm os caminhos e contratos REST existentes. Serviços definem as transações para operações que escrevem em múltiplos registros; os repositórios encapsulam o acesso ao banco.

## Mobile e site

- `mobile/` contém o app Expo organizado por rotas, funcionalidades e componentes compartilhados.
- `website/` é um projeto Next.js independente com App Router e `output: export`; `npm run build` gera HTML estático em `website/out/`.

## Persistência

MySQL é iniciado na raiz com Docker Compose e exposto localmente na porta `3307`. Flyway mantém as migrações em `backend/src/main/resources/db/migration`; Hibernate valida o schema ao iniciar.
