class Api::V1::HomesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  def index
    @category = params[:category]
    # @capacity = params[:capacity]
    @bounds = {
      ne_lat: params[:ne_lat].to_f,
      sw_lat: params[:sw_lat].to_f,
      ne_lng: params[:ne_lng].to_f,
      sw_lng: params[:sw_lng].to_f
    }
    @filter = {
      category: params[:category],
      bounds: @bounds
    }
    if @category.nil?
      @homes = Home.all
    else
      @homes = Home.all.select do |home| 
        home.is_in_mapbox(@bounds) && (home.category.name == @category || @category == "")
      end
    end
    # @homes = Home.all
    # @homes = policy_scope(home)
  end

end
