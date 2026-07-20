@dashboard @smoke
Feature: Dashboard CV list
  Authenticated members manage their CV documents from the dashboard.

  Background:
    Given I am signed in as a member

  Scenario: New member sees an empty CV list
    When I visit the dashboard
    Then I am on the dashboard
    And I see the empty CV list

  Scenario: Member creates a new CV
    When I create a new CV from the dashboard
    Then I am in the CV builder
