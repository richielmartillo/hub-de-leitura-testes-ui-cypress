Cypress.Commands.add('login', (email, senha) => {
  cy.visit('login.html');
  cy.url().should('include', 'login.html');

  cy.get('#email').type(email, { log: false });
  cy.get('#password').type(senha, { log: false });
  cy.get('#login-btn').click();
});

Cypress.Commands.add('preencherCadastro', (nome, email, telefone, senha, confirmarSenha) => {
  cy.get('#name').type(nome);
  cy.get('#email').type(email);
  cy.get('#phone').type(telefone);
  cy.get('#password').type(senha, { log: false });
  cy.get('#confirm-password').type(confirmarSenha, { log: false });
  cy.get('#terms-agreement').check();
  cy.get('#register-btn').click();
});
