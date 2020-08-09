class AddNameToHomes < ActiveRecord::Migration[6.0]
  def change
  	add_column :homes, :name, :string
  end
end
