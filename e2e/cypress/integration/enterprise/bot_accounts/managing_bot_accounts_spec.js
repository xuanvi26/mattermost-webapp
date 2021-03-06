// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @enterprise @bot_accounts

import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('Managing bot accounts', () => {
    let botName;

    beforeEach(() => {
        cy.apiRequireLicenseForFeature('LDAP');

        cy.apiAdminLogin();

        // # Set ServiceSettings to expected values
        const newSettings = {
            ServiceSettings: {
                EnableBotAccountCreation: true,
            },
        };
        cy.apiUpdateConfig(newSettings);

        // # Create a test bot
        cy.apiCreateBot().then(({bot}) => {
            botName = bot.username;
        });
    });

    it('MM-T1855 Bot cannot login', () => {
        cy.apiLogout();
        cy.visitAndWait('/login');

        // # Enter bot name in the email field
        cy.findByPlaceholderText('Email, Username or AD/LDAP Username', {timeout: TIMEOUTS.ONE_MIN}).clear().type(botName);

        // # Enter random password in the password field
        cy.findByPlaceholderText('Password').clear().type('invalidPassword@#%(^!');

        // # Hit enter to login
        cy.findByText('Sign in').click();

        // * Verify appropriate error message is displayed for bot login
        cy.findByText('Bot login is forbidden.').should('exist').and('be.visible');
    });
});
