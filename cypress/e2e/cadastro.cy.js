/// <reference types="cypress"/>
import { faker } from '@faker-js/faker'
import cadastroPage from '../support/pages/cadastro-page';

describe('Funcionalidade: Cadastro ', () => {

beforeEach(() => {
  cadastroPage.visitarPaginaCadastro()
});

afterEach(() => {
  cy.screenshot()
});


  it('Deve fazer cadastro com sucesso, usando função JS', () => {
    let email = `funcJs-${Date.now()}-@numAleatorio.com`

    cy.get('#name').type('Juanfri')
    cy.get('#email').type(email)
    cy.get('#phone').type('116865332568')
    cy.get('#password').type('456teste#$%¨*#GGER#S')
    cy.get('#confirm-password').type('456teste#$%¨*#GGER#S')
    cy.get('#terms-agreement').check()
    cy.get('#register-btn').click()

    //resultado esperado

    cy.url().should('include', 'dashboard')
  })

  it('Deve fazer cadastro com sucesso, usando Faker ', () => {
    let email = faker.internet.email()
    let nome = faker.person.fullName()
    cy.get('#name').type(nome)
    cy.get('#email').type(email)
    cy.get('#phone').type('116865332568')
    cy.get('#password').type('456teste#$%¨*#GGER#S')
    cy.get('#confirm-password').type('456teste#$%¨*#GGER#S')
    cy.get('#terms-agreement').check()
    cy.get('#register-btn').click()

    //resultado esperado

    cy.url().should('include', 'dashboard')
    cy.get('#user-name').should('contain', nome)
  })



   it('Deve fazer cadastro com sucesso usando usuario2 fixture', () => {
   cy.fixture('usuario2').then((user) => {
    const emailUnico = `user2-${Date.now()}@teste.com`

    cy.get('#name').type('Franco')
    cy.get('#email').type(emailUnico)        
    cy.get('#phone').type('116865332568')

    cy.get('#password').type(user.senha)     
    cy.get('#confirm-password').type(user.senha)

    cy.get('#terms-agreement').check()
    cy.get('#register-btn').click()

    
    cy.url().should('include', 'dashboard.html')
    
    cy.contains('Franco').should('be.visible')
    cy.contains('Hub de Leitura').should('be.visible')

  })
})



it('Deve preencher cadastro com sucesso - Usando comando customizado', () => {
  let email = `funcJs-${Date.now()}-@numAleatorio.com`
  let nome = faker.person.fullName({sex: 'male'})
  cy.preencherCadastro(
    nome, email, '542654868654556', 'teste123', 'teste123' 
  )
   cy.url().should('include', 'dashboard')
});

it('Deve fazer cadastro com sucesso - Usando Page Objects', () => {
  let email = `funcJs-${Date.now()}-@numAleatorio.com`
  cadastroPage.preencherCadastro('Richard Balestrim', email, '156468855156', 'senha123', 'senha123')
   cy.url().should('include', 'dashboard')
});

it('Deve validar mensagem ao tentar cadastrar sem preencher nome', () => {
  cadastroPage.preencherCadastro('', 'richard@teste.com', '456486768655', 'senha123', 'senha123')
  cy.get(':nth-child(1) > .invalid-feedback').should('contain', 'Nome deve ter pelo menos 2 caracteres')
});
})
