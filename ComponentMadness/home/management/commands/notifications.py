from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.models import UserSettings, Notifications
import datetime
import requests

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):

        settings = [];
        for setting in UserSettings.objects.all():
            settings.append(setting)

        for notification in Notifications.objects.all():
            print (notification.name)

            variable_date = False
            if notification.date.startswith("{"):
                variable_date = True

            start_date = None
            if not variable_date:
                try:
                    start_date = datetime.datetime.strptime(notification.date, '%m/%d/%Y %I:%M %p')
                except:
                    start_date = datetime.datetime.strptime(notification.date + " 08:30 pm", '%m/%d/%Y %I:%M %p')

            for setting in settings:
                if not start_date:
                    if notification.date == "{birthday}":
                        start_date = datetime.datetime(year=2017,month=12,day=11, hour=20, minute=30)

                time_diff = datetime.datetime.now() + datetime.timedelta(hours=setting.timezone_offset) - start_date
                print ("Time Diff=", time_diff.days, time_diff.seconds/60)

                send_notification = False
                if (time_diff.days - notification.days_after) >= 0:
                    if time_diff.days - notification.days_after == 0 and time_diff.seconds/60 < 30:
                        send_notification = True
                    elif (time_diff.days - notification.days_after) % notification.repeat == 0 and time_diff.seconds/60 < 30:
                        send_notification = True

                if send_notification:
                    notifications_token = setting.notifications_token

                    data = {
                        "to": notifications_token,
                        "sound": "default",
                        "title": notification.title,
                        "body": notification.body,
                        "priority": "high",

                    }
                    r = requests.post('https://exp.host/--/api/v2/push/send', data=data)
                    print(r.status_code)
                    print(r.text)





