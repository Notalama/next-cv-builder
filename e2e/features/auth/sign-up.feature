@auth @ui
Feature: Email sign-up
  Members can sign-up with email and password.

  Scenario: Member signs up through the sign-up form
    Given I am not signed in
    And I visit the login page
    And I click on sign-up tab
    When I fill the sign-up form as name "Test Name" and password "Password123!"
    And I click sign-up button
    Then I am on the dashboard
