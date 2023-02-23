/**
 * Código foi melhorado desacoplando alguns trechos para melhor compreensão
 */
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
function findAnswer(question, maxTokens, precision) {
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

    if (similarity >= precision) {
      answers.push(qna[q])
    }
  }

  // retorna as respostas encontradas, ou uma mensagem padrão caso não encontre nenhuma resposta
  if (answers.length === 0) {
    return ['Desculpe, não entendi a sua pergunta.']
  }

  // ordena as respostas por similaridade
  answers.sort((a, b) => {
    const aTokens = tokenizer.tokenize(a)
    const aStems = aTokens.map(token => stemmer.stem(token))
    const bTokens = tokenizer.tokenize(b)
    const bStems = bTokens.map(token => stemmer.stem(token))
    return (
      natural.JaroWinklerDistance(aStems.join(' '), questionStems.join(' '), {
        ignoreCase: true
      }) -
      natural.JaroWinklerDistance(bStems.join(' '), questionStems.join(' '), {
        ignoreCase: true
      })
    )
  })

  // retorna as n primeiras respostas, se n for especificado
  if (maxTokens && maxTokens > 0) {
    answers = answers.slice(0, maxTokens)
  }

  return answers
}

// exemplo de uso
const prompt = 'Qual é a fórmula química da água?'
const max_tokens = 2
const precision = 0.8

const answer = findAnswer(prompt, max_tokens, precision)

console.log(answer) // exibe ["H2O"]
