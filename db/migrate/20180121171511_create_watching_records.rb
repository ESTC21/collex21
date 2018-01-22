class CreateWatchingRecords < ActiveRecord::Migration
  def change
    create_table :watching_records do |t|
      t.integer :user_id, null: false, index: true
      t.string :uri, null: false, index: true
      t.text :title
      t.timestamps
    end

    add_index :watching_records, [:user_id, :uri], unique: true
  end
end
