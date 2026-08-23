@dashboard
Feature: Speed Reader
  Signed-in members can open the Speed Reader tool from the dashboard.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Member opens the speed reader from the dashboard
    When I visit the dashboard
    And I open the speed reader
    Then I am on the speed reader page
    And I see a back to dashboard control
    And I see the speed reader tool
