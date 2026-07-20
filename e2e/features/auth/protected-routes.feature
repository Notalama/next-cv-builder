@smoke @auth
Feature: Protected dashboard access
  Guests must authenticate before viewing saved CVs.

  @smoke
  Scenario: Guest is sent to login
    Given I am not signed in
    When I visit the dashboard
    Then I am redirected to the login page

  Scenario: Guest cannot open the CV builder
    Given I am not signed in
    When I visit the CV builder
    Then I am redirected to the login page
