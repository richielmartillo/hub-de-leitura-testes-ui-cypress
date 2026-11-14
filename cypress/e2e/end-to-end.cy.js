import { faker } from '@faker-js/faker';
import cadastroPage from '../support/pages/cadastro-page';
import loginPage from '../support/pages/login-page';

describe('Funcionalidade: Teste de ponta a ponta', () => {
  beforeEach(() => {
    cadastroPage.visitarPaginaCadastro();
  });

  it('Deve cadastrar e fazer login com o usuário recém-cadastrado', () => {
    const email = `qa-${Date.now()}-${faker.string.uuid()}@example.com`;
    const nome = faker.person.fullName();
    const telefone = '11999990000';
    const senha = 'SenhaTeste123!';

    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha);
    loginPage.visitarPaginaLogin();
    loginPage.fazerLogin(email, senha);

    cy.url().should('include', 'dashboard');
  });
});
