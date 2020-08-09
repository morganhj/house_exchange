class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one_attached :avatar
  has_one :home
  has_many :exchanges

  def full_name
  	return "#{self.first_name.capitalize} #{self.last_name.capitalize}"
  end
end
