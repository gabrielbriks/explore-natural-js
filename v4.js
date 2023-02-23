const { google } = require('googleapis')
const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const stemmer = natural.PorterStemmer

// Configure a chave de API do Google
//key=
const API_KEY = ''
google.options({ auth: API_KEY })

// um dicionário de perguntas e respostas
const qna = {
  'Qual é a capital do Brasil?': 'Brasília',
  'Quem descobriu o Brasil?': 'Pedro Álvares Cabral',
  'Quem foi a pessoa que descobriu o Brasil?': 'Pedrinho',
  'Qual é a fórmula química da água?': 'H2O'
}

// função para encontrar a resposta
async function findAnswer(question, n, temperature) {
  // transforma a pergunta em tokens e aplica o stemmer
  const questionTokens = tokenizer.tokenize(question)
  const questionStems = questionTokens.map(token => stemmer.stem(token))

  // array para armazenar as respostas encontradas
  let answers = []

  // procura pela pergunta no dicionário
  for (const q in qna) {
    const qTokens = tokenizer.tokenize(q)
    const qStems = qTokens.map(token => stemmer.stem(token))

    // verifica se as perguntas são similares
    const similarity = natural.JaroWinklerDistance(
      qStems.join(' '),
      questionStems.join(' '),
      {
        ignoreCase: true
      }
    )

    if (similarity >= temperature) {
      answers.push(qna[q])
    }
  }

  // se não encontrar resposta no dicionário, faz uma busca no Google Knowledge Graph
  if (answers.length === 0) {
    try {
      // consulta a API do Knowledge Graph para buscar informações sobre o tópico
      const customsearch = google.customsearch('v1')
      const response = await customsearch.cse.list({
        cx: '',
        q: question,
        auth: API_KEY,
        fields: 'items(name,description)'
      })

      const items = response.data.items
      if (items && items.length > 0) {
        answers.push(`${items[0].name}: ${items[0].description}`)
      } else {
        answers.push(
          'Desculpe, não encontrei uma resposta para a sua pergunta.'
        )
      }
    } catch (error) {
      answers.push(
        'Desculpe, ocorreu um erro ao tentar buscar uma resposta para a sua pergunta.'
      )
      console.error(error)
    }
  }

  if (n !== null && n !== undefined && n > 0) {
    return answers.splice(0, n)
  }

  return answers
}

// exemplo de uso
const prompt = 'Quem é o criador da linguagem Python?'
const max_tokens = 1
const temperature = 1

findAnswer(prompt, max_tokens, temperature)
  .then(answer => console.log(answer))
  .catch(error => console.error(error))
