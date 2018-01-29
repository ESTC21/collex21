class WatchingUsersMailer < ActionMailer::Base
  default from: Setup.return_email()

  def annotation_notification_email(emails, title, link)
    @params = { title: title, link: link }
    mail(to: emails, subject: "Annotation Notification for Watched Records")
  end
end
