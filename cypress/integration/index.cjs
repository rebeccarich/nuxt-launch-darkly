describe('@mftc/nuxt-launch-darkly', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should fetch and render result from getAllVariations', () => {
    cy.get('[data-test=all-variants-pending]').should(
      'have.text',
      ' Pending: false'
    )
    cy.get('[data-test=all-variants-error]').should('have.text', ' Error: null')
    cy.get('[data-test=all-variants-data]').should(
      'not.have.text',
      ' Data: null'
    )
  })

  it('should fetch and render result from getVariationByKey', () => {
    cy.get('[data-test=single-variant-pending]').should(
      'have.text',
      ' Pending: false'
    )
    cy.get('[data-test=single-variant-error]').should(
      'have.text',
      ' Error: null'
    )
    cy.get('[data-test=single-variant-data]').should(
      'not.have.text',
      ' Data: null'
    )
  })
})
