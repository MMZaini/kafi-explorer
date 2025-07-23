describe('Search Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should load the page and display the search input', () => {
      cy.get('input[placeholder="Enter search terms..."]').should('be.visible');
    });
  
    it('should perform a search and display results', () => {
      // Enter search term
      cy.get('input[placeholder="Enter search terms..."]').type('example search term');
  
      // Click the search button
      cy.contains('button', 'Search').click();
  
      // Wait for the results to load
      cy.get('.animate-pulse').should('not.exist');
  
      // Check if results are displayed
      cy.get('.bg-white.rounded-xl.shadow-md').should('have.length.greaterThan', 0);
    });
  
    it('should toggle the "Search Across All Volumes" checkbox', () => {
      // Check the checkbox
      cy.get('input#searchAllVolumes').check().should('be.checked');

      // Uncheck the checkbox
      cy.get('input#searchAllVolumes').uncheck().should('not.be.checked');
    });

    it('can toggle dark mode', () => {
      cy.get('button').contains('Kafi Explorer').should('be.visible');
      cy.get('button').last().click();
      cy.get('html').should('have.class', 'dark');
    });
  
  
    it('should filter results based on grading checkboxes', () => {
      // Check the "Sahih" checkbox
      cy.get('input#sahihOnly').check().should('be.checked');
  
      // Perform a search
      cy.get('input[placeholder="Enter search terms..."]').type('example search term');
      cy.contains('button', 'Search').click();
  
      // Wait for the results to load
      cy.get('.animate-pulse').should('not.exist');
  
      // Check if results are displayed
      cy.get('.bg-white.rounded-xl.shadow-md').should('have.length.greaterThan', 0);
  
      // Uncheck the "Sahih" checkbox
      cy.get('input#sahihOnly').uncheck().should('not.be.checked');
    });
  });