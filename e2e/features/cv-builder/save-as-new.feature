@cv-builder @smoke
Feature: Save CV as new
  Members editing an existing CV can save the current form as a new document
  without overwriting the original.

  Background:
    Given I am signed in as a member

  Scenario: Member saves as new from the builder
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I set the full name to "Ada Lovelace Edited"
    And I save the CV as new
    Then I see a CV saved as new confirmation
    And I am in the CV builder
    And the URL has a CV id
    When I visit the dashboard
    Then I see CV "Ada Lovelace" in my list
    And I see CV "Ada Lovelace Edited (copy)" in my list
