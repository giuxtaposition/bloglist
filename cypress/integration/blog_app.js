describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Lily Evans',
      username: 'lilyevans',
      password: 'giuxtaposition',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const otherUser = {
      name: 'Lily Not Evans',
      username: 'lilynotevans',
      password: 'giuxtaposition',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', otherUser)

    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function () {
    cy.get('#login-username')
    cy.get('#login-password')
    cy.get('#login-button')
  })

  it('user can login', function () {
    cy.get('#login-username').type('lilyevans')
    cy.get('#login-password').type('giuxtaposition')
    cy.get('#login-button').click()
    cy.contains('lilyevans logged in')
  })

  it('login fails with wrong password', function () {
    cy.get('#login-username').type('lilyevans')
    cy.get('#login-password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')

    cy.get('html').should('not.contain', 'lilyevans logged in')
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'lilyevans', password: 'giuxtaposition' })
      cy.createBlog({
        title: 'Another blog from Cypress',
        author: 'Cypress Author',
        url: 'http://cypresstestingblogapp.nice',
      })
    })

    it('A blog can be created', function () {
      cy.contains('Create New Blog').click()

      cy.get('#form-title').type('Cypress Title')
      cy.get('#form-author').type('Cypress Author')
      cy.get('#form-url').type('url-created-by-cypress.com')

      cy.contains('save').click()

      cy.contains('Cypress Title by Cypress Author')
      cy.get('.success')
        .should('contain', 'Cypress Title')
        .should('contain', 'Cypress Author')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('A blog can be liked', function () {
      cy.contains('View').click()

      cy.get('#blog-likes').then($span => {
        // capture what num is right now
        const num1 = parseFloat($span.text())

        cy.contains('Like').click()
        cy.wait(500)
        cy.get('#blog-likes').then($span2 => {
          const num2 = parseFloat($span2.text())
          expect(num2).to.eq(num1 + 1)
        })
      })
    })

    it('The user that created a blog can delete it', function () {
      cy.contains('View').click()
      cy.contains('Remove').click()

      cy.get('.success')
        .should('contain', 'Deleted')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('.blog-list').should('not.contain', 'Another blog from Cypress')
    })

    it('User that did not create a blog cannot delete it', function () {
      cy.contains('Logout').click()
      cy.login({ username: 'lilynotevans', password: 'giuxtaposition' })

      cy.contains('View').click()

      cy.get('.blog-list')
        .contains('Another blog from Cypress')
        .parent()
        .parent()
        .should('not.contain', 'Remove')
    })

    it('Blogs are ordered by number of likes', function () {
      cy.createBlog({
        title: 'Blog from Cypress - number 1',
        author: 'Cypress Author',
        url: 'http://cypress.com',
        likes: 1,
      })
        .then(() =>
          cy.createBlog({
            title: 'Blog from Cypress - number 2',
            author: 'Cypress Author',
            url: 'http://cypress.com',
            likes: 2,
          })
        )
        .then(() =>
          cy.createBlog({
            title: 'Blog from Cypress - number 3',
            author: 'Cypress Author',
            url: 'http://cypress.com',
            likes: 3,
          })
        )
      cy.get('.blog').then(blogs => {
        expect(blogs[0].textContent).contains('Blog from Cypress - number 3')
        expect(blogs[1].textContent).contains('Blog from Cypress - number 2')
        expect(blogs[2].textContent).contains('Blog from Cypress - number 1')
        expect(blogs[3].textContent).contains('Another blog from Cypress')
      })
    })
  })
})
