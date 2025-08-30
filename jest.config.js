
module.exports = {
  // Usa preset do ts-jest para suporte ao TypeScript
  preset: 'ts-jest',
  // Define ambiente de teste como Node.js
  testEnvironment: 'node',
  // Define diretórios raiz para busca de arquivos
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  // Padrões para encontrar arquivos de teste
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  // Configuração de transformação de arquivos TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  // Define quais arquivos incluir na cobertura de código
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',        // Exclui arquivos de definição
    '!src/server.ts',        // Exclui arquivo principal do servidor
    '!src/worker/worker.ts', // Exclui arquivo principal do worker
    '!src/db/migrations/**'  // Exclui arquivos de migração
  ],
  // Formatos de relatório de cobertura
  coverageReporters: ['text', 'lcov', 'html'],
  // Arquivo de configuração executado após setup do Jest
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // Timeout para testes em milissegundos
  testTimeout: 30000,
  // Limpa mocks automaticamente entre testes
  clearMocks: true,
  // Restaura implementações originais após cada teste
  restoreMocks: true
};
