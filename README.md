# Automação de Testes E2E — Hub de Leitura

Suíte de testes automatizados de interface para a aplicação **Hub de Leitura**. O projeto usa Cypress para exercitar os fluxos do usuário em navegador, incluindo autenticação, cadastro, catálogo, busca, cesta e formulário de contato.

> Este repositório contém a automação, e não o código-fonte da aplicação testada. A aplicação Hub de Leitura precisa estar em execução em `http://localhost:3000` para que a suíte possa acessá-la.

## Objetivo

Validar, pela interface, comportamentos essenciais do Hub de Leitura e praticar recursos de automação com Cypress: comandos customizados, fixtures, geração de dados com Faker e abstrações de páginas.

## Funcionalidades e fluxos cobertos

- Login com credenciais fixas, massa de dados em fixture e comando customizado.
- Cadastro de usuários com dados estáticos, e-mail dinâmico, dados gerados pelo Faker, fixture e comando customizado.
- Fluxo de ponta a ponta: cadastrar um usuário e realizar seu login.
- Pesquisa de livros no catálogo, inclusive a partir de dados de fixture.
- Inclusão de livros na cesta, validação de contador, alerta de sucesso e acesso à página de detalhes de um livro.
- Envio válido e validações de campos obrigatórios do formulário de contato.

## Tipos de testes realizados

- Testes end-to-end (E2E) de interface web.
- Testes funcionais de fluxos positivos.
- Testes de validação de campos obrigatórios no contato e no cadastro.
- Testes orientados a dados, com fixtures JSON e dados dinâmicos gerados pelo Faker.

## Tecnologias e ferramentas

- [Cypress](https://www.cypress.io/) — framework de automação de interface. A versão declarada é `^15.9.0`; o `package-lock.json` fixa a instalação atual em `15.10.0`.
- JavaScript (CommonJS no projeto, com imports ES nos arquivos de teste).
- [@faker-js/faker](https://fakerjs.dev/) — geração de nomes e e-mails em cenários de cadastro.
- `wait-on` — espera pela disponibilidade da aplicação no Jenkinsfile.
- Jenkins — há um `jenkinsfile` com etapa de espera por `http://localhost:3000`.
- npm — gerenciamento de dependências e execução de scripts.

## Estrutura principal

```text
.
├── cypress/
│   ├── e2e/                 # Especificações de testes E2E
│   ├── fixtures/            # Massas de dados JSON
│   └── support/
│       ├── commands.js      # Comandos customizados do Cypress
│       ├── e2e.js           # Carregamento global do suporte
│       └── pages/           # Abstrações de Login e Cadastro
├── cypress.config.js        # Configuração do Cypress
├── jenkinsfile              # Pipeline Jenkins
├── package.json             # Dependências e scripts npm
└── package-lock.json        # Versões travadas das dependências
```

As pastas `node_modules`, `cypress/screenshots` e `cypress/videos` não fazem parte da estrutura versionada principal. Elas são geradas localmente ou pela execução dos testes e estão ignoradas no Git.

## Pré-requisitos

- Git.
- Node.js e npm.
- Google Chrome, pois o script `test` executa o Cypress com `--browser chrome`.
- A aplicação Hub de Leitura em execução e acessível em `http://localhost:3000`.

## Instalação e configuração

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/richielmartillo/hub-de-leitura-teste-ui-task.git
   cd hub-de-leitura-teste-ui-task
   ```

2. Instale exatamente as versões registradas no lockfile:

   ```bash
   npm ci
   ```

   Como alternativa, `npm install` também instala as dependências respeitando as faixas do `package.json`.

3. Inicie a aplicação Hub de Leitura em outro terminal na porta `3000`. O projeto não possui scripts `start` ou `dev`; portanto, a inicialização da aplicação é externa a este repositório.

4. Confirme que `http://localhost:3000` está acessível. Essa é a `baseUrl` definida em `cypress.config.js`.

## Execução dos testes

### Modo interativo

Não há script npm específico para a interface do Cypress. Execute diretamente:

```bash
npx cypress open
```

Na janela do Cypress, selecione o navegador e a especificação desejada.

### Modo headless

O script existente no `package.json` executa todos os testes no Chrome:

```bash
npm test
```

Equivale a:

```bash
npx cypress run --browser chrome
```

### Executar uma especificação

Use a opção `--spec`. Exemplo para o teste de login:

```bash
npx cypress run --browser chrome --spec "cypress/e2e/login.cy.js"
```

O `package.json` também possui o script `cy:report`, que executa o Cypress no Chrome com as opções `--record` e `--key` já configuradas no projeto.

## Configuração do Cypress

O arquivo `cypress.config.js` define a `baseUrl` como `http://localhost:3000/`, habilita a gravação de vídeo (`video: true`) e contém o identificador de projeto `vxujf3`. O arquivo global `cypress/support/e2e.js` carrega `commands.js` antes das especificações.

Há dois comandos customizados confirmados em `cypress/support/commands.js`:

- `cy.login(email, senha)`: acessa a página de login, preenche credenciais e envia o formulário.
- `cy.preencherCadastro(nome, email, telefone, senha, confirmarSenha)`: preenche, aceita os termos e envia o cadastro.

As classes em `cypress/support/pages/` encapsulam seletores e ações das páginas de login e cadastro. Elas são usadas em cenários dessas duas funcionalidades.

## Cenários por arquivo de teste

| Arquivo | Cenários cobertos |
| --- | --- |
| `login.cy.js` | Quatro variações de login: preenchimento direto, comando customizado, conta administrativa e fixture `usuario.json`. |
| `cadastro.cy.js` | Cadastro com dados estáticos, Faker, fixture `usuario2.json`, comando customizado, abstração de página e validação de nome vazio. |
| `end-to-end.cy.js` | Cadastro de usuário com dados dinâmicos seguido de login com a mesma conta. |
| `catalogo-busca.cy.js` | Busca por `1984`, por livro importado e carregado via fixture, além de iteração pela lista de livros. |
| `catalogo.cy.js` | Inclusão de livros na cesta, ações em múltiplos botões e por índice, contador, alertas e detalhe de `Dom Casmurro`/`A Metamorfose`. |
| `contato.cy.js` | Envio válido e mensagens de erro para nome, e-mail, assunto e mensagem não preenchidos. |

## Fixtures

- `usuario.json`: credenciais de usuário utilizadas no teste de login.
- `usuario2.json`: senha utilizada em um cenário de cadastro.
- `livros.json`: títulos e categorias usados nos testes de busca.

## Screenshots e vídeos

O Cypress está configurado para gravar vídeos em execuções de teste. Há também um `afterEach` em `cadastro.cy.js` que solicita um screenshot ao final de cada cenário daquele arquivo.

No diretório local analisado foram encontrados arquivos em `cypress/screenshots` e `cypress/videos`, incluindo evidências de `cadastro.cy.js`. Essas evidências são ignoradas pelo Git por meio do `.gitignore`, portanto não são enviadas ao repositório. Em uma execução padrão do Cypress, screenshots também podem ser criados quando um teste falha.

## Boas práticas identificadas

- Centralização de configurações no `cypress.config.js` e uso de `baseUrl` em vez de URLs completas nos testes.
- Reuso de ações recorrentes por comandos customizados.
- Encapsulamento de seletores e ações de login e cadastro em classes de página.
- Uso de fixtures para dados previsíveis e Faker/`Date.now()` para reduzir colisões de e-mail em cadastros.
- Asserções de URL, visibilidade, texto de alerta e contador para verificar o resultado das ações.
- Separação dos testes por funcionalidade.

## Autor

Richard Marlon Balestrim, conforme autoria registrada no histórico de commits do repositório.

## Créditos

Projeto desenvolvido como parte dos estudos do curso de Engenharia de Qualidade de Software da EBAC, com adaptações, melhorias e documentação realizadas por Richard Marlon Balestrim.
