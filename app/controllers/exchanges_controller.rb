class ExchangesController < ApplicationController
	def index
		
	end

	def show
		@exchange = Exchange.find(params[:id])
		@home = @exchange.home
    	@markers = [
	      {
	        lat: @home.latitude,
	        lng: @home.longitude,
	        infoWindow: render_to_string(partial: "info_window", locals: { home: @exchange.home })
	      }
	    ]
	end

	def new
		@exchange = Exchange.new
	end

	def create
		home = Home.find(params[:exchange][:home_id])
		@exchange = Exchange.new(exchange_params)
		start_date = params[:exchange][:start_date]
    	end_date = params[:exchange][:end_date]
    	exchange = Exchange.new(home: home, start_date: start_date, end_date: end_date, user: current_user)

    	

    	if exchange.save
    		redirect_to exchange_path(exchange)
    	end
	end

	private

	def exchange_params
    	params.require(:exchange).permit(:user_id, :home_id, :start_date, :end_date)
  	end


end
