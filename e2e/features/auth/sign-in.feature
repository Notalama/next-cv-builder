@auth @ui
Feature: Email sign-in
  Members can access their dashboard with email and password.

  Scenario: Member signs in through the login form
    Given I have registered with email "ui-login@example.com" and password "Password123!"
    And I am not signed in
    When I sign in with email "ui-login@example.com" and password "Password123!"
    Then I am on the dashboard
