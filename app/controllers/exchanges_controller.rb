class ExchangesController < ApplicationController
	def index
		
	end

	def show
		
	end

	def new
		@exchange = Exchange.new
	end

	def create
		home = Home.find(params[:exchange][:home_id])
		@exchange = Exchange.new(exchange_params)
		start_date = params[:exchange][:start_date]
    	end_date = params[:exchange][:end_date]
    	exchange = Exchange.create!(home: home, start_date: start_date, end_date: end_date, status: 'pending', user: current_user)
	end


end
