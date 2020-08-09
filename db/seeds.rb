# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require_relative 'seeds/users'

puts "Removing all users"
User.delete_all
puts "Removing all categories"
Category.delete_all

puts "Creating users"
USERS.each do |user|
  u = User.new(user.except(:avatar))
  if user[:avatar]
    u.avatar.attach(io: File.open(user[:avatar]), filename: user[:avatar], content_type: 'image/jpg')
  end
  u.save!
end

puts "Creating categories"
["House", "Apartment", "Studio", "Duplex"].each do |category|
	Category.create!(name: category)
end