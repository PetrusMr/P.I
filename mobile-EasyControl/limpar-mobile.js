const fs = require('fs');
const path = require('path');

// Arquivos essenciais que devem ser MANTIDOS
const arquivosEssenciais = [
  // Configuração do projeto
  'package.json',
  'package-lock.json',
  'angular.json',
  'ionic.config.json',
  'capacitor.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.spec.json',
  'karma.conf.js',
  '.browserslistrc',
  '.editorconfig',
  '.eslintrc.json',
  '.gitignore',
  
  // Código fonte
  'src',
  'android',
  'www',
  '.angular',
  
  // Documentação essencial
  'README.md',
  'icone3.png'
];

// Padrões de arquivos de teste para remover
const padroesTeste = [
  /^test_/,
  /^test-/,
  /_teste\./,
  /-teste\./,
  /^testar_/,
  /^verificar_/,
  /^debug/,
  /^criar_/,
  /^limpar_/,
  /^inserir_/,
  /\.txt$/,
  /\.html$/ // Arquivos HTML de teste
];

// Arquivos específicos para remover
const arquivosEspecificos = [
  'CODIGO_FINAL_HISTORICO.txt',
  'GEMINI_SETUP.md',
  'SOLUCAO_SCAN_COMPONENTES.md',
  'test_final_historico.js',
  'test_historico_mobile.js',
  'test_nova_rota.js',
  'test_rota_temporaria.js',
  'test_rota_teste.js',
  'test_todas_reservas.js',
  'teste-tempo-real-mobile.html'
];

function deveRemover(nomeArquivo) {
  // Não remover arquivos essenciais
  if (arquivosEssenciais.includes(nomeArquivo)) {
    return false;
  }
  
  // Remover arquivos específicos
  if (arquivosEspecificos.includes(nomeArquivo)) {
    return true;
  }
  
  // Verificar padrões de teste
  return padroesTeste.some(padrao => padrao.test(nomeArquivo));
}

function limparDiretorio(diretorio) {
  const arquivos = fs.readdirSync(diretorio);
  let removidos = [];
  
  arquivos.forEach(arquivo => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stat = fs.statSync(caminhoCompleto);
    
    if (stat.isDirectory()) {
      if (arquivosEssenciais.includes(arquivo)) {
        console.log(`📁 Mantendo diretório: ${arquivo}`);
        return;
      }
      
      if (deveRemover(arquivo)) {
        console.log(`🗑️  Removendo diretório: ${arquivo}`);
        fs.rmSync(caminhoCompleto, { recursive: true, force: true });
        removidos.push(arquivo);
      }
    } else {
      if (deveRemover(arquivo)) {
        console.log(`🗑️  Removendo arquivo: ${arquivo}`);
        fs.unlinkSync(caminhoCompleto);
        removidos.push(arquivo);
      } else {
        console.log(`✅ Mantendo arquivo: ${arquivo}`);
      }
    }
  });
  
  return removidos;
}

console.log('🧹 Iniciando limpeza do projeto mobile...\n');

try {
  const removidos = limparDiretorio('.');
  
  console.log('\n✅ Limpeza concluída!');
  console.log(`📊 Total de arquivos/pastas removidos: ${removidos.length}`);
  
  if (removidos.length > 0) {
    console.log('\n🗑️  Arquivos removidos:');
    removidos.forEach(arquivo => console.log(`   - ${arquivo}`));
  }
  
  console.log('\n📁 Estrutura final mantida:');
  console.log('   - src/ (código fonte Angular/Ionic)');
  console.log('   - android/ (projeto Android)');
  console.log('   - www/ (build do projeto)');
  console.log('   - package.json (dependências)');
  console.log('   - angular.json (configuração Angular)');
  console.log('   - ionic.config.json (configuração Ionic)');
  console.log('   - capacitor.config.ts (configuração Capacitor)');
  
} catch (error) {
  console.error('❌ Erro durante a limpeza:', error.message);
}