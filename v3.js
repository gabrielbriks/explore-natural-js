/**
 * Utilizando a API do Wikipedia como apoio
 */
const axios = require('axios')
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

//Busca a resposta mais compativel com base no titulo das paginas encontradas na Wikipedia
async function findAnswerPerTitlePageWikpedia(question, temperature, pages) {
  const questionTokens = tokenizer.tokenize(question)
  const questionStems = questionTokens.map(token => stemmer.stem(token))

  // console.log('PAGES:: ', pages)

  let resultAnswer = []

  console.log('total pages', pages[0])

  if (pages && pages.length == 0) {
    console.log('total pages', pages.length)
    return
  }

  pages.forEach(element => {
    console.log('titulo', element.title)

    const pTokens = tokenizer.tokenize(element.title)
    const pStems = pTokens.map(token => stemmer.stem(token))
    // verifica se as perguntas são similares
    const similarity = natural.JaroWinklerDistance(
      pStems.join(' '),
      questionStems.join(' '),
      {
        ignoreCase: true
      }
    )

    if (similarity >= temperature) {
      resultAnswer.push(qna[q])
    }
  })

  // for (let p in pages) {
  //   // console.log('titulo', p.title)
  //   const pTokens = tokenizer.tokenize(p.title)
  //   const pStems = pTokens.map(token => stemmer.stem(token))
  //   // verifica se as perguntas são similares
  //   const similarity = natural.JaroWinklerDistance(
  //     pStems.join(' '),
  //     questionStems.join(' '),
  //     {
  //       ignoreCase: true
  //     }
  //   )
  //   if (similarity >= temperature) {
  //     resultAnswer.push(qna[q])
  //   }
  // }

  return resultAnswer
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

  // se não encontrar resposta no dicionário, faz uma busca no Wikipedia
  if (answers.length === 0) {
    try {
      const response = await axios.get('https://pt.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: question
        }
      })

      const pages = response.data.query.search

      // console.log('pages', pages)

      if (pages.length > 0) {
        let answersTmp = pages[0].snippet

        if (pages.length > 1) {
          const result = await findAnswerPerTitlePageWikpedia(
            question,
            temperature,
            pages
          )

          if (result.length > 0) {
            answersTmp = result
          }
        }

        answers.push(answersTmp)
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
const prompt = 'Quem é o presidente dos EUA?'
const n = 1
const temperature = 1

findAnswer(prompt, n, temperature)
  .then(answer => console.log(answer))
  .catch(error => console.error(error))
