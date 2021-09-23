Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    cy.visit('http://localhost:3003')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  const content = likes ? { title, author, url, likes } : { title, author, url }
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: content,
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem('loggedBlogAppUser')).token
      }`,
    },
  })

  cy.visit('http://localhost:3003')
})
