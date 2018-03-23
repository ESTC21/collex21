class Annotation < ActiveRecord::Base
  belongs_to :user
  belongs_to :predicate
  attr_accessible :attachment_no, :feedback, :flag, :object_uri, :subject_uri, :solr_update_mode

  after_save :send_email_to_watching_users

  def self.autocomplete_search(params)
    term = params[:term]

    url = URI.parse(uri)
    begin
      res = Net::HTTP.start(url.host, url.port) do |http|
        term = '?query=' + term if term.length > 0
        http.get("#{uri}#{term}")
      end
    rescue Exception => e
      msg = e.to_s
    end
    parse_response(JSON.parse(res.body))
  end

  private

  def send_email_to_watching_users
    if self.flag_changed? && self.flag.in?([1, 2])
      watching_records = WatchingRecord.includes(user: :roles).where(uri: self.subject_uri)

      # TODO: uncomment it once records have lib_code
      # watching_records = watching_records.reject{ |record| record.user.institutional_user? && record.user.institutional_code != record.library_code }

      user_ids = watching_records.collect(&:user_id)
      if user_ids.compact.length > 0
        users = User.where(id: user_ids)

        user_emails = users.collect(&:email)
        title = watching_records.first.title
        uri = watching_records.first.uri
        WatchingUsersMailer.annotation_notification_email(user_emails, title, uri).deliver
      end
    end
  end

  def self.uri
    'http://www.viaf.org/viaf/AutoSuggest'
  end

  def self.parse_response(response)
    return [] if response.blank? || response['result'].blank?
    suggestions = response['result'].group_by{|result| result['term'] }
    suggestions.map{|name, results| [name, results.length]}
  end
end
