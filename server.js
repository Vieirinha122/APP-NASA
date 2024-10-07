import fetch from 'node-fetch'; // Usando ES modules (precisa estar com "type": "module" no package.json)
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Habilitando CORS
app.use(cors());
app.use(express.static('public')); // Serve os arquivos estáticos da pasta "public"

// Rota para obter dados de emissões
app.get('/api/emissions', async (req, res) => {
  const { country } = req.query;

  // Verifique se o parâmetro obrigatório foi passado
  if (!country) {
    return res.status(400).json({ error: 'O parâmetro country é obrigatório' });
  }

  // Usando valores padrão para since e to
  const since = 2010;
  const to = 2020;

  // Montando a URL da API ClimateTRACE
  const apiUrl = `https://api.climatetrace.org/v4/country/emissions?countries=${country}&since=${since}&to=${to}`;

  try {
    // Fazendo a requisição para a API ClimateTRACE
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN', // Substitua pelo seu token
      },
    });

    // Verificando se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro da API ClimateTRACE: ${response.statusText}`);
    }

    // Convertendo a resposta para JSON
    const data = await response.json();

    // Retornando os dados para o frontend
    res.json(data);
  } catch (error) {
    // Tratando erros e retornando uma mensagem de erro para o frontend
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados de emissões' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
