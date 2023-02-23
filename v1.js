const natural = require('natural')
const tokenizer = new natural.WordTokenizer()

/*
Stemming e lemmatization são métodos usados por mecanismos de busca e chatbots para analisar o significado por trás de uma palavra. Stemming usa o tronco da palavra, enquanto a lemmatização usa o contexto em que a palavra está sendo usada.
*/
const stemmer = natural.PorterStemmer

// um dicionário de perguntas e respostas
const questions = {
  'Qual é a capital do Brasil?': 'Brasília',
  'Quem descobriu o Brasil?': 'Pedro Álvares Cabral',
  'Quem foi a pessoa que descobriu o Brasil?': 'Pedrinho',
  'Qual é a fórmula química da água?': 'H2O'
}

// função para encontrar a resposta
function findAnswer(question, maxTokens, precision) {
  console.log('QTD Máxima de Respostas de Retorno: ', maxTokens)

  // transforma a pergunta em tokens e aplica o stemmer
  const questionTokens = tokenizer.tokenize(question)
  const questionStems = questionTokens.map(token => stemmer.stem(token))

  // array para armazenar as respostas encontradas
  let answers = []

  // procura pela pergunta no dicionário
  for (const q in questions) {
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

    if (similarity >= precision) {
      answers.push(questions[q])
    }
  }

  // retorna as respostas encontradas, ou uma mensagem padrão caso não encontre nenhuma resposta

  if (answers.length == 0) {
    return ['Desculpe, não entendi a sua pergunta.']
  }

  console.log('QTD Respostas Encontradas: ', answers.length)

  if (maxTokens !== null && maxTokens !== undefined && maxTokens > 0) {
    return answers.splice(0, maxTokens)
  }

  return answers
}

// exemplo de uso
const question = 'Quem descobriu o Brasil?'
const max_tokens = 2
const precision = 0.8

const answer = findAnswer(question, max_tokens, precision)

console.log(answer) // exibe ["Pedro Álvares Cabral"]
