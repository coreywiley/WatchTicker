from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from modelWebsite.models import PageGroup, Page
import datetime


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):

        page_groups = PageGroup.objects.using('cm').all()

        for page_group in page_groups:
            temp_group = PageGroup()
            temp_group.id = page_group.id
            temp_group.name = page_group.name
            temp_group.created_at = datetime.datetime.now()

            temp_group.save(using='default')

        pages = Page.objects.using('cm').all()
        for page in pages:
            temp_page = Page()
            temp_page.id = page.id
            temp_page.name = page.name
            temp_page.url = page.url
            temp_page.components = page.components
            temp_page.componentProps = page.componentProps
            temp_page.pagegroup = page.pagegroup

            temp_page.save(using='default')