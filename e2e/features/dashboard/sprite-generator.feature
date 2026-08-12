@dashboard
Feature: Sprite Sheet Generator
  Signed-in members can open a client-side PNG sprite sheet tool from the dashboard.

  Background:
    Given I am signed in as a member

  @smoke
  Scenario: Member opens the sprite generator from the dashboard
    When I visit the dashboard
    And I open the sprite sheet generator
    Then I am on the sprite sheet generator page
    And I see a back to dashboard control

  @ui
  Scenario: Member creates a sprite sheet from PNG frames
    When I visit the sprite sheet generator
    And I upload sprite frames "frame-a.png" and "frame-b.png"
    Then I see 2 uploaded sprite frames
    And the create sprite button is enabled
    When I create the sprite sheet
    Then I see the generated sprite sheet result
    And I see a download sprite sheet button

  @ui
  Scenario: Member converts an MP4 into downloadable PNG frames
    When I visit the sprite sheet generator
    Then the convert video button is disabled
    And the download video frames button is disabled
    When I choose the sample video clip
    Then the convert video button is enabled
    When I convert the video to PNG frames
    Then I see video frames ready to download
    And the download video frames button is enabled
    When I download the video frames zip
    Then a video frames zip download starts
