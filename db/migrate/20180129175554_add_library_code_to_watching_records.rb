class AddLibraryCodeToWatchingRecords < ActiveRecord::Migration
  def change
    add_column :watching_records, :library_code, :string
  end
end
