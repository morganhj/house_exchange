class CreateHomes < ActiveRecord::Migration[6.0]
  def change
    create_table :homes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.references :spec, null: false, foreign_key: true
      t.string :address
      t.float :longitude
      t.float :latitude
      t.boolean :published
      t.string :description

      t.timestamps
    end
  end
end
