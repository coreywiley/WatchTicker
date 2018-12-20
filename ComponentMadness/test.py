import json
import sendgrid
from sendgrid.helpers.mail import *

SENDGRID_API_KEY = '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'

sg = sendgrid.SendGridAPIClient(apikey=SENDGRID_API_KEY)
from_email = Email('jeremy.thiesen1@gmail.com')

subject = "I've got a weird question for you"


content = Content("text/html", html)


for email in emails:
    to_email = Email(email)
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())


'''
Scheduler

emails = [
    'dkendall@bold.legal',
    'natty.zola@techstars.com',
    'zach.nies@techstars.com',
    'me@paulnfoley.com',
    'amherman@gmail.com',
    'getchellkate@gmail.com',
    'sam@pana.com',
    'devon@pana.com',
    'christine.lai.21@gmail.com',
]

html = "<p>Hi!</p><p>My friend and I were thinking of making an app to solve the 'communication clusterfuck' of scheduling 3+ people. But him and I weren't sure that was a big problem for people. So, I wanted to reach out and just see if that is something you do a lot in your job. And if so, if you had the same problem as me in just trying to wrangle everyone's schedules and then post back to them a time hoping that they would still be available. Or maybe you have a better way! Either way, I'd love to hear if you are organizing a couple people at once or maybe I can help. Let me know!</p><p>Jeremy</p>"

'''

'''
Insights Web Analytics
emails = [
    'support@spiritual-wear.com',
    'sales@christiancove.com',
    'info@9holer.com﻿',
    'Info@DetoxificationWorks.com',
    'Office@dimejewelry.com',
    'markseveniscompletion@protonmail.com',
    'Sales@TheCandleStation.net',
    'parker.music.center@gmail.com',
    'sales@shade8.com',
]
html = "<p>Hi,</p><p>I got this idea for simplifying e-commerce analytics data after helping out a friend with theirs. It was kind of mind blowing. The shop was about selling emoji leggings and we kind of guessed that the market was more millenial girls, but it turned out all the buyers were a lot older.</p><p>Probably grandparents buying for their grand daughters.</p><p>So, here I am, wondering if I could help out some more e-commerce people. Here are a couple of the reports I produced that helped us figure that out.</p><img src='http://miyakiperformance.com/wp-content/uploads/2018/12/01.-APP-Analytics-pic-1-of-2.png' /><img src='http://miyakiperformance.com/wp-content/uploads/2018/12/01.-APP-Analytics-pic-2-of-2.png' /><p>I was hoping you might be willing to help me out and give me a couple minutes of your time for some feedback. If you are interested, I can send some more info.</p><p>What do you think?</p><p>Jeremy</p>"
'''

'''
emails = [
    'info@soneffs.com',
    'service@importmechanics.com',
    'theairplanerestaurant@gmail.com',
    'info@newmoonbakery.com',
    'ian@rollinsvilleauto.com',
    'info@framormotorsbanchory.co.uk',
    'info@morayfirthmotors.com',
    'craighighlandfm@yahoo.co.uk',
    'info@ekarfarm.org',
    'dave@petroccofarms.com',
]

html = "<p>Hi</p><p>I'm looking to build a portfolio for a little website design company I am starting. I would love to get started by doing some free redesign work for some smaller companies. If you have any interest, I would love to hear back and see if I can help.</p>"

'''
