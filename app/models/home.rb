class Home < ApplicationRecord
  belongs_to :user
  belongs_to :category
  belongs_to :spec
end
