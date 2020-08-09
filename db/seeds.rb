# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require_relative 'seeds/users'
require_relative 'seeds/homes'

puts "Removing all exchanges"
Exchange.delete_all
puts "Removing all homes"
Home.delete_all
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

puts "Creating Homes"
HOMES.each_with_index do |home, index|
  new_home = Home.new(home.except(:user, :category))
  new_home.user = User.all[index]
  new_home.category = Category.find_by(name: home[:category])
  new_home.save!
end


