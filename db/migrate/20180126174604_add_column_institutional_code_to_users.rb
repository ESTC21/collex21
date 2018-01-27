class AddColumnInstitutionalCodeToUsers < ActiveRecord::Migration
  def change
    Role.where(name: 'Institutional User').first_or_create
    add_column :users, :institutional_code, :string
  end
end
