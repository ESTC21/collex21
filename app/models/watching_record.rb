class WatchingRecord < ActiveRecord::Base
  attr_accessible :uri, :user_id, :title, :library_code

  belongs_to :user

  validates_presence_of :uri
  validates_presence_of :user_id
  validates_uniqueness_of :uri,  scope: [:user_id]

end
