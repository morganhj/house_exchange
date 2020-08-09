class Home < ApplicationRecord
	geocoded_by :address
	after_validation :geocode, if: :will_save_change_to_address?
	belongs_to :user
	belongs_to :category
	belongs_to :spec
	has_many :exchanges
	has_many_attached :photos
	CATEGORIES = Category.all.map{|category| category.name}
end
