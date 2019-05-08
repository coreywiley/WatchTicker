from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage

from scrapers.bobsWatches import BobsWatches
from scrapers.crownAndCaliber import CrownAndCaliber
from scrapers.houseOfTime import HouseOfTime
from scrapers.watchBox import WatchBox
from scrapers.weLoveWatches import WeLoveWatches


'''
class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        print ('URL Patterns')
        for url in urlpatterns:
            print (url.__dict__['pattern'])
'''


def sendErrorEmail(source, function):
    pass

watch_websites = {"Bob's Watches":BobsWatches()}


for source in watch_websites:
    instance = watch_websites[source]

    try:
        watches = instance.getWatches()
    except:
        sendErrorEmail(source, 'getWatches')

    for watch in watches:
        #check for watch reference number
        watch_instance = Watch.objects.filter(reference_number=watch['reference_number']).first()
        if watch_instance:
            change = False
            if watch_instance.brand == '' and watch['brand']:
                change = True
                watch_instance.brand = watch['brand']
            if watch_instance.model == '' and watch['model']:
                change = True
                watch_instance.model = watch['model']

            if change:
                watch_instance.save()
        else:
            watch_instance = Watch(reference_number = watch['reference_number'], model = watch['model'], brand = watch['brand'])
            watch_instance.save()

        check = WatchInstance.objects.filter(watch_id=watch_instance.id, source=source, url=watch['url']).first()
        if not check:
            new_instance = WatchInstance(watch=watch_instance, source=source, url=watch['url'])
            new_instance.save()


all_watches = WatchInstance.objects.all()

for watch in all_watches:
    source_instance = watch_websites[watch['source']]

    try:
        source_instance.getWatchDetails(watch['url'])
    except:
        sendErrorEmail(watch['source'], 'getWatchDetails')


    watch.condition = source_instance['condition']
    watch.papers = source_instance['papers']
    watch.box = source_instance['box']
    watch.manual = source_instance['manual']
    watch.image = source_instance['image']
    watch.price = source_instance['price']
    watch.save()

    check = Price.objects.filter(watch_instance_id=watch.id).order_by('-created_at').first()
    if check:
        if check.price != source_instance['price']:
            new_price = Price(watch_instance_id=watch.id, watch_id=watch.watch_id, price=source_instance['price'])
            new_price.save()
    else:
        new_price = Price(watch_instance_id=watch.id, watch_id=watch.watch_id, price=source_instance['price'])
        new_price.save()




