const { Pool } = require('pg');
const pool = require('./conexao');

// Configuração inicial para conectar ao banco "postgres"
const adminPool = new Pool({
    user: 'postgres', // Substitua pelo nome do usuário do PostgreSQL
    host: 'localhost',
    database: 'postgres', // Conecta ao banco padrão
    password: '4053', // Substitua pela senha do PostgreSQL
    port: 5432, // Porta padrão do PostgreSQL
});

// Função para criar o banco de dados "portal_assinatura" se ele não existir
const criarBancoDeDados = async () => {
    try {
        const queryVerificar = `
        SELECT 1 FROM pg_database WHERE datname = 'portal_assinatura';
        `;
        const { rows } = await adminPool.query(queryVerificar);

        if (rows.length === 0) {
            // Cria o banco de dados se ele não existir
            const queryCriar = `CREATE DATABASE portal_assinatura;`;
            await adminPool.query(queryCriar);
            console.log('Banco de dados "portal_assinatura" criado com sucesso!');

            await createTables();
            console.log('Processo concluído.');
        } else {
            console.log('Banco de dados "portal_assinatura" já existe.');
            await createTables();
        }
    } catch (err) {
        console.error('Erro ao verificar/criar o banco de dados:', err.message);
    }
};

// Função para verificar se a tabela existe
const verificarTabelaExiste = async (client, nomeTabela) => {
    const queryVerificarTabela = `
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '${nomeTabela}';
    `;
    const { rows } = await client.query(queryVerificarTabela);
    return rows.length > 0;
};

// Função para criar tabelas
const createTables = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Lista de tabelas e suas instruções de criação
        const tabelas = [
            {
                nome: 'acessos',
                query: `CREATE TABLE public.acessos (
                  id SERIAL PRIMARY KEY,
                  id_controle integer NOT NULL,
                  data_hora  timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  navegador VARCHAR(100)
                );`
            },
            {
                nome: 'assinaturas',
                query: `CREATE TABLE public.assinaturas (
                  id SERIAL PRIMARY KEY,
                  documento_id integer,
                  usuario_id integer,
                  posicao_x numeric NOT NULL,
                  posicao_y numeric NOT NULL,
                  largura numeric NOT NULL,
                  altura numeric NOT NULL,
                  data_assinatura timestamp without time zone DEFAULT CURRENT_TIMESTAMP
                );`
            },
            {
                nome: 'documentos',
                query: `CREATE TABLE public.documentos (
                  id SERIAL PRIMARY KEY,
                  usuario_id integer,
                  nome_arquivo character varying(255) NOT NULL,
                  caminho_arquivo character varying(500) NOT NULL,
                  tipo_mime character varying(100) NOT NULL,
                  tamanho character varying NOT NULL,
                  data_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  dataurl bytea NOT NULL,
                  status character varying(50) DEFAULT 'pendente'
                );`
            },
            {
                nome: 'envios_documentos',
                query: `CREATE TABLE public.envios_documentos (
                  id SERIAL PRIMARY KEY,
                  documento_id integer,
                  usuario_id integer,
                  destinatario_email character varying(100) NOT NULL,
                  mensagem text,
                  navegador character varying(20),
                  data_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  status_envio character varying(50) DEFAULT 'pendente'
                );`
            },
            {
                nome: 'historico',
                query: `CREATE TABLE public.historico (
                  id SERIAL PRIMARY KEY,
                  id_controle character varying NOT NULL,
                  data character varying,
                  hora character varying,
                  navegador character varying
                );`
            },
            {
                nome: 'inf_users',
                query: `CREATE TABLE public.inf_users (
                  id SERIAL PRIMARY KEY,
                  id_controle numeric,
                  nome text,
                  email text
                );`
            },
            {
                nome: 'logs_user',
                query: `CREATE TABLE public.logs_user (
                  id SERIAL PRIMARY KEY,
                  usuario_id integer NOT NULL,
                  acao character varying(100) NOT NULL,
                  data timestamp without time zone DEFAULT CURRENT_TIMESTAMP
                );`
            },
            {
                nome: 'usuarios',
                query: `CREATE TABLE public.usuarios (
                  id SERIAL PRIMARY KEY,
                  nome_completo character varying(150) NOT NULL,
                  username character varying(150) NOT NULL,
                  email character varying(100) NOT NULL,
                  salt text NOT NULL,
                  hash text NOT NULL,
                  telefone character varying(15),
                  data_nascimento date,
                  cpf character varying(11),
                  endereco text,
                  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  ultimo_login timestamp without time zone,
                  ativo boolean DEFAULT true,
                  user_agent TEXT,
                  nivel_acesso character varying(50) DEFAULT 'usuario',
                  foto_perfil bytea,
                  verificacao_email boolean DEFAULT false
                );`
            }
        ];

        for (const tabela of tabelas) {
            const tabelaExiste = await verificarTabelaExiste(client, tabela.nome);
            if (!tabelaExiste) {
                await client.query(tabela.query);
                console.log(`Tabela "${tabela.nome}" criada com sucesso.`);
            } else {
                console.log(`Tabela "${tabela.nome}" já existe.`);
            }
        }

        //-------------------Functions e Triggers

        /*await client.query(`
            CREATE OR REPLACE FUNCTION identificar_navegador(user_agent TEXT) 
            RETURNS TEXT AS $$
            BEGIN
                IF user_agent LIKE '%Firefox%' THEN
                    RETURN 'Firefox';
                ELSIF user_agent LIKE '%Edg%' THEN
                    RETURN 'Microsoft Edge';
                ELSIF user_agent LIKE '%Chrome%' AND user_agent NOT LIKE '%Edg%' THEN
                    RETURN 'Chrome';
                ELSIF user_agent LIKE '%Safari%' AND user_agent NOT LIKE '%Chrome%' THEN
                    RETURN 'Safari';
                ELSIF user_agent LIKE '%Opera%' OR user_agent LIKE '%OPR%' THEN
                    RETURN 'Opera';
                ELSIF user_agent LIKE '%Trident%' THEN
                    RETURN 'Internet Explorer';
                ELSE
                    RETURN 'Navegador desconhecido';
                END IF;
            END;
            $$ LANGUAGE plpgsql;
        `);
        
        await client.query(`
            CREATE OR REPLACE FUNCTION setar_navegador() 
            RETURNS TRIGGER AS $$
            BEGIN
                -- NEW.navegador := identificar_navegador(NEW.user_agent);
                INSERT INTO acessos (id_controle, data_hora, navegador)
                VALUES (NEW.id_controle, CURRENT_TIMESTAMP, identificar_navegador(NEW.user_agent), identificar_dispositivo(NEW.tipo_dispositivo));
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        
        await client.query(`
            CREATE TRIGGER trigger_setar_navegador
            BEFORE INSERT ON usuarios
            FOR EACH ROW
            EXECUTE FUNCTION setar_navegador();
        `);*/
        
        /*await client.query(`
            CREATE OR REPLACE FUNCTION setar_navegador_up()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Verifica se a coluna 'valor' foi alterada
                IF NEW.ultimo_login <> OLD.ultimo_login THEN
                    -- Se houver alteração, insere na tabela_destino
                    INSERT INTO acessos (id_controle, data_hora, navegador)
                    VALUES (NEW.id, CURRENT_TIMESTAMP, identificar_navegador(NEW.user_agent));
                END IF;
        
                -- Retorna a nova linha para a continuidade do processo
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);*/
        
        /*await client.query(`
            CREATE TRIGGER trigger_setar_navegador_up
            BEFORE UPDATE ON usuarios
            FOR EACH ROW 
            EXECUTE FUNCTION setar_navegador_up();
        `);    */    

        await client.query('COMMIT');
        console.log('Tabelas verificadas e criadas com sucesso!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar tabelas:', error);
    } finally {
        client.release();
    }
};

module.exports = { criarBancoDeDados, createTables };
