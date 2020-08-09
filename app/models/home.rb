class Home < ApplicationRecord
	geocoded_by :address
	after_validation :geocode, if: :will_save_change_to_address?
	belongs_to :user
	belongs_to :category
	belongs_to :spec
	has_many :exchanges
	has_many_attached :photos
	CATEGORIES = Category.all.map{|category| category.name}

	def is_in_mapbox(bounds)
		lng = self.longitude > bounds[:sw_lng] && self.longitude < bounds[:ne_lng]
		lat = self.latitude > bounds[:sw_lat] && self.latitude < bounds[:ne_lat]
		return lng && lat
	end

	def unavailable_dates

      	exchanges.pluck(:start_date, :end_date).map do |range|
        	{ from: range[0], to: range[1] }
    	end
  	end

end
