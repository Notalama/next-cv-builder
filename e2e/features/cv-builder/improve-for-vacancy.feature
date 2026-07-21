@cv-builder @ai
Feature: Vacancy-aware AI assistance
  Members provide a vacancy description that guides AI text improvement
  and can generate a CV tailored to that vacancy.

  Background:
    Given I am signed in as a member
    And I create a new CV from the dashboard

  Scenario: Improve text uses the vacancy description as context
    When I apply the CV preset
    And I fill the vacancy description with "Senior React developer with Next.js and TypeScript"
    And I improve text for "About Me / Experience Summary"
    Then the "About Me / Experience Summary" field shows vacancy-aware improved text

  Scenario: Generate a perfect CV for the vacancy
    When I fill the vacancy description with "Senior React developer with Next.js and TypeScript"
    And I generate a perfect CV for the vacancy
    Then the "Full Name" field has value "Borys Koblents"
    And the "About Me / Experience Summary" field shows vacancy-tailored text
