/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { RULES_ADD_PATH, RULES_UPDATES } from '@kbn/security-solution-plugin/common/constants';
import {
  ADD_ELASTIC_RULES_BTN,
  ADD_ELASTIC_RULES_TABLE,
  getInstallSingleRuleLoadingSpinnerByRuleId,
  getUpgradeSingleRuleLoadingSpinnerByRuleId,
  RULES_MANAGEMENT_TABLE,
  RULES_UPDATES_TAB,
  RULES_UPDATES_TABLE,
  TOASTER,
  SUCCESS_TOASTER,
} from '../screens/alerts_detection_rules';
import type { SAMPLE_PREBUILT_RULE } from './api_calls/prebuilt_rules';
import {
  RULE_UPGRADE_TABLE_MODIFICATION_FILTER_BUTTON,
  RULE_UPGRADE_TABLE_MODIFICATION_FILTER_PANEL,
} from '../screens/rule_updates';
import { RULE_UPGRADE_CONFLICTS_MODAL } from '../screens/rule_updates';

export const clickAddElasticRulesButton = () => {
  cy.get(ADD_ELASTIC_RULES_BTN).click();
  cy.location('pathname').should('include', RULES_ADD_PATH);
};

export const clickRuleUpdatesTab = () => {
  cy.get(RULES_UPDATES_TAB).click();
  cy.location('pathname').should('include', RULES_UPDATES);
};

export const assertInstallationRequestIsComplete = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  for (const rule of rules) {
    cy.get(getInstallSingleRuleLoadingSpinnerByRuleId(rule['security-rule'].rule_id)).should(
      'exist'
    );
  }
  for (const rule of rules) {
    cy.get(getInstallSingleRuleLoadingSpinnerByRuleId(rule['security-rule'].rule_id)).should(
      'not.exist'
    );
  }
};

export const assertUpgradeRequestIsComplete = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  for (const rule of rules) {
    cy.get(getUpgradeSingleRuleLoadingSpinnerByRuleId(rule['security-rule'].rule_id)).should(
      'exist'
    );
  }
  for (const rule of rules) {
    cy.get(getUpgradeSingleRuleLoadingSpinnerByRuleId(rule['security-rule'].rule_id)).should(
      'not.exist'
    );
  }
};

export const interceptInstallationRequestToFail = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  cy.intercept('POST', '/internal/detection_engine/prebuilt_rules/installation/_perform', {
    body: {
      summary: {
        succeeded: [],
        skipped: [],
        failed: rules.length,
      },
    },
    delay: 500, // Add delay to give Cypress time to find the loading spinner
  }).as('installPrebuiltRules');
};

export const interceptUpgradeRequestToFail = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  cy.intercept('POST', '/internal/detection_engine/prebuilt_rules/upgrade/_perform', {
    body: {
      summary: {
        succeeded: [],
        skipped: [],
        failed: rules.length,
      },
      results: {
        updated: [],
        skipped: [],
      },
      errors: {
        message: 'Test error',
        status_code: 400,
        rules: [{ rule_id: 'test_rule', name: 'Test rule' }],
      },
    },
    delay: 500, // Add delay to give Cypress time to find the loading spinner
  }).as('updatePrebuiltRules');
};

export const assertRuleInstallationSuccessToastShown = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  const rulesString = rules.length > 1 ? 'rules' : 'rule';
  cy.get(SUCCESS_TOASTER)
    .should('be.visible')
    .should('have.text', `${rules.length} ${rulesString} installed successfully.`);
};

export const assertRuleInstallationFailureToastShown = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  const rulesString = rules.length > 1 ? 'rules' : 'rule';
  cy.get(TOASTER)
    .should('be.visible')
    .should('have.text', `${rules.length} ${rulesString} failed to install.`);
};

export const assertRuleUpgradeSuccessToastShown = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  const rulesString = rules.length > 1 ? 'rules' : 'rule';
  cy.get(SUCCESS_TOASTER)
    .should('be.visible')
    .should('contain', `${rules.length} ${rulesString} updated successfully.`);
};

export const assertRuleUpgradeFailureToastShown = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  const rulesString = rules.length > 1 ? 'rules' : 'rule';
  cy.get(TOASTER)
    .should('be.visible')
    .should('have.text', `${rules.length} ${rulesString} failed to update.`);
};

export const assertRulesPresentInInstalledRulesTable = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  for (const rule of rules) {
    cy.get(RULES_MANAGEMENT_TABLE).contains(rule['security-rule'].name);
  }
};

export const assertRulesPresentInAddPrebuiltRulesTable = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  for (const rule of rules) {
    cy.get(ADD_ELASTIC_RULES_TABLE).contains(rule['security-rule'].name);
  }
};

export const assertRulesNotPresentInAddPrebuiltRulesTable = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  for (const rule of rules) {
    cy.get(ADD_ELASTIC_RULES_TABLE).contains(rule['security-rule'].name).should('not.exist');
  }
};

export const assertRulesPresentInRuleUpdatesTable = (rules: Array<typeof SAMPLE_PREBUILT_RULE>) => {
  for (const rule of rules) {
    cy.get(RULES_UPDATES_TABLE).contains(rule['security-rule'].name);
  }
};

export const assertRulesNotPresentInRuleUpdatesTable = (
  rules: Array<typeof SAMPLE_PREBUILT_RULE>
) => {
  cy.url().should('include', RULES_UPDATES);
  for (const rule of rules) {
    cy.get(rule['security-rule'].name).should('not.exist');
  }
};

export const filterPrebuiltRulesUpdateTableByRuleCustomization = (text: string) => {
  cy.get(RULE_UPGRADE_TABLE_MODIFICATION_FILTER_BUTTON).click();
  cy.get(RULE_UPGRADE_TABLE_MODIFICATION_FILTER_PANEL).contains(text).click();
  cy.get(RULE_UPGRADE_TABLE_MODIFICATION_FILTER_BUTTON).click();
};

export const assertRuleUpgradeConflictsModalShown = () => {
  cy.get(RULE_UPGRADE_CONFLICTS_MODAL).should('be.visible');
};

export const clickUpgradeRuleWithoutConflicts = () => {
  cy.get(RULE_UPGRADE_CONFLICTS_MODAL).contains('button', 'Update').click();
};
