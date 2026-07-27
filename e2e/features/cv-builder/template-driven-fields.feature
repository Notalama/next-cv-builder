@cv-builder
Feature: Template-driven form fields
  The builder form shows only the fields the active preview template consumes,
  and fields a template hides never block saving or lose their values.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Minimal template hides the fields it does not use
    When I create a new CV from the dashboard
    And I switch the preview template to "Minimal"
    Then I see the "Skill Categories" field
    And I do not see the "Technical Principles" field
    And I do not see the "Domains of Experience" field
    And I do not see the "Photo (Optional)" field

  Scenario: Classic Sidebar template hides the fields it does not use
    When I create a new CV from the dashboard
    And I switch the preview template to "Classic Sidebar"
    Then I see the "Technical Principles" field
    And I see the "Domains of Experience" field
    And I see the "Photo (Optional)" field
    And I do not see the "Skill Categories" field

  @smoke
  Scenario: A required field blocks saving while visible but not while hidden
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I switch the preview template to "Classic Sidebar"
    And I clear the "Technical Principles" field
    And I save the CV
    Then I see a validation error
    When I switch the preview template to "Minimal"
    And I save the CV
    Then I see a CV saved confirmation

  Scenario: Values typed into a field survive a template switch
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I switch the preview template to "Classic Sidebar"
    And I set the "Technical Principles" field to "Type safety before cleverness"
    And I switch the preview template to "Minimal"
    And I switch the preview template to "Classic Sidebar"
    Then the "Technical Principles" field has value "Type safety before cleverness"

  Scenario: Selected template is restored when reopening a saved CV
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I set the full name to "Grace Hopper"
    And I switch the preview template to "Classic Sidebar"
    And I save the CV
    Then I see a CV saved confirmation
    When I open the CV titled "Grace Hopper"
    Then the selected preview template is "Classic Sidebar"
    And I see the "Technical Principles" field
    And I do not see the "Skill Categories" field

  Scenario: Classic Sidebar preview renders an education section
    When I create a new CV from the dashboard
    And I apply the CV preset
    And I switch the preview template to "Classic Sidebar"
    Then I see the "Education" section in the preview
