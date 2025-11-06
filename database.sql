

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inspeção de veículos (carros)
CREATE TABLE IF NOT EXISTS inspecao_veiculos (
    id SERIAL PRIMARY KEY,
    motorista VARCHAR(255),
    veiculo VARCHAR(255),
    modelo VARCHAR(255),
    placa VARCHAR(10) NOT NULL,
    data TIMESTAMP NOT NULL,
    motor_funcionando BOOLEAN DEFAULT FALSE,
    aperto_parafusos BOOLEAN DEFAULT FALSE,
    buzinas BOOLEAN DEFAULT FALSE,
    cintos_seguranca BOOLEAN DEFAULT FALSE,
    freio BOOLEAN DEFAULT FALSE,
    estepe BOOLEAN DEFAULT FALSE,
    farol_alto BOOLEAN DEFAULT FALSE,
    farol_baixo BOOLEAN DEFAULT FALSE,
    farol_direito BOOLEAN DEFAULT FALSE,
    farol_esquerdo BOOLEAN DEFAULT FALSE,
    limpadores_parabrisa BOOLEAN DEFAULT FALSE,
    macaco_triangulo BOOLEAN DEFAULT FALSE,
    nivel_agua_shampoo BOOLEAN DEFAULT FALSE,
    nivel_combustivel BOOLEAN DEFAULT FALSE,
    nivel_oleo BOOLEAN DEFAULT FALSE,
    pneus_calibragem BOOLEAN DEFAULT FALSE,
    retrovisor_interno BOOLEAN DEFAULT FALSE,
    retrovisor_externo BOOLEAN DEFAULT FALSE,
    vazamentos_aparentes BOOLEAN DEFAULT FALSE,
    crlv_atualizado BOOLEAN DEFAULT FALSE,
    createdby VARCHAR(255),
    status VARCHAR(100),
    assinatura TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inspeção de motos
CREATE TABLE IF NOT EXISTS inspecao_moto (
    id SERIAL PRIMARY KEY,
    motorista VARCHAR(255),
    veiculo VARCHAR(255),
    modelo VARCHAR(255),
    data TIMESTAMP NOT NULL,
    placa VARCHAR(10) NOT NULL,
    freio BOOLEAN DEFAULT FALSE,
    motor_funcionando BOOLEAN DEFAULT FALSE,
    aperto_parafusos BOOLEAN DEFAULT FALSE,
    alavanca_embreagem BOOLEAN DEFAULT FALSE,
    manopla_acelerador BOOLEAN DEFAULT FALSE,
    farol_alto BOOLEAN DEFAULT FALSE,
    farol_baixo BOOLEAN DEFAULT FALSE,
    farol_direito BOOLEAN DEFAULT FALSE,
    farol_esquerdo BOOLEAN DEFAULT FALSE,
    tampa_tanque_combustivel BOOLEAN DEFAULT FALSE,
    retrovisor BOOLEAN DEFAULT FALSE,
    nivel_oleo BOOLEAN DEFAULT FALSE,
    pneus_calibragem BOOLEAN DEFAULT FALSE,
    vazamento_oleo_agua BOOLEAN DEFAULT FALSE,
    pecas_soltas BOOLEAN DEFAULT FALSE,
    extintor BOOLEAN DEFAULT FALSE,
    crlv_atualizado BOOLEAN DEFAULT FALSE,
    observacao TEXT,
    createdby VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inspeção de quadriciclos (QDA)
CREATE TABLE IF NOT EXISTS inspecao_quadriciclo (
    id SERIAL PRIMARY KEY,
    motorista VARCHAR(255),
    veiculo VARCHAR(255),
    modelo VARCHAR(255),
    placa VARCHAR(10) NOT NULL,
    data TIMESTAMP NOT NULL,
    aperto_parafusos BOOLEAN DEFAULT FALSE,
    freio BOOLEAN DEFAULT FALSE,
    acelerador BOOLEAN DEFAULT FALSE,
    chave_partida BOOLEAN DEFAULT FALSE,
    pneus_calibragem BOOLEAN DEFAULT FALSE,
    coifa_semi_eixo BOOLEAN DEFAULT FALSE,
    farol_esquerdo BOOLEAN DEFAULT FALSE,
    tampa_tanque_combustivel BOOLEAN DEFAULT FALSE,
    sistema_escape BOOLEAN DEFAULT FALSE,
    porca_parafusos BOOLEAN DEFAULT FALSE,
    vazamento_oleo_agua BOOLEAN DEFAULT FALSE,
    filtro_ar BOOLEAN DEFAULT FALSE,
    farois BOOLEAN DEFAULT FALSE,
    extintor BOOLEAN DEFAULT FALSE,
    pecas_soltas BOOLEAN DEFAULT FALSE,
    crlv_atualizado BOOLEAN DEFAULT FALSE,
    observacao TEXT,
    createdby VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inspeção de diariabt
CREATE TABLE IF NOT EXISTS inspecao_diariabt (
    id SERIAL PRIMARY KEY,
    motorista VARCHAR(255),
    modelo VARCHAR(255),
    data TIMESTAMP NOT NULL,
    motor_funcionando BOOLEAN DEFAULT FALSE,
    aperto_parafusos BOOLEAN DEFAULT FALSE,
    tampa_tanque_combustivel BOOLEAN DEFAULT FALSE,
    botao_stop BOOLEAN DEFAULT FALSE,
    acelerador_trava BOOLEAN DEFAULT FALSE,
    bomba_combustivel BOOLEAN DEFAULT FALSE,
    terminal_vela BOOLEAN DEFAULT FALSE,
    filtro_ar BOOLEAN DEFAULT FALSE,
    punho_ap_lateral BOOLEAN DEFAULT FALSE,
    vazamento_combustivel BOOLEAN DEFAULT FALSE,
    cordao_de_arranque BOOLEAN DEFAULT FALSE,
    mandrill BOOLEAN DEFAULT FALSE,
    chave_mandrill BOOLEAN DEFAULT FALSE,
    chave_cachimbo BOOLEAN DEFAULT FALSE,
    crlv_atualizado BOOLEAN DEFAULT FALSE,
    observacao TEXT,
    createdby VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_inspecao_veiculos_placa ON inspecao_veiculos(placa);
CREATE INDEX IF NOT EXISTS idx_inspecao_veiculos_data ON inspecao_veiculos(data);
CREATE INDEX IF NOT EXISTS idx_inspecao_moto_placa ON inspecao_moto(placa);
CREATE INDEX IF NOT EXISTS idx_inspecao_moto_data ON inspecao_moto(data);
CREATE INDEX IF NOT EXISTS idx_inspecao_quadriciclo_placa ON inspecao_quadriciclo(placa);
CREATE INDEX IF NOT EXISTS idx_inspecao_quadriciclo_data ON inspecao_quadriciclo(data);
CREATE INDEX IF NOT EXISTS idx_inspecao_diariabt_data ON inspecao_diariabt(data);

