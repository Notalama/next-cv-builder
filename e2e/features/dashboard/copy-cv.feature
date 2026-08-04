@dashboard
Feature: Copy CV from dashboard
  Signed-in members can duplicate a saved CV from the dashboard list.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Member copies a CV from the dashboard
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    And I copy the CV titled "Ada Lovelace"
    Then I see a CV copied confirmation
    And I see CV "Ada Lovelace" in my list
    And I see CV "Ada Lovelace (copy)" in my list
