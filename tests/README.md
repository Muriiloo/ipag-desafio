# 🧪 Documentação de Testes

Este diretório contém testes unitários essenciais para o sistema de gerenciamento de pedidos, focando na validação de schemas e funções auxiliares.

## 📋 Estrutura dos Testes

```
tests/
├── setup.ts                    # Configuração global dos testes
├── test-runner.ts              # Script customizado para execução
├── README.md                   # Esta documentação
├── utils/                      # Utilitários compartilhados
│   └── test-factories.ts       # Factories para dados de teste
└── unit/                       # Testes unitários
    ├── schemas/               # Validação de schemas Zod
    └── helpers/               # Funções auxiliares
```

## 🎯 Tipos de Testes

### 1. Testes Unitários

**Localização**: `tests/unit/`

Testam unidades isoladas de código, como funções auxiliares e validação de schemas.

#### Schemas Zod (`tests/unit/schemas/`)

- ✅ Validação de entrada corretas
- ✅ Rejeição de dados inválidos
- ✅ Transformações de dados
- ✅ Mensagens de erro personalizadas

#### Funções Auxiliares (`tests/unit/helpers/`)

- ✅ Validação de transições de status
- ✅ Formatação de timestamps
- ✅ Validação de payloads de mensagens

## 🚀 Executando os Testes

### Comandos Principais

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Comandos Específicos

```bash
# Executar apenas testes unitários
npm run test:unit

# Executar teste específico
npx jest tests/unit/schemas/create-order-schema.test.ts

# Executar todos os testes de schemas
npx jest tests/unit/schemas

# Executar todos os testes de helpers
npx jest tests/unit/helpers
```

## 📊 Cobertura de Testes

### Métricas de Cobertura

A suíte de testes visa manter:

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Arquivos Cobertos

```typescript
// Incluídos na cobertura
src/**/*.ts

// Excluídos da cobertura
src/**/*.d.ts          // Arquivos de definição
src/server.ts          // Arquivo principal
src/worker/worker.ts   // Arquivo principal do worker
src/db/migrations/**   // Arquivos de migração
```

## 🛠 Configuração Técnica

### Jest Configuration

```javascript
// jest.config.js
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  testTimeout: 30000
}
```

### Mocks Principais

#### Banco de Dados

```typescript
// Mock do Drizzle ORM
const mockDb = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  // ... outros métodos
};
```

#### RabbitMQ

```typescript
// Mock do RabbitMQ
const mockChannel = {
  sendToQueue: jest.fn(),
  assertQueue: jest.fn(),
  // ... outros métodos
};
```

## 📝 Padrões e Convenções

### Nomenclatura de Testes

```typescript
describe("Módulo/Funcionalidade", () => {
  describe("Cenário Específico", () => {
    it("should comportamento esperado quando condição", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Estrutura AAA (Arrange-Act-Assert)

```typescript
it("should create order successfully", () => {
  // Arrange - Preparar dados e mocks
  const payload = createMockCreateOrderPayload();
  mockDb.returning.mockResolvedValue([mockOrder]);

  // Act - Executar ação
  const result = await createOrder(payload);

  // Assert - Verificar resultado
  expect(result).toHaveProperty("id");
  expect(mockDb.insert).toHaveBeenCalled();
});
```

### Factories de Dados

```typescript
// Usar factories para dados consistentes
const mockCustomer = createMockCustomer();
const mockOrder = createMockOrder();
const mockPayload = createMockCreateOrderPayload();
```

## 🔧 Utilitários Disponíveis

### Test Factories (`tests/utils/test-factories.ts`)

- `createMockCustomer()` - Cliente de teste
- `createMockOrder()` - Pedido de teste
- `createMockOrderItem()` - Item de pedido de teste
- `createMockCreateOrderPayload()` - Payload completo de criação

### Database Helpers (`tests/utils/database-helpers.ts`)

- `createMockDatabaseConnection()` - Conexão mock
- `setupDatabaseMocks()` - Configuração de mocks

### Test App (`tests/utils/test-app.ts`)

- `createTestApp()` - Instância Fastify para testes

## 🎯 Cenários Testados

### ✅ Cenários de Sucesso

- Criação de pedidos com novos clientes
- Criação de pedidos com clientes existentes
- Busca de pedidos por ID
- Atualização de status seguindo regras de negócio
- Processamento de mensagens do worker
- Publicação em filas RabbitMQ

### ❌ Cenários de Erro

- Dados de entrada inválidos
- Pedidos não encontrados
- Transições de status inválidas
- Falhas de conexão com banco de dados
- Falhas de conexão com RabbitMQ
- Erros de serialização/deserialização

### 🚨 Edge Cases

- Valores extremos (números muito grandes/pequenos)
- Strings muito longas
- Caracteres especiais
- Requisições concorrentes
- Timeouts de conexão
- Violações de restrições de banco

## 📈 Relatórios

### HTML Coverage Report

Após executar `npm run test:coverage`, um relatório HTML é gerado em:

```
coverage/
├── lcov-report/
│   └── index.html     # Relatório visual de cobertura
├── lcov.info          # Dados LCOV
└── coverage-final.json # Dados JSON de cobertura
```

### Console Output

```
==================== Coverage summary ====================
Statements   : 92.5% ( 185/200 )
Branches     : 87.5% ( 35/40 )
Functions    : 95.0% ( 19/20 )
Lines        : 93.0% ( 186/200 )
===========================================================
```

## 🤝 Contribuindo

### Adicionando Novos Testes

1. **Identifique o tipo**: Unitário, Integração, Edge Case, ou E2E
2. **Escolha o diretório apropriado**: `unit/`, `integration/`, `edge-cases/`, `end-to-end/`
3. **Siga as convenções de nomenclatura**: `*.test.ts`
4. **Use os utilitários existentes**: Factories, mocks, helpers
5. **Mantenha os testes isolados**: Setup/teardown adequados

### Exemplo de Novo Teste

```typescript
// tests/unit/new-feature/new-feature.test.ts
import { newFeature } from "../../../src/new-feature/new-feature";
import { createMockData } from "../../utils/test-factories";

describe("New Feature", () => {
  describe("Happy Path", () => {
    it("should work correctly with valid input", () => {
      // Arrange
      const input = createMockData();

      // Act
      const result = newFeature(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("Error Cases", () => {
    it("should handle invalid input gracefully", () => {
      // Test implementation
    });
  });
});
```

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TypeScript Testing](https://typescript-eslint.io/docs/linting/troubleshooting#testing)
- [Fastify Testing](https://www.fastify.io/docs/latest/Guides/Testing/)
- [Drizzle ORM Testing](https://orm.drizzle.team/docs/unit-testing)

---

**Desenvolvido com ❤️ seguindo as melhores práticas de teste e qualidade de código.**
