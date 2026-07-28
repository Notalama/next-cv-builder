@cv-builder @ai
Feature: Generate cover letter from vacancy and CV
  Members can generate an ultra-concise cover letter from the Target Vacancy
  section using the current form CV and a filled vacancy description.

  Background:
    Given I am signed in as a member
    And I create a new CV from the dashboard

  Scenario: Generate cover letter with vacancy and filled CV
    When I apply the CV preset
    And I fill the vacancy description with "Senior React developer with Next.js and TypeScript"
    And I fill the company name with "Acme Corp"
    And I generate a cover letter
    Then I see a generated cover letter result
    And the generated cover letter word count is between 50 and 100

  Scenario: Cover letter requires a vacancy description
    When I apply the CV preset
    And I fill the company name with "Acme Corp"
    And I try to generate a cover letter
    Then I see a vacancy description required error

  Scenario: Cover letter requires a non-empty CV
    When I clear the form
    And I fill the vacancy description with "Senior React developer with Next.js and TypeScript"
    And I fill the company name with "Acme Corp"
    And I try to generate a cover letter
    Then I see a CV content required error
