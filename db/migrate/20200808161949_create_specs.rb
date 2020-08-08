class CreateSpecs < ActiveRecord::Migration[6.0]
  def change
    create_table :specs do |t|
      t.integer :capacity
      t.integer :bathrooms
      t.integer :area
      t.integer :rooms
      t.string :characteristics

      t.timestamps
    end
  end
end
