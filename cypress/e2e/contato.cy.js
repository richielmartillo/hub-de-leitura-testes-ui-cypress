describe('Funcionalidade: Contato', () => {
  beforeEach(() => {
    cy.visit('index.html');
  });

  it('Deve enviar o formulário de contato com sucesso', () => {
    cy.get('[name="name"]').type('Pessoa QA');
    cy.get('[name="email"]').type('qa@example.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Mensagem de teste automatizado');
    cy.get('#btn-submit').click();

    cy.contains('Contato enviado com sucesso!').should('be.visible');
  });

  it('Deve validar erro ao enviar sem preencher nome', () => {
    cy.get('[name="email"]').type('qa@example.com');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Mensagem de teste automatizado');
    cy.get('#btn-submit').click();

    cy.get('#alert-container').should('contain', 'Por favor, preencha o campo Nome');
  });

  it('Deve validar erro ao enviar sem preencher e-mail', () => {
    cy.get('[name="name"]').type('Pessoa QA');
    cy.get('[name="subject"]').select('Sugestões');
    cy.get('[name="message"]').type('Mensagem de teste automatizado');
    cy.get('#btn-submit').click();

    cy.get('#alert-container').should('contain', 'Por favor, preencha o campo E-mail');
  });

  it('Deve validar erro ao enviar sem selecionar assunto', () => {
    cy.get('[name="subject"]').should('have.value', '');
    cy.get('[name="name"]').type('Pessoa QA');
    cy.get('[name="email"]').type('qa@example.com');
    cy.get('[name="message"]').type('Mensagem de teste automatizado');
    cy.get('#btn-submit').click();

    cy.get('#alert-container').should('contain', 'Por favor, selecione o Assunto');
  });

  it('Deve validar erro ao enviar sem preencher mensagem', () => {
    cy.get('[name="name"]').type('Pessoa QA');
    cy.get('[name="email"]').type('qa@example.com');
    cy.get('[name="subject"]').select('Parcerias');
    cy.get('[name="message"]').clear();
    cy.get('#btn-submit').click();

    cy.get('#alert-container').should('contain', 'Por favor, escreva sua Mensagem');
  });
});
