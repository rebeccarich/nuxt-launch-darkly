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

  it('should identify a user when the button is clicked', () => {
    cy.intercept('GET', '**/user/identify**').as('identify')
    cy.wait(500)
    cy.get('[data-test="identify-button"]').click()
    cy.wait('@identify')
    cy.get('[data-test="identify-result"]').should('contain', 'success')
  })

  it('should send custom tracking event when the button is clicked', () => {
    cy.intercept('POST', '**/user/track**').as('track')
    cy.wait(500)
    cy.get('[data-test="track-button"]').click()
    cy.wait('@track')
    cy.get('[data-test="track-result"]').should('contain', 'success')
  })
})
