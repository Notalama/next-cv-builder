@dashboard
Feature: Rename CV from dashboard
  Signed-in members can rename a saved CV from the dashboard list.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Member renames a saved CV
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    And I rename the CV titled "Ada Lovelace" to "Analytical Engines CV"
    Then I see a CV renamed confirmation
    And I see CV "Analytical Engines CV" in my list
    And I do not see CV "Ada Lovelace" in my list

  Scenario: Member cancels rename
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    And I open rename for the CV titled "Ada Lovelace"
    And I set the rename field to "Should Not Persist"
    And I cancel rename
    Then I see CV "Ada Lovelace" in my list
