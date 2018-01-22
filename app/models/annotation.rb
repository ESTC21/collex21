class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :predicate
  attr_accessible :attachment_no, :feedback, :flag, :object_uri, :subject_uri, :solr_update_mode

  after_save :send_email_to_watching_users

  private

  def send_email_to_watching_users
    if self.flag_changed? && self.flag.in?([1, 2])
      watching_records = WatchingRecord.where(uri: self.subject_uri)
      user_ids = watching_records.collect(&:user_id)
      if user_ids.compact.length > 0
        # TODO for institutional user, check for institutional code
        user_emails = User.where(id: user_ids).pluck(:email).compact
        title = watching_records.first.title
        uri = watching_records.first.uri
        WatchingUsersMailer.annotation_notification_email(user_emails, title, uri).deliver
      end
    end
  end
end
