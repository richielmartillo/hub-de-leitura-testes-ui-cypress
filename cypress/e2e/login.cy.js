/// <reference types="cypress"/>

import user from "../fixtures/usuario.json"
import LoginPage from '../support/pages/login-page'


describe('Funcionalidade: Login', () => {

  beforeEach(() => {
    LoginPage.visitarPaginaLogin()
  })

  it('Deve fazer login com sucesso', () => {
    cy.get('#email').type('usuario@teste.com')
    cy.get('#password').type('user123')
    cy.get('#login-btn').click()
    cy.url().should('include', 'dashboard')
  });

  it('Deve fazer login com sucesso - Usando comando customizado', () => {
    cy.login('usuario@teste.com', 'user123')
  })

  it('Deve fazer login com sucesso com conta Admin - Usando comando customizado', () => {
    cy.login('adminbiblioteca.com', 'admin123')
  });

  it('Deve fazer login com sucesso - Usando importação da massa de dados', () => {
    cy.login(user.email, user.senha)
  });

  it('Deve fazer login com sucesso usando page objects', () => {
    LoginPage.fazerLogin(user.email, user.senha)
    cy.url().should('include', 'dashboard')
  });
});





