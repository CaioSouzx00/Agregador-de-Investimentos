# Agregador de Investimentos

API REST em **Java 21 + Spring Boot 3.5** para agregar contas de
investimento, endereços de cobrança e ações (stocks) associadas a cada
conta. Os dados são persistidos em **MySQL** via **Spring Data JPA**.

---

## 1. Visão Geral

O sistema permite:

- Cadastrar usuários (`users`)
- Cadastrar contas de investimento (`accounts`) vinculadas a um usuário
- Registrar o endereço de cobrança (`billing_address`) de cada conta
- Cadastrar ações/ativos (`stocks`)
- Associar ações a uma conta com quantidade (`account_stocks`)

Cada usuário pode ter várias contas; cada conta tem um endereço de
cobrança (relacionamento 1:1) e várias posições em ações (relacionamento
1:N).

---

## 2. Stack Tecnológica

| Camada          | Tecnologia                              |
|-----------------|-----------------------------------------|
| Linguagem       | Java 21                                 |
| Framework       | Spring Boot 3.5 (starter parent)       |
| Web             | Spring Web (REST controllers)          |
| Persistência    | Spring Data JPA + Hibernate             |
| Banco de dados | MySQL (driver `mysql-connector-j`)     |
| Testes          | JUnit 5 + Mockito + Spring Boot Test   |
| Build           | Maven (wrapper `mvnw`)                 |
| Infra (dev)     | Docker Compose (MySQL 8)               |

---

## 3. Arquitetura (Camadas)

O projeto segue a arquitetura em camadas clássica do Spring:

```
        HTTP Request
              |
              v
   +-----------------------+
   |   CONTROLLER          |  <- @RestController  (camada de apresentação / API)
   |   (Controller/*.java) |     recebe o JSON, valida via DTO, chama o Service
   +-----------------------+
              |
              v
   +-----------------------+
   |   SERVICE             |  <- @Service  (regras de negócio)
   |   (service/*.java)    |     orquestra entidades e repositorios
   +-----------------------+
              |
              v
   +-----------------------+
   |   REPOSITORY          |  <- JpaRepository  (acesso a dados)
   |   (repository/*.java) |
   +-----------------------+
              |
              v
   +-----------------------+
   |   ENTITY / DB         |  <- @Entity + MySQL
   |   (entity/*.java)     |
   +-----------------------+
```

Os `DTOs` (`Controller/Dto/*.java`) isolam a representação externa da
API do modelo de domínio (entidades JPA), evitando vazamento da estrutura
interna do banco.

---

## 4. Diagrama de Entidades (MER)

```
 +------------------+          +------------------+          +---------------------+
 |     tb_users     | 1      N |    tb_accounts   | 1      1 |  tb_billingaddress |
 +------------------+----------+                  +----------+---------------------+
 | userId (PK,UUID) |   mappedBy "user"          | account_id (PK,FK,UUID)|<--@MapsId
 | username         |<--------- user_id (FK)      | user_id (FK)            | account (1:1)
 | email            |          | description       | description             | street
 | password         |          |                   |                         | number
 | creationTimestamp|          |                   |                         |
 | updateTimestamp  |          |                   |                         |
 +------------------+          +------------------+                         +---------------------+
        ^                                   |
        |                                   | 1
        |                                   |
        |                       +-----------+-----------+
        |                       |   tb_accounts_stocks |
        |                       +-----------------------+
        |                       | account_id (PK,FK)   |<-- @MapsId("accountId")
        +-----------------------| stock_id   (PK,FK)   |<-- @MapsId("stockId")
                                | quantity             |
                                +-----------------------+
                                           |
                                           | N
                                           v
                                +------------------+
                                |    tb_stocks     |
                                +------------------+
                                | stock_id (PK)   |
                                | description     |
                                +------------------+
```

### Cardinalidades
- **User (1) ── (N) Account**: um usuário possui várias contas.
- **Account (1) ── (1) BillingAddress**: endereço compartilha a PK da conta (`@MapsId`).
- **Account (1) ── (N) AccountStock**: posição em ações por conta.
- **Stock (1) ── (N) AccountStock**: uma ação aparece em várias contas.

A tabela `tb_accounts_stocks` é uma **entidade associativa** com chave
composta (`AccountStockId`: `accountId` + `stockId`).

---

## 5. Fluxo de uma requisição (ex.: criar conta)

```
Client  ──POST /v1/users/{userId}/accounts──▶  UserController.createAccount()
                                                    |
                                                    v
                                              UserService.createAccount()
                                                    |
                         1. busca User (404 se nao existir)
                         2. cria Account (UUID gerado automaticamente)
                         3. cria BillingAddress (@MapsId = accountId)
                                                    |
                                                    v
                       AccountRepository.save() + BillingAddressRepository.save()
                                                    |
                                                    v
                                          ResponseEntity 200 OK
```

---

## 6. Estrutura de Pastas

```
Agregador-de-Investimentos/
├── docker-compose.yml
├── pom.xml
├── mvnw / mvnw.cmd
├── .mvn/
└── src/
    ├── main/
    │   ├── java/caio/buindrum/agregadordeinvestimentos/
    │   │   ├── AgregadordeinvestimentosApplication.java
    │   │   ├── Controller/
    │   │   │   ├── UserController.java
    │   │   │   ├── AccountController.java
    │   │   │   ├── StockController.java
    │   │   │   └── Dto/
    │   │   │       ├── CreateUserDto.java
    │   │   │       ├── UpdateUserDto.java
    │   │   │       ├── UserResponseDto.java
    │   │   │       ├── CreateAccountDto.java
    │   │   │       ├── AccountResponseDto.java
    │   │   │       ├── CreateStockDto.java
    │   │   │       ├── AssociateAccountStock.java
    │   │   │       └── AccountStockResponseDto.java
    │   │   ├── service/
    │   │   │   ├── UserService.java
    │   │   │   ├── AccountService.java
    │   │   │   └── StockService.java
    │   │   ├── repository/
    │   │   │   ├── UserRepository.java
    │   │   │   ├── AccountRepository.java
    │   │   │   ├── BillingAddressRepository.java
    │   │   │   ├── StockRepository.java
    │   │   │   └── AccountStockRepository.java
    │   │   └── entity/
    │   │       ├── User.java
    │   │       ├── Account.java
    │   │       ├── BillingAddress.java
    │   │       ├── Stock.java
    │   │       ├── AccountStock.java
    │   │       └── AccountStockId.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/caio/buindrum/agregadordeinvestimentos/
            ├── AgregadordeinvestimentosApplicationTests.java
            └── service/UserServiceTest.java
```

---

## 7. Endpoints da API

### Usuários — `/v1/users`
| Método | Rota                       | Ação                              |
|--------|----------------------------|-----------------------------------|
| POST   | `/v1/users`               | Cria usuário                      |
| GET    | `/v1/users/{userId}`      | Busca usuário por ID             |
| GET    | `/v1/users`               | Lista todos os usuários           |
| PUT    | `/v1/users/{userId}`      | Atualiza username/senha           |
| DELETE | `/v1/users/{userId}`      | Remove usuário                    |
| POST   | `/v1/users/{userId}/accounts` | Cria conta + endereço p/ usuário |
| GET    | `/v1/users/{userId}/accounts` | Lista contas do usuário         |

### Contas — `/v1/accounts`
| Método | Rota                              | Ação                          |
|--------|-----------------------------------|-------------------------------|
| POST   | `/v1/accounts/{accountId}/stocks` | Associa ação à conta          |
| GET    | `/v1/accounts/{accountId}/stocks` | Lista ações da conta          |

### Ações — `/v1/stocks`
| Método | Rota          | Ação              |
|--------|---------------|-------------------|
| POST   | `/v1/stocks`  | Cadastra ação     |

### Exemplos de payload
```json
// POST /v1/users
{ "username": "caio", "email": "caio@email.com", "password": "123" }

// POST /v1/users/{userId}/accounts
{ "description": "Conta XP", "street": "Rua A", "number": 100 }

// POST /v1/stocks
{ "stockId": "PETR4", "description": "Petrobras PN" }

// POST /v1/accounts/{accountId}/stocks
{ "stockId": "PETR4", "quantity": 50 }
```

---

## 8. Como executar

### Pré-requisitos
- Java 21
- Maven 3.9+ (ou usar o wrapper `mvnw`)
- Docker + Docker Compose

### 1. Subir o MySQL
```bash
docker compose up -d
```
Cria o banco `agregadordeinvestimentos` em `localhost:3307` (root/root).

### 2. Rodar a aplicação
```bash
./mvnw spring-boot:run
```
A API fica disponível em `http://localhost:8080`.

### 3. Rodar os testes
```bash
./mvnw test
```

---

## 9. Configuração (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/agregadordeinvestimentos
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```
> `ddl-auto=update` cria/atualiza as tabelas automaticamente no startup
> (somente para desenvolvimento).

---

## 10. Correções de erros aplicadas neste projeto

Durante a revisão do código, os seguintes problemas foram identificados
e corrigidos:

| # | Arquivo / Local                         | Problema                                             | Correção                                                  |
|---|-----------------------------------------|------------------------------------------------------|-----------------------------------------------------------|
| 1 | `entity/User.java`                      | `@Id` sem `@GeneratedValue` (ID nunca gerado)         | Adicionado `@GeneratedValue(strategy = UUID)`              |
| 2 | `entity/User.java`                      | `List<Account> accounts` sem init → `NullPointer` ao listar contas | Inicializado com `new ArrayList<>()`            |
| 3 | `Controller/StockController.java`       | Método mapeado chamava-se `createUser` (nome errado) | Renomeado para `createStock`                              |
| 4 | `resources/application.properties`      | Dialect `MySQLDialect` depreciado                     | Trocado por `org.hibernate.dialect.MySQL8Dialect`         |
| 5 | `pom.xml`                              | Tags vazias (`license`, `developer`, `scm`) e versão fixa do MySQL `9.0.0` | Removidas tags vazias; driver como `runtime`, versão gerenciada pelo Spring |
| 6 | `test/UserServiceTest.java` (`deleteById`) | Verificava `existsById` duas vezes em vez de `deleteById` | Corrigido para `verify(...).deleteById(...)`             |

---

## 11. Observações / possíveis melhorias
- `createAccount` cria `BillingAddress` separadamente; com
  `cascade = CascadeType.ALL` no `Account.billingAddress` daria para
  salvar os dois em uma única operação.
- `AccountStockResponseDto` retorna `total` fixo em `0.0` — seria
  interessante calcular `quantity * preco` (precisaria de um campo de
  preço na entidade `Stock`).
- Não há validação de entrada (`@Valid` / `Bean Validation`) nem
  tratamento global de exceções (`@ControllerAdvice`).
- Senhas são armazenadas em texto puro — recomenda-se
  `BCryptPasswordEncoder`.
