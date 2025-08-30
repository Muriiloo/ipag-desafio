import { execSync } from "child_process";

interface TestSuite {
  name: string;
  pattern: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: "Unit Tests - Schemas",
    pattern: "tests/unit/schemas/**/*.test.ts",
    description: "Testes unitários para validação de schemas Zod",
  },
  {
    name: "Unit Tests - Helpers",
    pattern: "tests/unit/helpers/**/*.test.ts",
    description: "Testes unitários para funções auxiliares",
  },
];

function runTestSuite(suite: TestSuite): boolean {
  console.log(`\n🧪 Executando: ${suite.name}`);
  console.log(`📝 ${suite.description}`);
  console.log("─".repeat(60));

  try {
    execSync(`npx jest ${suite.pattern} --verbose`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log(`✅ ${suite.name} - PASSOU\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${suite.name} - FALHOU\n`);
    return false;
  }
}

function runAllTests(): void {
  console.log("🚀 Executando todos os testes da aplicação");
  console.log("=".repeat(60));

  const results: { suite: TestSuite; passed: boolean }[] = [];

  for (const suite of testSuites) {
    const passed = runTestSuite(suite);
    results.push({ suite, passed });
  }

  // Resumo dos resultados
  console.log("\n📊 RESUMO DOS TESTES");
  console.log("=".repeat(60));

  let totalPassed = 0;

  results.forEach(({ suite, passed }) => {
    const status = passed ? "✅ PASSOU" : "❌ FALHOU";
    console.log(`${status} - ${suite.name}`);
    if (passed) totalPassed++;
  });

  console.log("\n📈 ESTATÍSTICAS");
  console.log("─".repeat(60));
  console.log(`Total de suítes: ${testSuites.length}`);
  console.log(`Suítes que passaram: ${totalPassed}`);
  console.log(`Suítes que falharam: ${testSuites.length - totalPassed}`);
  console.log(
    `Taxa de sucesso: ${((totalPassed / testSuites.length) * 100).toFixed(1)}%`
  );

  if (totalPassed === testSuites.length) {
    console.log("\n🎉 TODOS OS TESTES PASSARAM!");
    process.exit(0);
  } else {
    console.log("\n⚠️  ALGUNS TESTES FALHARAM");
    process.exit(1);
  }
}

function runCoverageReport(): void {
  console.log("\n📊 Gerando relatório de cobertura...");
  console.log("─".repeat(60));

  try {
    execSync("npx jest --coverage", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log("\n✅ Relatório de cobertura gerado com sucesso!");
    console.log("📁 Verifique o diretório coverage/ para detalhes");
  } catch (error) {
    console.log("\n❌ Erro ao gerar relatório de cobertura");
  }
}

// Executar baseado nos argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes("--coverage")) {
  runCoverageReport();
} else if (args.includes("--help")) {
  console.log(`
🧪 Test Runner - Sistema de Gerenciamento de Pedidos

Uso:
  npm run test                 # Executar todos os testes
  npm run test:coverage        # Executar testes com relatório de cobertura
  npm run test:watch           # Executar testes em modo watch

Suítes de teste disponíveis:
${testSuites
  .map((suite) => `  • ${suite.name}: ${suite.description}`)
  .join("\n")}

Opções:
  --coverage    Gerar relatório de cobertura
  --help        Mostrar esta ajuda
  `);
} else {
  runAllTests();
}
