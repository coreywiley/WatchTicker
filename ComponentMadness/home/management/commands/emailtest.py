from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        print ('Sending')
        email = EmailMessage('Hello', 'World', 'jeremy@jthiesen1.webfactional.com', to=['jeremy.thiesen1@gmail.com'])
        email.send()
        print ('Sent')
