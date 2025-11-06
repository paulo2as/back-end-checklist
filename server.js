import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg'; // Importação corrigida
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Carregar variáveis de ambiente
dotenv.config();

const { Pool } = pkg; 

const app = express();

// Validar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('ERRO: DATABASE_URL não está configurada no arquivo .env');
  console.error('Por favor, configure a variável DATABASE_URL no arquivo .env');
  console.error('Formato esperado: postgresql://usuario:senha@host:porta/database');
  process.exit(1);
}

// Configuração do pool de conexão
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};


                         process.env.DATABASE_URL.includes('127.0.0.1') ||
                         process.env.DATABASE_URL.includes('::1');

// Adicionar SSL se:



const pool = new Pool(poolConfig);

app.use(bodyParser.json());
app.use(cors());

// Testar a conexão com o banco de dados
pool.connect()
  .then((client) => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    
    
  });

// Rota GET para buscar os itens de checklist
app.get('/listar/carro', async (req, res) => {
  try {

    const { rows } = await pool.query('SELECT * FROM inspecao_veiculos');
    
  
    res.status(200).json({ rows });
  } catch (error) {
    console.error('Erro ao buscar os dados do checklist:', error);

    res.status(500).json({ error: 'Erro ao buscar os dados do checklist' });
  }
});

app.get('/listar/moto', async (req, res) => {
 
  try {
   
    const { rows } = await pool.query('SELECT * FROM inspecao_moto');

    res.status(200).json({ rows });
  } catch (error) {
    console.error('Erro ao buscar os dados do checklist:', error);

   
    res.status(500).json({ error: 'Erro ao buscar os dados do checklist' });
  }
});

app.get('/listar/moto/motorista', async (req, res) => {
  try {
   
    const { rows } = await pool.query('SELECT motorista,veiculo,data,placa,modelo FROM inspecao_moto');
    

    res.status(200).json({ rows });
  } catch (error) {
    console.error('Erro ao buscar os dados do checklist:', error);

    // Retorna uma mensagem de erro apropriada
    res.status(500).json({ error: 'Erro ao buscar os dados do checklist' });
  }
});

app.get('/listar/qda', async (req, res) => {
  try {
   
    const { rows } = await pool.query('SELECT * FROM inspecao_quadriciclo');
    
    // Retorna os dados como uma resposta JSON
    res.status(200).json({ rows });
  } catch (error) {
    console.error('Erro ao buscar os dados do checklist:', error);

  
    res.status(500).json({ error: 'Erro ao buscar os dados do checklist' });
  }
});

app.get('/listar/diariabt', async (req, res) => {
  try {
    
    const { rows } = await pool.query('SELECT * FROM inspecao_diariabt');
    
    
    res.status(200).json({ rows });
  } catch (error) {
    console.error('Erro ao buscar os dados do checklist:', error);

   
    res.status(500).json({ error: 'Erro ao buscar os dados do checklist' });
  }
});



// Rota POST para salvar carro
app.post('/salvar/carro', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    placa,
    data,
    motorFuncionando,
    apertoParafusos,
    buzinas,
    cintosSeguranca,
    freio,
    estepe,
    farolAlto,
    farolBaixo,
    farolDireito,
    farolEsquerdo,
    limpadoresParabrisa,
    macacoTriangulo,
    nivelAguaShampoo,
    nivelCombustivel,
    nivelOleo,
    pneusCalibragem,
    retrovisorInterno,
    retrovisorExterno,
    vazamentosAparentes,
    crlvAtualizado,
    createdby,
    status,
    assinatura,
  } = req.body;

  // Verificar se a assinatura foi fornecida
  if (!assinatura || assinatura.trim() === '') {
    return res.status(400).json({
      error: 'Assinatura inválida',
      message: 'A assinatura é obrigatória e não pode estar vazia.',
    });
  }

  // Validar a placa
  if (!placa || placa.trim() === '') {
    return res.status(400).json({
      error: 'Placa inválida',
      message: 'A placa do veículo é obrigatória',
    });
  }

  try {
    // Validar e formatar a data
    let dataFormatada;
    try {
      if (!data) {
        dataFormatada = new Date();
      } else {
        dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({
            error: 'Data inválida',
            message: 'Por favor, forneça uma data válida',
          });
        }
      }
    } catch (dateError) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida',
      });
    }

    const query = `
      INSERT INTO inspecao_veiculos (
        motorista, veiculo, modelo, placa, data, motor_funcionando, aperto_parafusos, buzinas, cintos_seguranca,
        freio, estepe, farol_alto, farol_baixo, farol_direito, farol_esquerdo, limpadores_parabrisa,
        macaco_triangulo, nivel_agua_shampoo, nivel_combustivel, nivel_oleo, pneus_calibragem,
        retrovisor_interno, retrovisor_externo, vazamentos_aparentes, crlv_atualizado, createdby, status, assinatura
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
      ) RETURNING *;
    `;

    const values = [
      motorista || '',
      veiculo || '',
      modelo || '',
      placa.trim(),
      dataFormatada.toISOString(),
      motorFuncionando || false,
      apertoParafusos || false,
      buzinas || false,
      cintosSeguranca || false,
      freio || false,
      estepe || false,
      farolAlto || false,
      farolBaixo || false,
      farolDireito || false,
      farolEsquerdo || false,
      limpadoresParabrisa || false,
      macacoTriangulo || false,
      nivelAguaShampoo || false,
      nivelCombustivel || false,
      nivelOleo || false,
      pneusCalibragem || false,
      retrovisorInterno || false,
      retrovisorExterno || false,
      vazamentosAparentes || false,
      crlvAtualizado || false,
      createdby || '',
      status || '',
      assinatura.trim(),
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    res.status(500).json({
      error: 'Erro ao salvar inspeção',
      message: 'Ocorreu um erro ao processar sua solicitação',
    });
  }
});




app.post('/save/user', async (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({
      error: 'Nome inválido',
      message: 'O nome é obrigatório',
    });
  }

  if (!email || !email.trim().includes('@')) {
    return res.status(400).json({
      error: 'E-mail inválido',
      message: 'Por favor, forneça um e-mail válido',
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      error: 'Senha inválida',
      message: 'A senha deve ter pelo menos 6 caracteres',
    });
  }

  try {
    const emailExistente = await pool.query(
      'SELECT email FROM usuarios WHERE email = $1',
      [email.trim()]
    );

    if (emailExistente.rows.length > 0) {
      return res.status(400).json({
        error: 'E-mail duplicado',
        message: 'Já existe um usuário cadastrado com este e-mail',
      });
    }

    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO usuarios (nome, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [nome.trim(), email.trim(), senhaCriptografada];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      usuario: rows[0],
    });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({
      error: 'Erro ao salvar usuário',
      message: 'Ocorreu um erro ao processar sua solicitação',
    });
  }
});


app.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  // Exibe os dados recebidos para depuração
  console.log('Dados recebidos:', req.body);

  // Validação dos dados de entrada
  if (!email || !email.trim().includes('@')) {
    return res.status(400).json({
      error: 'E-mail inválido',
      message: 'Por favor, forneça um e-mail válido.',
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      error: 'Senha inválida',
      message: 'A senha deve ter pelo menos 6 caracteres.',
    });
  }

  try {
    // Busca o usuário pelo e-mail na tabela `usuarios`
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [email.trim()]);

    // Verifica se o usuário existe
    if (rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        message: 'Email ou senha incorretos.',
      });
    }

    const usuario = rows[0];

    
    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({
        error: 'Senha incorreta',
        message: 'Email ou senha incorretos.',
      });
    }

   
    res.status(200).json({
      message: 'Verificação bem-sucedida.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Ocorreu um erro ao processar sua solicitação.',
    });
  }
});



// Rota POST para nova inspeção de moto
app.post('/salvar/moto', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    data,
    placa,
    freio,
    motor_funcionando,
    aperto_parafusos,
    alavanca_embreagem,
    manopla_acelerador,
    farol_alto,
    farol_baixo,
    farol_direito,
    farol_esquerdo,
    tampa_tanque_combustivel,
    retrovisor,
    nivel_oleo,
    pneus_calibragem,
    vazamento_oleo_agua,
    pecas_soltas,
    extintor,
    crlv_atualizado,
    observacao,
    createdby
  } = req.body;

  try {
  
    if (!placa || placa.trim() === '') {
      return res.status(400).json({
        error: 'Placa inválida',
        message: 'A placa do veículo é obrigatória'
      });
    }
    let dataFormatada;
    try {
      if (!data) {
        dataFormatada = new Date();
      } else {
        dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({ 
            error: 'Data inválida',
            message: 'Por favor, forneça uma data válida'
          });
        }
      }
    } catch (dateError) {
      return res.status(400).json({ 
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    const query = `
      INSERT INTO inspecao_moto (
        motorista,veiculo, modelo, data, placa, freio, motor_funcionando, aperto_parafusos,
        alavanca_embreagem, manopla_acelerador, farol_alto, farol_baixo,
        farol_direito, farol_esquerdo, tampa_tanque_combustivel, retrovisor,
        nivel_oleo, pneus_calibragem, vazamento_oleo_agua, pecas_soltas,
        extintor, crlv_atualizado, observacao,createdby
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22,$23,$24
      ) RETURNING *;
    `;

    const values = [
      motorista || '',
      veiculo || '',
      modelo || '',
      dataFormatada.toISOString(),
      placa || '',
      freio || false,
      motor_funcionando || false,
      aperto_parafusos || false,
      alavanca_embreagem || false,
      manopla_acelerador || false,
      farol_alto || false,
      farol_baixo || false,
      farol_direito || false,
      farol_esquerdo || false,
      tampa_tanque_combustivel || false,
      retrovisor || false,
      nivel_oleo || false,
      pneus_calibragem || false,
      vazamento_oleo_agua || false,
      pecas_soltas || false,
      extintor || false,
      crlv_atualizado || false,
      observacao || '',
      createdby || ''
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json({
      message: 'Inspeção registrada com sucesso',
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    res.status(500).json({ 
      error: 'Erro ao salvar inspeção',
      message: 'Ocorreu um erro ao processar sua solicitação'
    });
  }
});


app.post('/salvar/qda', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    placa,
    data,
    aperto_parafusos,
    freio,
    acelerador,
    chave_partida,
    pneus_calibragem,
    coifa_semi_eixo,
    farol_esquerdo,
    tampa_tanque_combustivel,
    sistema_escape,
    porca_parafusos,
    vazamento_oleo_agua,
    filtro_ar,
    farois,
    extintor,
    pecas_soltas,
    crlv_atualizado,
    observacao,
    createdby
  } = req.body;

  // Validação inicial
  if (!placa || placa.trim() === '') {
    return res.status(400).json({
      error: 'Placa inválida',
      message: 'A placa do veículo é obrigatória'
    });
  }

  try {
    let dataFormatada;
    try {
      if (!data) {
        dataFormatada = new Date();
      } else {
        dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({
            error: 'Data inválida',
            message: 'Por favor, forneça uma data válida'
          });
        }
      }
    } catch (dateError) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    // Inserir os dados no banco
    const query = `
    INSERT INTO inspecao_quadriciclo (
      motorista, 
      veiculo, 
      modelo, 
      placa, 
      data, 
      aperto_parafusos, 
      freio, 
      acelerador, 
      chave_partida, 
      pneus_calibragem, 
      coifa_semi_eixo, 
      farol_esquerdo, 
      tampa_tanque_combustivel, 
      sistema_escape, 
      porca_parafusos, 
      vazamento_oleo_agua, 
      filtro_ar, 
      farois, 
      extintor, 
      pecas_soltas, 
      crlv_atualizado, 
      observacao, 
      createdby
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    ) RETURNING *;
  `;
  

  const values = [
    motorista || '',                
    veiculo || '',                  
    modelo || '',                   
    placa.trim(),                   
    dataFormatada.toISOString(),    
    aperto_parafusos || false,      
    freio || false,                 
    acelerador || false,
    chave_partida || false,         
    pneus_calibragem || false,      
    coifa_semi_eixo || false,       
    farol_esquerdo || false,       
    tampa_tanque_combustivel || false, 
    sistema_escape || false,       
    porca_parafusos || false,       
    vazamento_oleo_agua || false,   
    filtro_ar || false,             
    farois || false,
    extintor || false,             
    pecas_soltas || false,          
    crlv_atualizado || false,       
    observacao || '',              
    createdby || ''                
  ];
  

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    res.status(500).json({
      error: 'Erro ao salvar inspeção',
      message: 'Ocorreu um erro ao processar sua solicitação'
    });
  }
});

app.post('/salvar/diariabt', async (req, res) => {
  const {
    motorista,
    modelo,
    data,
    motor_funcionando,
    aperto_parafusos,
    tampa_tanque_combustivel,
    botao_stop,
    acelerador_trava,
    bomba_combustivel,
    terminal_vela,
    filtro_ar,
    punho_ap_lateral,
    vazamento_combustivel,
    cordao_de_arranque,
    mandrill,
    chave_mandrill,
    chave_cachimbo,
    crlv_atualizado,
    observacao,
    createdby
  } = req.body;


  try {
    let dataFormatada;
    try {
      if (!data) {
        dataFormatada = new Date();
      } else {
        dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({
            error: 'Data inválida',
            message: 'Por favor, forneça uma data válida'
          });
        }
      }
    } catch (dateError) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    // Inserir os dados no banco
    const query = `
    INSERT INTO inspecao_diariabt (
      motorista, 
      modelo, 
      data, 
      motor_funcionando,
      aperto_parafusos, 
      tampa_tanque_combustivel, 
      botao_stop , 
      acelerador_trava , 
      bomba_combustivel , 
      terminal_vela, 
      filtro_ar, 
      punho_ap_lateral, 
      vazamento_combustivel, 
      cordao_de_arranque, 
      chave_mandrill, 
      chave_cachimbo, 
      mandrill, 
      crlv_atualizado, 
      observacao, 
      createdby
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    ) RETURNING *;
  `;
  

  const values = [
    motorista || '',                            
    modelo || '',                 
    dataFormatada.toISOString(), 
    motor_funcionando || false,   
    aperto_parafusos || false,     
    tampa_tanque_combustivel || false,
    botao_stop || false,
    acelerador_trava|| false,
    bomba_combustivel || false,
    terminal_vela || false,
    filtro_ar || false,
    punho_ap_lateral || false,
    vazamento_combustivel || false,
    cordao_de_arranque || false,
    chave_mandrill || false,
    chave_cachimbo || false,
    mandrill || false,
    crlv_atualizado || false,       
    observacao || '',               
    createdby || ''                 
  ];
  

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao salvar inspeção:', error);
    res.status(500).json({
      error: 'Erro ao salvar inspeção',
      message: 'Ocorreu um erro ao processar sua solicitação'
    });
  }
});

// app.post('/salvar/carro', upload.single('assinatura'), (req, res) => {
//   const filePath = req.file.path; // Caminho do arquivo salvo
//   res.status(200).json({ filePath });
// });

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
