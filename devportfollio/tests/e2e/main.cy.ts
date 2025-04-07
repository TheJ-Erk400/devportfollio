describe('CheckMate.AI Application', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/');
  });

  it('displays the login page initially', () => {
    // Check that the app loaded properly
    cy.contains('h2', 'Create Your Developer Profile').should('be.visible');
    cy.contains('button', 'Get Started').should('be.visible');
    cy.contains('Login to Access Tools').should('be.visible');
  });

  it('allows login and displays tools after authentication', () => {
    // Click login button
    cy.contains('button', 'Login').click();
    
    // Verify logged in state shows tools
    cy.contains('Your Developer Profile Tools').should('be.visible');
    cy.get('.qr-generator').should('be.visible');
    cy.get('.cv-generator').should('be.visible');
  });

  it('generates a QR code', () => {
    // Login first
    cy.contains('button', 'Login').click();
    
    // Fill QR code form
    cy.get('.qr-generator input[type="text"]').clear().type('https://github.com/myportfolio');
    cy.get('.qr-generator input[type="range"]').invoke('val', 250).trigger('change');
    
    // Select a different color
    cy.get('.qr-generator .color-option').eq(2).click(); // Select green color
    
    // Generate QR code
    cy.contains('button', 'Generate QR Code').click();
    
    // Verify QR code was generated
    cy.get('.qr-canvas').should('be.visible');
    
    // Download button should be enabled
    cy.contains('button', 'Download QR Code').should('not.be.disabled');
  });

  it('creates a resume with the CV generator', () => {
    // Login first
    cy.contains('button', 'Login').click();
    
    // Interact with the CV generator
    cy.get('.cv-generator').within(() => {
      // Fill personal info
      cy.get('input[type="text"]').eq(0).type('John Developer');
      cy.get('input[type="text"]').eq(1).type('Full Stack Developer');
      cy.get('input[type="email"]').type('john@example.com');
      cy.get('input[type="tel"]').type('555-123-4567');
      cy.get('textarea').eq(0).type('Experienced developer with expertise in Vue.js, TypeScript, and Node.js.');
      
      // Add skills
      cy.get('input[placeholder="Add a skill"]').type('Vue.js');
      cy.contains('button', 'Add').click();
      cy.get('input[placeholder="Add a skill"]').type('TypeScript');
      cy.contains('button', 'Add').click();
      cy.get('input[placeholder="Add a skill"]').type('Node.js');
      cy.contains('button', 'Add').click();
      
      // Add experience
      cy.contains('button', 'Add Experience').click();
      cy.get('.experience-form input').eq(0).type('Tech Company');
      cy.get('.experience-form input').eq(1).type('Senior Developer');
      cy.get('.experience-form input').eq(2).type('2020');
      cy.get('.experience-form input').eq(3).type('Present');
      cy.get('.experience-form textarea').type('Led development of multiple projects using Vue.js and TypeScript.');
      
      // Add education
      cy.contains('button', 'Add Education').click();
      cy.get('.education-form input').eq(0).type('University of Technology');
      cy.get('.education-form input').eq(1).type('BS in Computer Science');
      cy.get('.education-form input').eq(2).type('2012');
      cy.get('.education-form input').eq(3).type('2016');
      
      // Check that skills were added
      cy.get('.skill-tag').should('have.length', 3);
      
      // Generate Modern CV (intercept the PDF download)
      cy.window().then((win) => {
        cy.stub(win.jsPDF.prototype, 'save').as('pdfSave');
      });
      cy.contains('button', 'Generate Modern CV').click();
      
      // Check loading state appears and disappears
      cy.contains('Generating Your Resume').should('be.visible');
      cy.contains('Generating Your Resume', { timeout: 10000 }).should('not.exist');
    });
  });

  it('responds to logout action', () => {
    // Login
    cy.contains('button', 'Login').click();
    
    // Verify logged in state
    cy.contains('Your Developer Profile Tools').should('be.visible');
    
    // Logout
    cy.contains('button', 'Logout').click();
    
    // Verify logged out state
    cy.contains('Create Your Developer Profile').should('be.visible');
    cy.contains('Login to Access Tools').should('be.visible');
  });

  it('displays all required sections', () => {
    // Check for features section
    cy.get('#features').should('be.visible');
    cy.get('#features').within(() => {
      cy.contains('h2', 'Features').should('be.visible');
      cy.get('.feature-card').should('have.length', 3);
    });
    
    // Check for how it works section
    cy.get('#how-it-works').should('be.visible');
    cy.get('#how-it-works').within(() => {
      cy.contains('h2', 'How It Works').should('be.visible');
      cy.get('.step-card').should('have.length', 3);
    });
    
    // Check footer
    cy.get('footer').should('be.visible');
    cy.get('footer').contains('CheckMate.AI');
  });

  it('has working navigation', () => {
    // Check that nav links work
    cy.contains('a', 'Features').click();
    cy.get('#features').should('be.visible');
    cy.should('have.hash', '#features');
    
    cy.contains('a', 'How It Works').click();
    cy.get('#how-it-works').should('be.visible');
    cy.should('have.hash', '#how-it-works');
    
    cy.contains('a', 'Generators').click();
    cy.get('#generators').should('be.visible');
    cy.should('have.hash', '#generators');
    
    cy.contains('a', 'Contact').click();
    cy.get('#contact').should('be.visible');
    cy.should('have.hash', '#contact');
  });

  it('is responsive', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.contains('h2', 'Create Your Developer Profile').should('be.visible');
    
    // Login and check components on mobile
    cy.contains('button', 'Login').click();
    cy.get('.qr-generator').should('be.visible');
    cy.get('.cv-generator').should('be.visible');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('.qr-generator').should('be.visible');
    cy.get('.cv-generator').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport(1280, 800);
    cy.get('.qr-generator').should('be.visible');
    cy.get('.cv-generator').should('be.visible');
  });
}); 