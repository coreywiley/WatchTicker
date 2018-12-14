import sendgrid
from sendgrid.helpers.mail import *

SENDGRID_API_KEY = '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'

sg = sendgrid.SendGridAPIClient(apikey=SENDGRID_API_KEY)
from_email = Email('joseph@miyakiperformance.com')
to_email = Email('joseph@miyakiperformance.com')
subject = "I've got a weird question for you."
content = Content("text/html", "Testing Testing")

mail = Mail(from_email, subject, to_email, content)
response = sg.client.mail.send.post(request_body=mail.get())