@cv-builder @ai @smoke
Feature: AI text improvement
  Signed-in members can improve CV text with AI for a target role.

  Background:
    Given I am signed in as a member
    And I create a new CV from the dashboard
    And I apply the CV preset

  Scenario: Member improves the about me section
    When I improve text for "About Me / Experience Summary"
    Then the "About Me / Experience Summary" field shows improved text

  Scenario: Member improves primary skills
    When I improve text for "Primary Skills"
    Then the "Primary Skills" field shows improved text

  Scenario: Member improves a project description
    When I improve text for "Description & Your Role"
    Then the "Description & Your Role" field shows improved text
