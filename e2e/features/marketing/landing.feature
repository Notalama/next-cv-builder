@marketing
Feature: Public landing page
  Guests can see what a finished CV looks like before creating an account,
  and members can come back to it at any time.

  @smoke
  Scenario: Guest sees the landing page with template previews
    Given I am not signed in
    When I open the home page
    Then I see heading "Build a CV recruiters actually read"
    And I see a preview of the "Classic Sidebar" template
    And I see a preview of the "Minimal" template

  Scenario: Guest opens sign up from the landing header
    Given I am not signed in
    And I open the home page
    When I open sign up from the landing header
    Then I am on the login page with the "Sign Up" tab selected

  Scenario: Guest opens sign in from the landing header
    Given I am not signed in
    And I open the home page
    When I open sign in from the landing header
    Then I am on the login page with the "Sign In" tab selected

  @smoke
  Scenario: Guest starts from the Try now call to action
    Given I am not signed in
    And I open the home page
    When I start from the Try now call to action
    Then I am on the login page with the "Sign Up" tab selected

  Scenario: Guest reaches the landing page from the login page
    Given I am not signed in
    And I visit the login page
    When I follow the brand link
    Then I am on the landing page

  Scenario: Signed-in member can still browse the landing page
    Given I am signed in as a member
    When I open the home page
    Then I am on the landing page
    And the landing header offers a link to the dashboard

  @smoke
  Scenario: Member returns to the landing page from the dashboard
    Given I am signed in as a member
    And I visit the dashboard
    When I follow the brand link
    Then I am on the landing page
