@cv-builder @smoke
Feature: CV builder scroll to
  Members can jump to the top or bottom of the form with scroll buttons.

  Background:
    Given I am signed in as a member

  Scenario: Member scrolls to bottom and sees scroll to top button
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I scroll to bottom of form
    Then I see a scroll to top button

  Scenario: Member clicks scroll to top button and sees header
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I scroll to bottom of form
    And I click scroll to top button
    Then I see header

  Scenario: Member sees scroll to bottom button near the top
    When I create a new CV from the dashboard
    And I apply the CV preset
    Then I see a scroll to bottom button

  Scenario: Member clicks scroll to bottom button and sees save button
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I click scroll to bottom button
    Then I see the save CV button
