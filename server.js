import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 3000;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRO: defina SUPABASE_URL e SUPABASE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✓ Conectado ao Supabase com sucesso');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const handleSupabaseError = (res, source, error) => {
  console.error(source, error);
  return res.status(500).json({ error: 'Erro ao processar solicitação' });
};



// GET todos os carros
app.get('/listar/carro', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inspecao_veiculos').select('*');
    if (error) return handleSupabaseError(res, 'inspecao_veiculos select', error);
    return res.status(200).json({ rows: data });
  } catch (err) {
    return handleSupabaseError(res, 'listar/carro', err);
  }
});

// GET todas as motos
app.get('/listar/moto', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inspecao_moto').select('*');
    if (error) return handleSupabaseError(res, 'inspecao_moto select', error);
    return res.status(200).json({ rows: data });
  } catch (err) {
    return handleSupabaseError(res, 'listar/moto', err);
  }
});

// GET quadriciclos
app.get('/listar/qda', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inspecao_quadriciclo').select('*');
    if (error) return handleSupabaseError(res, 'inspecao_quadriciclo select', error);
    return res.status(200).json({ rows: data });
  } catch (err) {
    return handleSupabaseError(res, 'listar/qda', err);
  }
});

// GET diariabt
app.get('/listar/diariabt', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inspecao_diariabt').select('*');
    if (error) return handleSupabaseError(res, 'inspecao_diariabt select', error);
    return res.status(200).json({ rows: data });
  } catch (err) {
    return handleSupabaseError(res, 'listar/diariabt', err);
  }
});

// POST salvar carro
app.post('/salvar/carro', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    placa,
    data,
    motor_funcionando,
    aperto_parafusos,
    buzina,
    cintos_seguranca,
    freio,
    estepe,
    extintor,
    farol_alto,
    farol_baixo,
    farol_direito,
    farol_esquerdo,
    para_brisa,
    limpadores_parabrisa,
    macaco_triangulo,
    nivel_agua_shampoo,
    nivel_combustivel,
    nivel_oleo,
    pneus_calibragem,
    retrovisor_interno,
    retrovisor_externo,
    vazamentos_aparentes,
    crlv_atualizado,
    createdby,
    nivel_agua,
    observacao,
    status,
    assinatura,
  } = req.body;

  if (!placa || placa.trim() === '') {
    return res.status(400).json({
      error: 'Placa inválida',
      message: 'A placa do veículo é obrigatória'
    });
  }

  try {
    
    const dataDia = data ? new Date(data) : new Date();

    if (isNaN(dataDia.getTime())) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    
 const dataFormatada = new Date(
  dataDia.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
);
    

    const insertObj = {
      motorista: motorista || '',
      veiculo: veiculo || '',
      modelo: modelo || '',
      placa: placa.trim(),
      data: dataFormatada, 
      motor_funcionando: motor_funcionando || false,
      aperto_parafusos: aperto_parafusos || false,
      buzina: buzina || false,
      cintos_seguranca: cintos_seguranca || false,
      freio: freio || false,
      estepe: estepe || false,
      para_brisa: para_brisa || false,
      extintor: extintor || false,
      farol_alto: farol_alto || false,
      farol_baixo: farol_baixo || false,
      nivel_agua: nivel_agua || false,
      farol_direito: farol_direito || false,
      farol_esquerdo: farol_esquerdo || false,
      limpadores_parabrisa: limpadores_parabrisa || false,
      macaco_triangulo: macaco_triangulo || false,
      nivel_agua_shampoo: nivel_agua_shampoo || false,
      nivel_combustivel: nivel_combustivel || false,
      nivel_oleo: nivel_oleo || false,
      pneus_calibragem: pneus_calibragem || false,
      retrovisor_interno: retrovisor_interno || false,
      retrovisor_externo: retrovisor_externo || false,
      vazamentos_aparentes: vazamentos_aparentes || false,
      crlv_atualizado: crlv_atualizado || false,
      observacao: observacao || '',
      createdby: createdby || '',
      status: status || '',
      assinatura: assinatura?.trim() || '',
    };

    const { data: inserted, error } = await supabase
      .from('inspecao_veiculos')
      .insert([insertObj])
      .select();

    if (error) {
      return handleSupabaseError(res, 'insert inspecao_veiculos', error);
    }

    const resposta = {
      ...inserted[0],
      data_formatada: new Date(inserted[0].data).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    };

    return res.status(201).json(resposta);
  } catch (err) {
    return handleSupabaseError(res, 'salvar/carro', err);
  }
});

// POST save user
app.post('/save/user', async (req, res) => {
  const { nome, email, password } = req.body;
  if (!nome || nome.trim() === '') return res.status(400).json({ error: 'Nome inválido' });
  if (!email || !email.trim().includes('@')) return res.status(400).json({ error: 'E-mail inválido' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Senha inválida' });

  try {
    const { data: existing, error: existErr } = await supabase.from('usuarios').select('email').eq('email', email.trim());
    if (existErr) return handleSupabaseError(res, 'verificar email', existErr);
    if (existing && existing.length > 0) return res.status(400).json({ error: 'E-mail duplicado' });

    const senhaCriptografada = await bcrypt.hash(password, 10);
    const { data: inserted, error } = await supabase.from('usuarios').insert([{ nome: nome.trim(), email: email.trim(), password: senhaCriptografada }]).select();
    if (error) return handleSupabaseError(res, 'inserir usuario', error);
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuario: inserted[0] });
  } catch (err) {
    return handleSupabaseError(res, 'save/user', err);
  }
});

// POST auth
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.trim().includes('@')) return res.status(400).json({ error: 'E-mail inválido' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Senha inválida' });

  try {
    const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('email', email.trim()).maybeSingle();
    if (error) return handleSupabaseError(res, 'buscar usuario', error);
    if (!usuario) return res.status(401).json({ error: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) return res.status(401).json({ error: 'Senha incorreta' });

    return res.status(200).json({ message: 'Verificação bem-sucedida.', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    return handleSupabaseError(res, 'auth', err);
  }
});

// POST login via Supabase Auth (retorna sessão e usuário)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.trim().includes('@')) return res.status(400).json({ error: 'E-mail inválido' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Senha inválida' });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      // Supabase returns 400 for invalid creds; map to 401
      console.error('Login error:', error);
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // data contains session and user
    return res.status(200).json({ message: 'Login bem-sucedido', session: data.session, user: data.user });
  } catch (err) {
    return handleSupabaseError(res, 'login', err);
  }
});

// POST salvar moto
app.post('/salvar/moto', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    placa,
    data,
    freio,
    motor_funcionando,
    aperto_parafusos,
    alavanca_embreagem,
    manopla_acelerador,
    interruptor_partida,
    farol_alto,
    farol_baixo,
    tampa_tanque_combustivel,
    retrovisor_esq,
    retrovisor_dir,
    buzina,
    nivel_oleo,
    pneus_calibragem,
    vazamento_oleo_agua,
    pecas_soltas,
    extintor,
    crlv_atualizado,
    observacao,
    createdby
  } = req.body;

  if (!placa || placa.trim() === '') {
    return res.status(400).json({
      error: 'Placa inválida',
      message: 'A placa do veículo é obrigatória'
    });
  }

  try {
    
    const dataDia = data ? new Date(data) : new Date();

    if (isNaN(dataDia.getTime())) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    
 const dataFormatada = new Date(
  dataDia.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
);


    const insertObj = {
      motorista: motorista || '',
      veiculo: veiculo || '',
      modelo: modelo || '',
      placa: placa.trim(),
      data: dataFormatada,
      freio: freio || false,
      motor_funcionando: motor_funcionando || false,
      aperto_parafusos: aperto_parafusos || false,
      alavanca_embreagem: alavanca_embreagem || false,
      manopla_acelerador: manopla_acelerador || false,
      farol_alto: farol_alto || false,
      farol_baixo: farol_baixo || false,
      tampa_tanque_combustivel: tampa_tanque_combustivel || false,
      interruptor_partida: interruptor_partida || false,
      retrovisor_esq: retrovisor_esq || false,
      retrovisor_dir: retrovisor_dir || false,
      nivel_oleo: nivel_oleo || false,
      buzina: buzina || false,
      pneus_calibragem: pneus_calibragem || false,
      vazamento_oleo_agua: vazamento_oleo_agua || false,
      pecas_soltas: pecas_soltas || false,
      extintor: extintor || false,
      crlv_atualizado: crlv_atualizado || false,
      observacao: observacao || '',
      extintor: extintor || false,
      createdby: createdby || ''
    };

    const { data: inserted, error } = await supabase
      .from('inspecao_moto')
      .insert([insertObj])
      .select();

    if (error) {
      return handleSupabaseError(res, 'insert inspecao_moto', error);
    }


    const resposta = {
      ...inserted[0],
      data_formatada: new Date(inserted[0].data).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    };

    return res.status(201).json(resposta);

  } catch (err) {
    return handleSupabaseError(res, 'salvar/moto', err);
  }
});

// POST salvar quadriciclo
app.post('/salvar/qda', async (req, res) => {
  const {
    motorista,
    veiculo,
    modelo,
    placa,
    data,
    motor_funcionando,
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
    retrovisores,
    nivel_combustivel,
    filtro_ar,
    farois,
    suporte_carga,
    nivel_oleo,
    extintor,
    buzina,
    pecas_soltas,
    crlv_atualizado,
    observacao,
    createdby
  } = req.body;

  if (!placa || placa.trim() === '') {
    return res.status(400).json({
      error: 'Placa inválida',
      message: 'A placa do veículo é obrigatória'
    });
  }

  try {
    
    const dataDia = data ? new Date(data) : new Date();

    if (isNaN(dataDia.getTime())) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    
 const dataFormatada = new Date(
  dataDia.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
);

    const insertObj = {
      motorista: motorista || '',
      veiculo: veiculo || '',
      modelo: modelo || '',
      placa: placa.trim(),
      data: dataFormatada,
      aperto_parafusos: aperto_parafusos || false,
      motor_funcionando: motor_funcionando || false,
      freio: freio || false,
      suporte_carga: suporte_carga || false,
      retrovisores: retrovisores || false,
      acelerador: acelerador || false,
      chave_partida: chave_partida || false,
      nivel_combustivel: nivel_combustivel || false,
      pneus_calibragem: pneus_calibragem || false,
      coifa_semi_eixo: coifa_semi_eixo || false,
      farol_esquerdo: farol_esquerdo || false,
      tampa_tanque_combustivel: tampa_tanque_combustivel || false,
      sistema_escape: sistema_escape || false,
      porca_parafusos: porca_parafusos || false,
      vazamento_oleo_agua: vazamento_oleo_agua || false,
      filtro_ar: filtro_ar || false,
      nivel_oleo: nivel_oleo || false,
      buzina: buzina || false,
      farois: farois || false,
      extintor: extintor || false,
      pecas_soltas: pecas_soltas || false,
      crlv_atualizado: crlv_atualizado || false,
      observacao: observacao || '',
      createdby: createdby || ''
    };

    const { data: inserted, error } = await supabase
      .from('inspecao_quadriciclo')
      .insert([insertObj])
      .select();

    if (error) {
      return handleSupabaseError(res, 'insert inspecao_quadriciclo', error);
    }
    const resposta = {
      ...inserted[0],
      data_formatada: new Date(inserted[0].data).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    };

    return res.status(201).json(resposta);

  } catch (err) {
    return handleSupabaseError(res, 'salvar/qda', err);
  }
});


// POST salvar diariabt
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

if (!modelo || modelo.trim() === '') {
    return res.status(400).json({
      error: 'Modelo inválido',
      message: 'O modelo  é obrigatório'
    });
  }
  try {
    
    const dataDia = data ? new Date(data) : new Date();

    if (isNaN(dataDia.getTime())) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, forneça uma data válida'
      });
    }

    
 const dataFormatada = new Date(
  dataDia.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
);

    const insertObj = {
      motorista: motorista || '',
      modelo: modelo || '',
      data: dataFormatada,
      motor_funcionando: motor_funcionando || false,
      aperto_parafusos: aperto_parafusos || false,
      tampa_tanque_combustivel: tampa_tanque_combustivel || false,
      botao_stop: botao_stop || false,
      acelerador_trava: acelerador_trava || false,
      bomba_combustivel: bomba_combustivel || false,
      terminal_vela: terminal_vela || false,
      filtro_ar: filtro_ar || false,
      punho_ap_lateral: punho_ap_lateral || false,
      vazamento_combustivel: vazamento_combustivel || false,
      cordao_de_arranque: cordao_de_arranque || false,
      mandrill: mandrill || false,
      chave_mandrill: chave_mandrill || false,
      chave_cachimbo: chave_cachimbo || false,
      crlv_atualizado: crlv_atualizado || false,
      observacao: observacao || '',
      createdby: createdby || ''
    };

    const { data: inserted, error } = await supabase
      .from('inspecao_diariabt')
      .insert([insertObj])
      .select();

    if (error) {
      return handleSupabaseError(res, 'insert inspecao_diariabt', error);
    }

  
    const resposta = {
      ...inserted[0],
      data_formatada: new Date(inserted[0].data).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      })
    };

    return res.status(201).json(resposta);

  } catch (err) {
    return handleSupabaseError(res, 'salvar/diariabt', err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
