
# json.array! @homes do |home|
#  	json.extract! home, :id, :name, :address, :user, :category, :description, :capacity, :activity, :price, :latitude, :longitude, :perks, :average_rating, :home_image
# end
json.homes @homes do |home|
	json.extract! home, :id, :name, :address, :user, :category, :description, :latitude, :longitude, :spec
	
	home_images = []
	home.photos.each do |photo|
		home_images << rails_blob_url(photo)
	end
	json.home_images home_images
end

json.filter @filter
