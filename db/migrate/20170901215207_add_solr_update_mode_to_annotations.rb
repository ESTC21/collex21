class AddSolrUpdateModeToAnnotations < ActiveRecord::Migration
  def change
    add_column :annotations, :solr_update_mode, :string
  end
end
