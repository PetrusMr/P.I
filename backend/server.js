require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Função para verificar e salvar scan incompleto
function verificarESalvarScanIncompleto(db, agendamento) {
  const dataAgendamento = new Date(agendamento.data).toISOString().split('T')[0];
  
  // Buscar scans do usuário para esta data
  const queryScans = `
    SELECT tipo_scan, resultado_scan 
    FROM scans 
    WHERE usuario = ? 
    AND DATE(data_hora) = ?
    ORDER BY data_hora
  `;
  
  db.query(queryScans, [agendamento.nome, dataAgendamento], (err, scans) => {
    if (err) {
      console.error('Erro ao verificar scans:', err);
      return;
    }
    
    const scanInicio = scans.find(scan => scan.tipo_scan === 'inicio');
    const temFim = scans.some(scan => scan.tipo_scan === 'fim');
    
    let statusScan = '';
    if (!scanInicio && !temFim) {
      statusScan = 'Nenhum scan realizado';
    } else if (scanInicio && !temFim) {
      statusScan = `Scan incompleto - Início: ${scanInicio.resultado_scan}`;
    } else if (scanInicio && temFim) {
      return; // Scan completo, não precisa salvar
    }
    
    // Salvar scan incompleto
    const insertScanIncompleto = `
      INSERT INTO scans (usuario, tipo_scan, resultado_scan, data_hora) 
      VALUES (?, 'fim', ?, NOW())
    `;
    
    db.query(insertScanIncompleto, [agendamento.nome, statusScan], (err) => {
      if (err) {
        console.error('Erro ao salvar scan incompleto:', err);
      } else {
        console.log(`Scan incompleto salvo para ${agendamento.nome} - ${agendamento.horario}`);
      }
    });
  });
}

// Função para mover agendamentos expirados para o histórico
function limparAgendamentosExpirados(db) {
  const hoje = new Date();
  const dataAtual = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaAtual = hoje.getHours();
  
  let condicaoHorario = '';
  let params = [];
  
  // Busca todos os agendamentos que podem ter expirado
  condicaoHorario = "data <= ?";
  params = [dataAtual];
  
  // Primeiro, busca agendamentos que realmente já passaram
  const selectQuery = `SELECT * FROM agendamentos WHERE ${condicaoHorario}`;
  
  db.query(selectQuery, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos expirados:', err);
      return;
    }
    
    if (results.length > 0) {
      // Filtra apenas os que realmente já passaram
      const agendamentosExpirados = results.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data).toISOString().split('T')[0];
        
        // Se é de um dia anterior, já passou
        if (dataAgendamento < dataAtual) {
          return true;
        }
        
        // Se é de hoje, verifica o horário
        if (dataAgendamento === dataAtual) {
          if (agendamento.horario === 'manha' && horaAtual >= 13) return true;
          if (agendamento.horario === 'tarde' && horaAtual >= 18) return true;
          if (agendamento.horario === 'noite' && horaAtual >= 23) return true;
        }
        
        return false;
      });
      
      if (agendamentosExpirados.length > 0) {
        // Verificar scans incompletos antes de mover para histórico
        agendamentosExpirados.forEach(agendamento => {
          verificarESalvarScanIncompleto(db, agendamento);
        });
        
        // Insere no histórico apenas os que realmente expiraram
        const insertHistoricoQuery = 'INSERT INTO historico_agendamentos (nome, data, horario) VALUES ?';
        const valores = agendamentosExpirados.map(row => [row.nome, row.data, row.horario]);
        
        db.query(insertHistoricoQuery, [valores], (err) => {
          if (err) {
            console.error('Erro ao inserir no histórico:', err);
            return;
          }
          
          // Remove apenas os que foram movidos para o histórico
          const idsParaRemover = agendamentosExpirados.map(a => a.id);
          const deleteQuery = `DELETE FROM agendamentos WHERE id IN (${idsParaRemover.map(() => '?').join(',')})`;
          
          db.query(deleteQuery, idsParaRemover, (err, result) => {
            if (err) {
              console.error('Erro ao limpar agendamentos expirados:', err);
            } else if (result.affectedRows > 0) {
              console.log(`${result.affectedRows} agendamentos movidos para histórico`);
            }
          });
        });
      }
    }
  });
}

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'q1w2e3',
  database: process.env.DB_NAME || 'easycontrol'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Rota raiz para teste
app.get('/', (req, res) => {
  console.log('Rota raiz acessada');
  res.json({ message: 'Servidor EasyControl rodando', porta: port });
});

// ROTA DO HISTÓRICO - POSIÇÃO PRIORITÁRIA
app.get('/api/historico-reservas', (req, res) => {
  console.log('🔍 Rota historico-reservas acessada');
  const query = 'SELECT nome, data, horario FROM historico_agendamentos ORDER BY data DESC, horario';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar histórico:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    console.log(`📊 ${results.length} registros encontrados`);
    res.json({ success: true, historico: results });
  });
});

app.post('/api/login', (req, res) => {
  console.log('Login recebido');
  const { usuario, senha } = req.body;
  
  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
  db.query(query, [usuario, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    
    if (results.length > 0) {
      res.json({ success: true, message: 'Login realizado com sucesso' });
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  });
});

app.post('/api/login-supervisor', (req, res) => {
  const { usuario, senha } = req.body;
  
  // Primeiro verifica se o usuário existe na tabela usuarios (não deve existir)
  const checkUserQuery = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(checkUserQuery, [usuario], (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
    
    // Se o usuário existe na tabela usuarios, não pode ser supervisor
    if (userResults.length > 0) {
      return res.status(401).json({ success: false, message: 'Acesso negado: usuário não é supervisor' });
    }
    
    // Agora verifica na tabela supervisor
    const query = 'SELECT * FROM supervisor WHERE usuario = ? AND senha = ?';
    db.query(query, [usuario, senha], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      
      if (results.length > 0) {
        res.json({ success: true, message: 'Login de supervisor realizado com sucesso' });
      } else {
        res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
      }
    });
  });
});



// Verificar agendamento ativo
app.get('/api/agendamentos/ativo/:nome', (req, res) => {
  const { nome } = req.params;
  const agora = new Date();
  const dataAtual = agora.toISOString().split('T')[0];
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  let horarioAtual = '';
  if (horaAtual >= 7 && horaAtual < 13) {
    horarioAtual = 'manha';
  } else if (horaAtual >= 13 && horaAtual < 18) {
    horarioAtual = 'tarde';
  } else if (horaAtual >= 18 && horaAtual < 23) {
    horarioAtual = 'noite';
  }
  
  // Verificar se tem agendamento para hoje no horário atual
  const query = 'SELECT * FROM agendamentos WHERE nome = ? AND data = ? AND horario = ?';
  
  db.query(query, [nome, dataAtual, horarioAtual], (err, results) => {
    if (err) {
      console.error('Erro ao verificar agendamento ativo:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      // Verificar se está no horário correto
      let podeEscanear = false;
      
      if (horarioAtual === 'manha' && horaAtual >= 7 && (horaAtual > 7 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'tarde' && horaAtual >= 13 && (horaAtual > 13 || minutoAtual >= 1)) {
        podeEscanear = true;
      } else if (horarioAtual === 'noite' && horaAtual >= 18 && (horaAtual > 18 || minutoAtual >= 1)) {
        podeEscanear = true;
      }
      
      res.json({ 
        temAgendamento: podeEscanear, 
        agendamento: podeEscanear ? results[0] : null 
      });
    } else {
      res.json({ temAgendamento: false, agendamento: null });
    }
  });
});





// Buscar todas as reservas (deve vir antes da rota com parâmetro)
app.get('/api/agendamentos/todas', (req, res) => {
  const query = 'SELECT * FROM agendamentos ORDER BY data, horario';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar todas as reservas:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    console.log('Reservas encontradas:', results.length);
    res.json({ success: true, reservas: results });
  });
});





// Buscar agendamentos por usuário
app.get('/api/agendamentos/usuario/:nome', (req, res) => {
  const { nome } = req.params;
  
  const query = 'SELECT * FROM agendamentos WHERE nome = ? ORDER BY data, horario';
  
  db.query(query, [nome], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos do usuário:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, agendamentos: results });
  });
});

// Cancelar agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM agendamentos WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao cancelar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    res.json({ success: true, message: 'Agendamento cancelado com sucesso' });
  });
});

// Buscar agendamento específico por data e horário
app.get('/api/agendamentos/buscar/:data/:horario', (req, res) => {
  const { data, horario } = req.params;
  
  const query = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ?';
  
  db.query(query, [data, horario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamento:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length > 0) {
      res.json({ success: true, agendamento: results[0] });
    } else {
      res.json({ success: false, message: 'Agendamento não encontrado' });
    }
  });
});

// Executar limpeza de agendamentos expirados a cada hora
setInterval(() => {
  limparAgendamentosExpirados(db);
}, 60 * 60 * 1000); // 1 hora



// Rotas Agendamentos
const agendamentosRoutes = require('./routes/agendamentos');
app.use('/api/agendamentos', agendamentosRoutes);

// Rotas Gemini
const geminiRoutes = require('./routes/gemini');
app.use('/api/gemini', geminiRoutes);

// Buscar scans por usuário, data e turno
app.get('/api/scans/usuario/:nome/:data/:turno', (req, res) => {
  const { nome, data, turno } = req.params;
  
  const query = `
    SELECT * FROM scans 
    WHERE usuario = ? 
    AND DATE(data_hora) = ?
    ORDER BY data_hora
  `;
  
  db.query(query, [nome, data], (err, results) => {
    if (err) {
      console.error('Erro ao buscar scans:', err);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (results.length === 0) {
      // Se não há scans, retornar "Não scaneado"
      res.json({ 
        success: true, 
        scans: [{ 
          usuario: nome, 
          tipo_scan: 'nenhum', 
          resultado_scan: 'Não scaneado', 
          data_hora: data + ' 00:00:00' 
        }] 
      });
    } else {
      res.json({ success: true, scans: results });
    }
  });
});

// Rotas Scans
const scansRoutes = require('./routes/scans');
app.use('/api/scans', scansRoutes);





// Rota de teste (modificada para retornar histórico)
app.get('/api/test', (req, res) => {
  console.log('Rota de teste acessada - retornando histórico');
  
  const query = 'SELECT nome, data, horario FROM historico_agendamentos ORDER BY data DESC, horario';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar histórico:', err);
      return res.json({ success: false, message: 'Erro no banco' });
    }
    
    console.log(`${results.length} registros encontrados no histórico`);
    res.json({ success: true, historico: results, message: 'Histórico carregado' });
  });
});



// Executar limpeza inicial ao iniciar o servidor
limparAgendamentosExpirados(db);

const server = app.listen(process.env.PORT || port, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || port}`);
});

module.exports = app;