# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Setup.destroy_all

Setup.create({ key: "smtp_address", value: "smtp.gmail.com" })
Setup.create({ key: "smtp_port", value: "587" })
Setup.create({ key: "smtp_user_name", value: "email@to_send.from" })
Setup.create({ key: "smtp_password", value: "super-secret" })
Setup.create({ key: "smtp_authentication", value: "plain" })
Setup.create({ key: "project_manager_email", value: "project@manager.org" })
Setup.create({ key: "webmaster_email", value: "web@master.org" })
Setup.create({ key: "exception_recipients", value: "programmer@myemail.com" })
Setup.create({ key: "sender_name", value: "Application Error" })
Setup.create({ key: "subject_prefix", value: "[Collex] " })
Setup.create({ key: "site_name", value: "Collex" })
Setup.create({ key: "site_title", value: "Collex" })
Setup.create({ key: "site_my_collex", value: "MyCollex" })
Setup.create({ key: "site_community_tab", value: "Community" })
Setup.create({ key: "site_community_default_search", value: "Groups" })
Setup.create({ key: "site_default_federation", value: "ESTC" })
Setup.create({ key: "site_about_label_1", value: "What is Collex?" })
Setup.create({ key: "site_about_url_1", value: "/about/what_is.html" })
Setup.create({ key: "site_about_label_2", value: "Peer Review" })
Setup.create({ key: "site_about_url_2", value: "/about/peer_review.html" })
Setup.create({ key: "site_solr_url", value: "http://catalog.estc21.ucr.edu" })
Setup.create({ key: "google_analytics", value: "false" })
Setup.create({ key: "analytics_id", value: "" })
Setup.create({ key: "enable_community_tab", value: "true" })
Setup.create({ key: "enable_search_tab", value: "true" })
Setup.create({ key: "enable_publications_tab", value: "true" })
Setup.create({ key: "enable_classroom_tab", value: "true" })
Setup.create({ key: "enable_news_tab", value: "true" })
Setup.create({ key: "enable_review_tab", value: "true" })

Setup.create({ key: "facet_order_access", value: "0" })
Setup.create({ key: "facet_order_format", value: "1" })
Setup.create({ key: "facet_order_discipline", value: "2" })
Setup.create({ key: "facet_order_genre", value: "3" })
Setup.create({ key: "enable_searchresults_collect", value: "false"})
Setup.create({ key: "enable_searchresults_uncollect", value: "false"})
Setup.create({ key: "enable_searchresults_discuss", value: "false"})
Setup.create({ key: "enable_searchresults_exhibits", value: "false"})
Setup.create({ key: "enable_annotate_button", value: "false"})
Setup.create({ key: "enable_match_button", value: "false"})
Setup.create({ key: "enable_site", value: "false"})