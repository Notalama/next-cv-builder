@dashboard
Feature: Delete CV from dashboard
  Signed-in members can remove a saved CV from the dashboard list.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Member deletes a saved CV from the dashboard
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Ada Lovelace"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    And I delete the CV titled "Ada Lovelace"
    Then I see a CV deleted confirmation
    And I do not see CV "Ada Lovelace" in my list

  Scenario: Member deletes the last CV and sees empty state
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Grace Hopper"
    And I save the CV
    Then I see a CV saved confirmation
    When I visit the dashboard
    And I delete the CV titled "Grace Hopper"
    Then I see a CV deleted confirmation
    And I see the empty CV list
