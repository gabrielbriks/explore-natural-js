
# Explorando o uso da biblioteca Natural .JS
Basicamente essa biblioteca nos possibilita realizar processamentos de linguagem natural(NLP). Esses tipos de processamentos são mais utilizados em chatbots e no campo da Inteligência Artificial, afim de compreender e processar a linguagem humana.







## Exploração

### v1.js - Ponto de partida
- Objetivo:
    - Criar um dicionário de perguntas e repostas e retornar as repostas mais proximas da pergunta realizada

### v2.js - Melhoria da v1
- Objetivo:
    - Melhorado a v1, desacoplando alguns trechos e incluindo ordenação das respostas por similaridade  

### v3.js - Melhoria da v2 com teste de busca da pergunta na API do Wikipedia
- Objetivo(teste não muito satisfátório até o presente momento):
    - Caso não seja encontrado uma resposta para a pergnta válida dentro do dicionario criado, deve ser realizar uma busca na API do Wikipedia com a pergunta em questão, retornando os resultados encontrados
- Implementado uso o Axios para realizar a busca na API do Wikipedia

### v4.js - Melhoria da v2 com teste de busca da pergunta na API do Google Search
- Objetivo(Em curso ...):
    - Caso não seja encontrado uma resposta para a pergnta válida dentro do dicionario criado, deve ser realizar uma busca na API do Google Seach com a pergunta em questão, retornando os resultados encontrados
## Referências

 - [Nature Language Processing em JavaScript com Natural](https://rubenmarcus.medium.com/nature-language-processing-em-javascript-com-natural-4e62c1c6231e)
 - [Exploring NLP in JavaScript](https://medium.com/analytics-vidhya/exploring-nlp-in-javascript-dbbadc9aab3a)
 - [Natural language processing with Node.js](https://blog.logrocket.com/natural-language-processing-node-js/)
 - Buscas no ChatGPT(Conceitos, integração com as APIs, [melhorias](./melhoria-v2-chat_gpt.md))





