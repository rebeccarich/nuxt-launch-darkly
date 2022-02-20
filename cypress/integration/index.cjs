describe('@mftc/nuxt-launch-darkly', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should fetch and render result from getVariationByKey', () => {
    cy.get('[data-test=single-variant-pending]').should(
      'contain',
      'Pending: false'
    )
    cy.get('[data-test=single-variant-error]').should('contain', 'Error: null')
    cy.get('[data-test=single-variant-data]').should(
      'contain',
      '"variation": true'
    )
  })

  it('should fetch and render result from getVariationDetail', () => {
    cy.get('[data-test=single-variant-detail-pending]').should(
      'contain',
      'Pending: false'
    )
    cy.get('[data-test=single-variant-detail-error]').should(
      'contain',
      'Error: null'
    )
    cy.get('[data-test=single-variant-detail-data]').should(
      'contain',
      '"value": true'
    )
  })

  it('should fetch and render result from getAllVariations', () => {
    cy.get('[data-test=all-variants-pending]').should(
      'contain',
      'Pending: false'
    )
    cy.get('[data-test=all-variants-pending]').should(
      'contain',
      'Pending: false'
    )
    cy.get('[data-test=all-variants-error]').should('contain', 'Error: null')
    cy.get('[data-test=all-variants-data]').should('contain', '"flag-1": true')
    cy.get('[data-test=all-variants-data]').should('contain', '"flag-2": false')
    cy.get('[data-test=all-variants-data]').should('contain', '"flag-3": true')
  })

  it('should fetch and render result from getAllVariations with includeKey set', () => {
    cy.get('[data-test=all-variants-pick-pending]').should(
      'contain',
      'Pending: false'
    )
    cy.get('[data-test=all-variants-pick-error]').should(
      'contain',
      'Error: null'
    )
    cy.get('[data-test=all-variants-pick-data]').should(
      'contain',
      '"flag-1": true'
    )
  })
})
