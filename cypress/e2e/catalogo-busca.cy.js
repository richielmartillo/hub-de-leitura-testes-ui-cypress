describe('Funcionalidade: Busca no catálogo', () => {
  beforeEach(() => {
    cy.visit('catalog.html');
  });

  it('Deve buscar o livro 1984', () => {
    cy.get('#search-input').type('1984');
    cy.get('.card').should('contain', '1984');
  });

  it('Deve buscar um livro usando importação da fixture', () => {
    cy.fixture('livros').then((catalogo) => {
      cy.get('#search-input').type(catalogo[1].livro);
      cy.get('.card').should('contain', catalogo[1].livro);
    });
  });

  it('Deve buscar um livro carregado com cy.fixture', () => {
    cy.fixture('livros').then((catalogo) => {
      cy.get('#search-input').type(catalogo[1].livro);
      cy.get('.card').should('contain', catalogo[1].livro);
    });
  });

  it('Deve validar a busca de todos os livros da fixture', () => {
    cy.fixture('livros').then((catalogo) => {
      catalogo.forEach(({ livro }) => {
        cy.get('#search-input').clear().type(livro);
        cy.get('.card').should('contain', livro);
      });
    });
  });
});
