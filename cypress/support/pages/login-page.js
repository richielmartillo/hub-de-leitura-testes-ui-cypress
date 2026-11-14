class LoginPage {
  // selectores
  campoEmail() { return cy.get('#email') }
  campoSenha() { return cy.get('#password') }
  botaoLogin() { return cy.get('#login-btn') }

  // métodos
  visitarPaginaLogin() {
    cy.visit('login.html')
  }

  fazerLogin(email, senha) {
    if (email) this.campoEmail().clear().type(email)
    this.campoSenha().clear().type(senha, { log: false })
    this.botaoLogin().click()
  }
}

export default new LoginPage()
