class HomesController < ApplicationController

	before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [:index, :show]

  def new
    @home = Home.new
    @spec = Spec.new(home: @home)
    @home.build_spec

    # authorize @home
  end

  def create
    @home = Home.new(home_params)
    # authorize @home
    category = params[:home][:category][:name]
    spec = params[:home][:spec]
    home_spec = Spec.create!(rooms: spec[:rooms].to_i, 
      area: spec[:area].to_i, 
      bathrooms: spec[:bathrooms].to_i, 
      characteristics: params[:spec][:characteristics])
    @home.category = Category.find_by(name: category)
    @home.spec = home_spec

    @user = current_user
    @home.user = @user
    
    if @home.save
      redirect_to root_path
    else
      render :new
    end
  end

  def index
    @address = params["address"]
    @address = "City" if @address == "" || @address == nil
    @category = params["/homes"].nil? ? "All Categories" : params["/homes"]["category"]
    @filter = { address: @address, category: @category }.to_json
   
    @homes = Home.all
    @homes_geocoded = @homes.geocoded #returns flats with coordinates

    @markers = @homes_geocoded.map do |home|
      {
        lat: home.latitude,
        lng: home.longitude,
        infoWindow: render_to_string(partial: "info_window", locals: { home: home })
      }
    end
  end

  def show
    @home = Home.find(params[:id])
    @exchange = @home.exchanges.build
    @markers = [
      {
        lat: @home.latitude,
        lng: @home.longitude,
        infoWindow: render_to_string(partial: "info_window", locals: { home: @exchange.home })
      }
    ]
  end

  def destroy
    
  end

  def edit
    @home = Home.find(params[:id])
  end

  def update
    @home = Home.find(params[:id])

    category = params[:home][:category][:name]
    spec = params[:home][:spec]
    

    @user = current_user
    @home.user = @user
    
    
    if @home.update(home_params)
      @home.update(category_id: Category.find_by(name: category).id)
      @home.spec.update(rooms: spec[:rooms].to_i, 
        area: spec[:area].to_i, 
        bathrooms: spec[:bathrooms].to_i, 
        characteristics: params[:spec][:characteristics])
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def home_params
    params.require(:home).permit(:user, :name, :address, :category, :published, :description, :capacity, photos: [], 
          spec_attributes: [:rooms, :area, :bathrooms, :characteristics])
  end

  def spec_params
    params.require(:home).require(:spec_attributes).permit(:rooms, :area, :bathrooms, :characteristics)
  end


end
