require 'test_helper'

class Api::V1::HomesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_homes_index_url
    assert_response :success
  end

end
