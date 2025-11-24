const { execSync } = require('child_process');

console.log('🧹 Fazendo commit da limpeza do projeto mobile...\n');

try {
  // Adicionar mudanças (remoções e .gitignore atualizado)
  execSync('git add -A', { stdio: 'inherit' });
  
  // Fazer commit
  execSync('git commit -m "🧹 Limpeza: remover arquivos de teste e documentação temporária"', { stdio: 'inherit' });
  
  console.log('\n✅ Commit realizado com sucesso!');
  console.log('📤 Execute "git push" para enviar as mudanças para o GitHub');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
}