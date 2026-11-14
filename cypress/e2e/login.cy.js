const hasUserCredentials = () => Boolean(
  Cypress.env('testUserEmail') && Cypress.env('testUserPassword'),
);

const hasAdminCredentials = () => Boolean(
  Cypress.env('adminEmail') && Cypress.env('adminPassword'),
);

import user from '../fixtures/usuario.json';
import loginPage from '../support/pages/login-page';

describe('Funcionalidade: Login', () => {
  beforeEach(() => {
    loginPage.visitarPaginaLogin();
  });

  it('Deve fazer login com sucesso', function () {
    if (!hasUserCredentials()) this.skip();

    cy.get('#email').type(Cypress.env('testUserEmail'), { log: false });
    cy.get('#password').type(Cypress.env('testUserPassword'), { log: false });
    cy.get('#login-btn').click();
    cy.url().should('include', 'dashboard');
  });

  it('Deve fazer login com sucesso usando comando customizado', function () {
    if (!hasUserCredentials()) this.skip();

    cy.login(Cypress.env('testUserEmail'), Cypress.env('testUserPassword'));
    cy.url().should('include', 'dashboard');
  });

  it('Deve fazer login com sucesso com conta administrativa', function () {
    if (!hasAdminCredentials()) this.skip();

    cy.login(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
    cy.url().should('include', 'dashboard');
  });

  it('Deve fazer login usando os nomes de variáveis definidos na fixture', function () {
    if (!hasUserCredentials()) this.skip();

    cy.fixture('usuario').then((credentials) => {
      cy.login(
        Cypress.env(credentials.emailEnv),
        Cypress.env(credentials.passwordEnv),
      );
    });
    cy.url().should('include', 'dashboard');
  });
});
