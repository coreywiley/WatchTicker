import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings


class BasicSpider:
    @staticmethod
    def sendErrorEmail(source, function, error):
        # using SendGrid's Python Library
        # https://github.com/sendgrid/sendgrid-python
        sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
        from_email = Email('igugu13@freeuni.edu.ge')
        to_email = Email('igugu13@freeuni.edu.ge')
        subject = 'Watch Ticker Scraper Not Operating Correctly'
        mail_content = Content("text/html", "%s failed during function: %s with error: %s" % (source,function, error))

        mail_client = Mail(from_email, subject, to_email, mail_content)
        sg.client.mail_client.send.post(request_body=mail_client.get())

    def do_testing(self, watch_num=10):
        all_watches = list()
        ind = 0
        for elem in self.getWatches():
            if ind == watch_num:
                break
            ind += 1
            all_watches.append(elem)
        print("\n".join([str(elem) for elem in all_watches]))

        all_watch_details = list()
        for cur_watch in all_watches:
            watch_details = self.getWatchDetails(cur_watch["url"])
            all_watch_details.append(watch_details)
        print("\n".join([str(elem) for elem in all_watch_details]))