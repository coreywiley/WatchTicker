from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
import datetime

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings
import datetime

from home.models import Watch, Watch_Instance, WatchRequest, HistoricPrice, PriceMove

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):

       watches = Watch.objects.prefetch_related('watch_instances').all()
       #iterate through watches
       for watch in watches:
            #iterate through instances of that watch to get a mean price
            last_week_start = (datetime.datetime.today() - datetime.timedelta(7)).replace(hour=0, minute=0)
            last_week_end = (datetime.datetime.today() - datetime.timedelta(6)).replace(hour=0, minute=0)
            yesterday_morning = (datetime.datetime.today() - datetime.timedelta(1)).replace(hour=0, minute=0)
            this_morning = datetime.datetime.today().replace(hour=0, minute=0)

            watch_instances = watch.watch_instances.all()
            total_price = 0
            total_num = 0
            watch_instance_prices = {}
            for instance in watch_instances:
                total_num += 1
                total_price += instance.price
                watch_instance_prices[instance.id] = {'current_price':instance.price, 'yesterday_price': instance.price, 'last_week_price': instance.price}

                yesterday_price = HistoricPrice.objects.filter(watch_instance=instance, created_at__gte=yesterday_morning).order_by('-created_at').first()
                if yesterday_price:
                    watch_instance_prices[instance.id]['yesterday_price'] = yesterday_price.price

                last_week_price = HistoricPrice.objects.filter(watch_instance=instance,created_at__gte=last_week_start).order_by('-created_at').first()
                if last_week_price:
                    watch_instance_prices[instance.id]['last_week_price'] = last_week_price.price

            if total_num > 0:
                avg_price = total_price/total_num
            else:
                continue

            if avg_price != 0:
                yesterday_total = 0
                last_week_total = 0
                for instance in watch_instance_prices:
                    yesterday_total += watch_instance_prices[instance]['yesterday_price']
                    last_week_total += watch_instance_prices[instance]['last_week_price']

                yesterday_avg = yesterday_total/total_num
                last_week_avg = last_week_total/total_num

                change = yesterday_avg / avg_price
                if change > 1.05 or change < .95:
                    price_move = PriceMove(watch=watch, current_average_price=avg_price, previous_average_price=yesterday_avg)
                    price_move.save()
                else:
                    change = last_week_avg / avg_price
                    if change > 1.05 or change < .95:
                        price_move = PriceMove(watch=watch, current_average_price=avg_price,
                                               previous_average_price=last_week_avg)
                        price_move.save()