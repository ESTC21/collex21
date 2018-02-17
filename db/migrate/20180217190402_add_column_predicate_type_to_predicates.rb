class AddColumnPredicateTypeToPredicates < ActiveRecord::Migration
  def change
    add_column :predicates, :predicate_type, :string
  end
end
