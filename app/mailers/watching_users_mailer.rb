class WatchingUsersMailer < ActionMailer::Base
  default from: Setup.return_email()

  def annotation_notification_email(emails, title, link)
    @title = title
    @link = link

    mail(to: emails, subject: "Annotation Created")
  end
end
