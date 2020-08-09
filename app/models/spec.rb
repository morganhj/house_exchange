class Spec < ApplicationRecord
	has_one :home
	CHARACTERISTICS = ["Internet", "Parking", "Air Conditioning", "Heating", "Security", "Handicap Friendly"]

	def self.characteristic_icon(characteristic)
    case characteristic
      when "Internet"
        string = 'fas fa-wifi'
      when "Parking"
        string = 'fas fa-parking'
      when "Air Conditioning"
        string = 'fas fa-wind'
      when "Heating"
        string = 'fas fa-fire'
      when "Security"
        string = 'fas fa-user-shield'
      when "Kitchen"
        string = 'fas fa-utensils'
      when "Catering"
        string = 'fas fa-cheese'
      when "Handicap Friendly"
        string = 'fab fa-accessible-icon'
      else
        string = 'fas fa-question'
      end
      return string
  end
end
