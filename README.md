# Automação E2E — Hub de Leitura

Suíte de testes automatizados de interface para validar fluxos essenciais da aplicação **Hub de Leitura** usando Cypress 15 e JavaScript. Este repositório contém a automação, não o código-fonte da aplicação testada: a aplicação precisa ser iniciada separadamente e estar acessível pelo navegador usado nos testes.

## Objetivo e escopo

O projeto demonstra automação de jornadas reais pela interface, organização de cenários por funcionalidade e uso de diferentes estratégias de reutilização. Os testes cobrem:

- Login de usuário e administrador (credenciais fornecidas pelo ambiente).
- Cadastro, validação de campo obrigatório e jornada de cadastro seguida de login.
- Busca de livros com massa de dados em fixture.
- Inclusão de livros na cesta, contador, alertas e página de detalhes.
- Envio válido e validação de campos obrigatórios do formulário de contato.

## Tecnologias

- JavaScript, Node.js e npm.
- Cypress 15 para automação E2E no Chrome.
- `@faker-js/faker` para nomes e dados únicos de cadastro.
- `wait-on` para aguardar a aplicação externa no pipeline.
- Jenkins Declarative Pipeline para instalação, espera e execução da suíte.

## Estrutura

```text
cypress/
  e2e/                 Especificações separadas por funcionalidade
  fixtures/            Massa de livros, senha de cadastro e nomes das variáveis de login
  support/
    commands.js        Comandos reutilizáveis de login e cadastro
    e2e.js              Carregamento global dos comandos
    pages/              Page Objects de login e cadastro
cypress.config.js       URL-base e configuração de credenciais por ambiente
jenkinsfile             Pipeline Jenkins
package.json            Dependências e scripts npm
package-lock.json       Versões travadas das dependências
```

## Pré-requisitos

- Node.js compatível com as versões do lockfile (Cypress 15 e Faker requerem uma versão atual; use Node.js 20.19+ ou 22.13+ e npm 10+).
- Google Chrome instalado e acessível ao processo Cypress.
- Aplicação Hub de Leitura em execução e acessível, por padrão, em `http://localhost:3000`.
- Para os cenários de login, uma conta de teste descartável configurada no ambiente. Os testes de usuário e administrador são marcados como ignorados quando as credenciais correspondentes não foram fornecidas.

Este repositório não contém nem inicia a aplicação. O endereço da aplicação deve ser acessível a partir da máquina ou agente que executa o Cypress.

## Instalação e execução local

Clone este repositório (não o projeto upstream da EBAC):

```bash
git clone https://github.com/richielmartillo/hub-de-leitura-testes-ui-cypress.git
cd hub-de-leitura-testes-ui-cypress
npm ci
```

Inicie a aplicação Hub de Leitura em outro processo. Para usar uma URL diferente, configure `CYPRESS_BASE_URL` antes de executar Cypress. As credenciais de login são opcionais para a suíte inteira, mas necessárias nos testes de login:

```bash
# Linux/macOS — URL e conta descartável de usuário
export CYPRESS_BASE_URL=http://localhost:3000
export TEST_USER_EMAIL=usuario-de-teste@example.com
export TEST_USER_PASSWORD='senha-descartavel'

# Opcional: os testes administrativos só executam quando ambas estiverem configuradas
export TEST_ADMIN_EMAIL=admin-de-teste@example.com
export TEST_ADMIN_PASSWORD='senha-descartavel'

npm test
```

No PowerShell, use `$env:CYPRESS_BASE_URL = 'http://localhost:3000'` e equivalentes `$env:TEST_USER_EMAIL`, `$env:TEST_USER_PASSWORD`, `$env:TEST_ADMIN_EMAIL` e `$env:TEST_ADMIN_PASSWORD`. Não grave senhas em fixtures, no README, no Jenkinsfile ou em arquivos versionados. O `.gitignore` já exclui arquivos `.env`; a suíte não carrega `.env` automaticamente.

Comandos adicionais:

```bash
# Abrir o Cypress interativo
npx cypress open

# Executar uma especificação
npx cypress run --browser chrome --spec "cypress/e2e/login.cy.js"

# Gravar a execução no Cypress Cloud (requer chave configurada localmente)
# Linux/macOS: export CYPRESS_RECORD_KEY=<chave>
# PowerShell:  $env:CYPRESS_RECORD_KEY = '<chave>'
npm run cy:report
```

`CYPRESS_RECORD_KEY` não deve ser colocada no `package.json`. No Jenkins, configure-a no armazenamento de credenciais e disponibilize-a como variável de ambiente apenas quando a gravação no Cloud for desejada. O script `cy:report` requer também a configuração do projeto Cypress Cloud.

## Estratégias de automação

- Especificações agrupadas por funcionalidade em `cypress/e2e/`.
- Comandos `cy.login()` e `cy.preencherCadastro()` para ações reutilizadas; dados de senha não são adicionados ao log de comandos.
- Page Objects para centralizar ações e seletores das telas de login e cadastro.
- Fixtures para dados previsíveis e Faker/UUID para gerar e-mails únicos em cadastros.
- Asserções baseadas em estado observável da interface e seletores por IDs, nomes de campos e texto do livro, evitando índices de cards.
- Os testes usam os elementos existentes na aplicação externa. Como este repositório não contém seu HTML, não presume a existência de `data-cy` ou `data-testid`.

## Jenkins

O `jenkinsfile` executa `npm ci`, aguarda a URL configurada em `HUB_APP_URL` (padrão `http://localhost:3000`) e roda `npm test`. Falha se a instalação, espera ou suíte falhar, e arquiva vídeos e screenshots do Cypress quando gerados.

Configure no Jenkins:

1. A instalação de Node.js nomeada `nodejs` pelo NodeJS plugin.
2. Chrome no agente Jenkins.
3. A aplicação externa iniciada antes da etapa de espera, e `HUB_APP_URL` apontando para um endereço alcançável pelo agente. A pipeline não clona nem inicializa esse outro projeto porque não há URL, caminho ou comando de inicialização fornecido neste repositório.
4. Opcionalmente, variáveis `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` e `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` através das credenciais do Jenkins. Não defina valores sensíveis no Jenkinsfile.
5. Opcionalmente, a credencial `CYPRESS_RECORD_KEY` para execuções gravadas no Cypress Cloud.

O agente pode ser Windows ou Unix; o pipeline escolhe `bat` ou `sh`. A URL precisa ser acessível a partir do agente de execução.

## Limitações conhecidas

- A aplicação testada e sua configuração de dados/contas são dependências externas; sem ela os testes não podem ser validados.
- Os testes de login são ignorados quando as credenciais não são fornecidas. Use contas descartáveis preparadas na aplicação.
- Os seletores disponíveis refletem o HTML atual da aplicação e ainda podem precisar de ajustes caso essa aplicação mude. Recomenda-se que o projeto da aplicação adicione atributos estáveis `data-cy`/`data-testid` para automação, mas nenhum atributo desse tipo é presumido ou inventado nesta suíte.
- Não há relatório JUnit configurado; o Jenkins arquiva as evidências de vídeo e screenshot do Cypress.
- A gravação Cypress Cloud é opcional e requer chave e projeto configurados no ambiente.

## Créditos e origem

A automação foi desenvolvida no contexto dos estudos do curso de Engenharia de Qualidade de Software da **EBAC**, com adaptações, testes e documentação de Richard Marlon Balestrim. A aplicação Hub de Leitura e o projeto-base de referência da EBAC são distintos deste repositório de automação. A referência upstream indicada anteriormente no projeto é [EBAC-QE/hub-de-leitura-teste-ui](https://github.com/EBAC-QE/hub-de-leitura-teste-ui); este repositório de portfólio mantém os créditos sem confundir a origem da aplicação com o código dos testes.
