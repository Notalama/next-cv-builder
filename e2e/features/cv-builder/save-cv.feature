@cv-builder @smoke
Feature: CV builder persistence
  Members can edit a CV in the live builder and keep their changes.

  Background:
    Given I am signed in as a member

  Scenario: Member applies preset and saves a CV
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I save the CV
    Then I see a CV saved confirmation
    And I see full name "Borys Koblents" in the preview

  Scenario: Saved CV appears on the dashboard
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    Then I see CV "Ada Lovelace" in my list
