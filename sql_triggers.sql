CREATE TABLE public.acessos (
                  id SERIAL PRIMARY KEY,
                  id_controle INTEGER NOT NULL,
                  data_hora  timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                  navegador TEXT
                );

				
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

CREATE OR REPLACE FUNCTION identificar_dispositivo(user_agent TEXT) 
RETURNS TEXT AS $$
BEGIN
  -- Verifica se o User-Agent tem alguma das palavras-chave de dispositivos móveis
  IF user_agent LIKE '%Android%' 
     OR user_agent LIKE '%iPhone%' 
     OR user_agent LIKE '%iPad%' 
     OR user_agent LIKE '%Mobile%' 
     OR user_agent LIKE '%Opera Mini%' 
     OR user_agent LIKE '%Windows Phone%' THEN
    RETURN 'Mobile';
  ELSE
    RETURN 'Desktop';
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION setar_navegador() 
RETURNS TRIGGER AS $$
BEGIN
    -- Verifique se a coluna 'navegador' existe na tabela de destino
    NEW.navegador := identificar_navegador(NEW.user_agent);

    -- Confirme se as colunas id_controle, data_hora e navegador existem na tabela 'acessos'
    INSERT INTO public.acessos (id_controle, data_hora, navegador, tipo_dispositivo)
    VALUES (NEW.id_controle, CURRENT_TIMESTAMP, identificar_navegador(NEW.user_agent), identificar_dispositivo(NEW.user_agent));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_setar_navegador
BEFORE INSERT ON usuarios
FOR EACH ROW
EXECUTE FUNCTION setar_navegador();

---Update
CREATE TRIGGER trigger_setar_navegador_up
            BEFORE UPDATE ON usuarios
            FOR EACH ROW 
            EXECUTE FUNCTION setar_navegador_up();


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
			

alter table acessos add column tipo_dispositivo TEXT;
select*from usuarios
select*from acessos order by data_hora desc