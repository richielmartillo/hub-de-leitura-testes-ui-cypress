const addBookToCart = (title) => {
  cy.contains('.card', title).within(() => {
    cy.contains('button', /adicionar.*cesta/i).click();
  });
};

const readCartCount = () => cy.get('#cart-count')
  .invoke('text')
  .then((text) => Number(text.trim()) || 0);

describe('Funcionalidade: Catálogo de livros', () => {
  beforeEach(() => {
    cy.visit('catalog.html');
  });

  it('Deve adicionar um livro ao clicar na ação do card', () => {
    addBookToCart('1984');
    cy.get('#cart-count').should(($count) => {
      expect(Number($count.text().trim())).to.be.greaterThan(0);
    });
  });

  it('Deve clicar em todos os botões Adicionar à Cesta', () => {
    cy.get('button')
      .filter((_, button) => /adicionar.*cesta/i.test(button.innerText))
      .click({ multiple: true });

    cy.get('#cart-count').should(($count) => {
      expect(Number($count.text().trim())).to.be.greaterThan(0);
    });
  });

  it('Deve adicionar o primeiro livro conhecido do catálogo', () => {
    addBookToCart('1984');
    cy.get('#global-alert-container').should('be.visible').and('contain', '1984');
  });

  it('Deve adicionar A Metamorfose ao catálogo', () => {
    addBookToCart('A Metamorfose');
    cy.get('#global-alert-container').should('be.visible').and('contain', 'A Metamorfose');
  });

  it('Deve adicionar Dom Casmurro e exibir alerta de sucesso', () => {
    addBookToCart('Dom Casmurro');
    cy.get('#global-alert-container').should('be.visible').and('contain', 'Dom Casmurro');
  });

  it('Deve aumentar o contador ao adicionar um livro', () => {
    readCartCount().then((before) => {
      addBookToCart('Dom Casmurro');
      cy.get('#cart-count').should(($count) => {
        expect(Number($count.text().trim())).to.be.greaterThan(before);
      });
    });
  });

  it('Deve validar o título do livro no alerta após adicionar à cesta', () => {
    addBookToCart('Dom Casmurro');
    cy.get('#global-alert-container').should('be.visible').and('contain', 'Dom Casmurro');
  });

  it('Deve abrir os detalhes de Dom Casmurro e adicioná-lo à cesta', () => {
    cy.contains('Dom Casmurro').click();
    cy.url().should('include', 'book-details');
    cy.get('#add-to-cart-btn').click();
    cy.get('#alert-container')
      .should('be.visible')
      .and('contain', 'Livro adicionado à cesta com sucesso');
  });
});
