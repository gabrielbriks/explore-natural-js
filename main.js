const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const stemmer = natural.PorterStemmer

// um dicionário de perguntas e respostas
const qna = {
  'Qual é a capital do Brasil?': 'Brasília',
  'Quem descobriu o Brasil?': 'Pedro Álvares Cabral',
  'Quem foi a pessoa que descobriu o Brasil?': 'Pedrinho',
  'Qual é a fórmula química da água?': 'H2O'
}

// função para encontrar a resposta
function findAnswer(question, n, temperature) {
  console.log(n)

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
    // console.log('similarity', similarity)

    if (similarity >= temperature) {
      answers.push(qna[q])
    }
  }

  // retorna as respostas encontradas, ou uma mensagem padrão caso não encontre nenhuma resposta

  if (answers.length == 0) {
    return ['Desculpe, não entendi a sua pergunta.']
  }

  console.log('QTD Respostas encontradas: ', answers.length)

  if (n !== null && n !== undefined && n > 0) {
    return answers.splice(0, n)
  }

  return answers
}

// exemplo de uso
const prompt = 'Quem descobriu o Brasil?'
const max_tokens = 4
const temperature = 0.6

const answer = findAnswer(prompt, max_tokens, temperature)

console.log(answer) // exibe ["Brasília"]
