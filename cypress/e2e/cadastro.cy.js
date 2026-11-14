const uniqueEmail = () => `qa-${Date.now()}-${faker.string.uuid()}@example.com`;

import { faker } from '@faker-js/faker';
import cadastroPage from '../support/pages/cadastro-page';

describe('Funcionalidade: Cadastro', () => {
  beforeEach(() => {
    cadastroPage.visitarPaginaCadastro();
  });

  afterEach(() => {
    cy.screenshot();
  });

  it('Deve fazer cadastro com sucesso usando dados de teste', () => {
    const email = uniqueEmail();

    cy.get('#name').type('Leitor Teste');
    cy.get('#email').type(email);
    cy.get('#phone').type('11999990000');
    cy.get('#password').type('SenhaTeste123!', { log: false });
    cy.get('#confirm-password').type('SenhaTeste123!', { log: false });
    cy.get('#terms-agreement').check();
    cy.get('#register-btn').click();

    cy.url().should('include', 'dashboard');
  });

  it('Deve cadastrar usuário com dados gerados pelo Faker', () => {
    const email = uniqueEmail();
    const nome = faker.person.fullName();

    cy.get('#name').type(nome);
    cy.get('#email').type(email);
    cy.get('#phone').type('11999990000');
    cy.get('#password').type('SenhaTeste123!', { log: false });
    cy.get('#confirm-password').type('SenhaTeste123!', { log: false });
    cy.get('#terms-agreement').check();
    cy.get('#register-btn').click();

    cy.url().should('include', 'dashboard');
    cy.get('#user-name').should('contain', nome);
  });

  it('Deve cadastrar usando senha da fixture e e-mail único', () => {
    cy.fixture('usuario2').then((user) => {
      const email = uniqueEmail();

      cy.get('#name').type('Leitor Fixture');
      cy.get('#email').type(email);
      cy.get('#phone').type('11999990000');
      cy.get('#password').type(user.senha, { log: false });
      cy.get('#confirm-password').type(user.senha, { log: false });
      cy.get('#terms-agreement').check();
      cy.get('#register-btn').click();

      cy.url().should('include', 'dashboard');
      cy.contains('Leitor Fixture').should('be.visible');
      cy.contains('Hub de Leitura').should('be.visible');
    });
  });

  it('Deve preencher cadastro com comando customizado', () => {
    const nome = faker.person.fullName();

    cy.preencherCadastro(nome, uniqueEmail(), '11999990000', 'SenhaTeste123!', 'SenhaTeste123!');

    cy.url().should('include', 'dashboard');
  });

  it('Deve fazer cadastro usando Page Object', () => {
    const nome = faker.person.fullName();

    cadastroPage.preencherCadastro(nome, uniqueEmail(), '11999990000', 'SenhaTeste123!', 'SenhaTeste123!');

    cy.url().should('include', 'dashboard');
  });

  it('Deve validar nome obrigatório no cadastro', () => {
    cadastroPage.preencherCadastro('', 'qa@example.com', '11999990000', 'SenhaTeste123!', 'SenhaTeste123!');

    cy.get('.invalid-feedback').first()
      .should('be.visible')
      .and('contain', 'Nome deve ter pelo menos 2 caracteres');
  });
});
