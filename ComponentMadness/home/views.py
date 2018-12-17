from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.conf import settings
from django.views.decorators.clickjacking import xframe_options_exempt
import requests
from home.models import UserSettings, Journal, Customize, Answer
from home.helpers.renderPDF import Render
import pdfkit
import os, os.path
import sendgrid
from sendgrid.helpers.mail import *
import base64
import urllib
#from user.views import my_login_required

@xframe_options_exempt
def Index(request, param = "", param2 = "", param3 = "", param4 = "", param5 = "", param6 = ""):
    if request.META['HTTP_HOST'] == "localhost:8000":
        #In development mode this connects to the live React Node server
        html = requests.get("http://localhost:3000").content
        html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://localhost:3000/static/js/bundle.js"')
        return HttpResponse(html)

    return render(request, "index.html", {})

def SendNotification(request):
    headers = {'accept': 'application/json', 'accept-encoding': 'gzip, deflate', 'content-type': 'application/json'}

    for settings in UserSettings.objects.all():
        notifications_token = settings.notifications_token

        data = {
          "to": notifications_token,
          "sound": "default",
          "title":request.POST['title'],
          "body": request.POST['body'],
          "priority":"high",

        }
        r = requests.post('https://exp.host/--/api/v2/push/send', data=data)
        print (r.status_code)
        print (r.text)
    return JsonResponse({'success':'True'})

def ErrorPage(request):
    return JsonResponse({'error':'There was an error on the server. Our team has received an email detailing the error and will get it fixed as soon as possible.'})

def NotFoundHandler(request, exception):
    return JsonResponse({'error':"This page doesn't exist. :O"})

def PermissionDenied(request):
    return JsonResponse({'error':'You do not have permission to view this page.'})

def BadRequest(request):
    return JsonResponse({'error':'Bad Request'})

def sendPDF(request,userId):
    #config = pdfkit.configuration(wkhtmltopdf='C:\Program Files\wkhtmltopdf\\bin\wkhtmltopdf.exe')
    directory = settings.STATIC_ROOT + 'pdfs//'
    num_files = len([name for name in os.listdir(directory) if os.path.isfile(name)])
    file_path = directory + 'out_' + str(num_files) + '.pdf'
    pdfkit.from_url('http://localhost:8000/pdf/' + userId + '/', file_path, configuration=config)

    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    with open(file_path, 'rb') as f:
        data = f.read()

    # Encode contents of file as Base 64
    encoded = base64.b64encode(data).decode()

    """Build attachment"""
    attachment = Attachment()
    attachment.content = encoded
    attachment.type = "application/pdf"
    attachment.filename = "journals.pdf"
    attachment.disposition = "attachment"
    attachment.content_id = "Journals"

    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)

    from_email = Email("jeremy.thiesen1@gmail.com")
    to_email = Email('jeremy.thiesen1@gmail.com')
    content = Content("text/html", "<p>Your Norma Journals</p>")

    mail = Mail(from_email, 'Your Norma Journals', to_email, content)
    mail.add_attachment(attachment)

    try:
        response = sg.client.mail.send.post(request_body=mail.get())
    except urllib.HTTPError as e:
        print(e.read())
        exit()

    return JsonResponse({'success':True})

def PDF(request, userId):
    
    skin_0 = '../../static/images/Customization/default/default.png'
    skin_1 = '../../static/images/Customization/Skin_1/body_1.png'
    skin_2 = '../../static/images/Customization/Skin_2/body_2.png'
    skin_3 = '../../static/images/Customization/Skin_3/body_3.png'
    skin_4 = '../../static/images/Customization/Skin_4/body_4.png'
    skin_5 = '../../static/images/Customization/Skin_5/body_5.png'
    skin_6 = '../../static/images/Customization/Skin_6/body_6.png'    
    skin_7 = '../../static/images/Customization/Skin_7/body_7.png'

    nipple_1 = '../../static/images/Customization/nipple_1.png'
    nipple_2 = '../../static/images/Customization/nipple_2.png'
    nipple_3 = '../../static/images/Customization/nipple_3.png'
    nipple_4 = '../../static/images/Customization/nipple_4.png'
    nipple_5 = '../../static/images/Customization/nipple_5.png'
    nipple_6 = '../../static/images/Customization/nipple_6.png'

    
    skin_0_size_2_left = '../../static/images/Customization/default/small_left.png'
    skin_0_size_2_right = '../../static/images/Customization/default/small_right.png'
    skin_0_size_3_left = '../../static/images/Customization/default/med_left.png'
    skin_0_size_3_right = '../../static/images/Customization/default/med_right.png'
    skin_0_size_4_left = '../../static/images/Customization/default/large_left.png'    
    skin_0_size_4_right = '../../static/images/Customization/default/large_right.png'

    
    skin_1_size_2_left = '../../static/images/Customization/Skin_1/small_left.png'
    skin_1_size_2_right = '../../static/images/Customization/Skin_1/small_right.png'
    skin_1_size_3_left = '../../static/images/Customization/Skin_1/med_left.png'
    skin_1_size_3_right = '../../static/images/Customization/Skin_1/med_right.png'
    skin_1_size_4_left = '../../static/images/Customization/Skin_1/large_left.png'
    skin_1_size_4_right = '../../static/images/Customization/Skin_1/large_right.png'

    skin_2_size_2_left = '../../static/images/Customization/Skin_2/small_left.png'
    skin_2_size_2_right = '../../static/images/Customization/Skin_2/small_right.png'
    skin_2_size_3_left = '../../static/images/Customization/Skin_2/med_left.png'
    skin_2_size_3_right = '../../static/images/Customization/Skin_2/med_right.png'
    skin_2_size_4_left = '../../static/images/Customization/Skin_2/large_left.png'    
    skin_2_size_4_right = '../../static/images/Customization/Skin_2/large_right.png'

    skin_3_size_2_left = '../../static/images/Customization/Skin_3/small_left.png'
    skin_3_size_2_right = '../../static/images/Customization/Skin_3/small_right.png'
    skin_3_size_3_left = '../../static/images/Customization/Skin_3/med_left.png'
    skin_3_size_3_right = '../../static/images/Customization/Skin_3/med_right.png'
    skin_3_size_4_left = '../../static/images/Customization/Skin_3/large_left.png'
    
    skin_3_size_4_right = '../../static/images/Customization/Skin_3/large_right.png'
    skin_4_size_2_left = '../../static/images/Customization/Skin_4/small_left.png'
    skin_4_size_2_right = '../../static/images/Customization/Skin_4/small_right.png'
    skin_4_size_3_left = '../../static/images/Customization/Skin_4/med_left.png'
    skin_4_size_3_right = '../../static/images/Customization/Skin_4/med_right.png'
    skin_4_size_4_left = '../../static/images/Customization/Skin_4/large_left.png'
    skin_4_size_4_right = '../../static/images/Customization/Skin_4/large_right.png'

    
    skin_5_size_2_left = '../../static/images/Customization/Skin_5/small_left.png'
    skin_5_size_2_right = '../../static/images/Customization/Skin_5/small_right.png'
    skin_5_size_3_left = '../../static/images/Customization/Skin_5/med_left.png'
    skin_5_size_3_right = '../../static/images/Customization/Skin_5/med_right.png'
    skin_5_size_4_left = '../../static/images/Customization/Skin_5/large_left.png'    
    skin_5_size_4_right = '../../static/images/Customization/Skin_5/large_right.png'

    skin_6_size_2_left = '../../static/images/Customization/Skin_6/small_left.png'
    skin_6_size_2_right = '../../static/images/Customization/Skin_6/small_right.png'
    skin_6_size_3_left = '../../static/images/Customization/Skin_6/med_left.png'
    skin_6_size_3_right = '../../static/images/Customization/Skin_6/med_right.png'
    skin_6_size_4_left = '../../static/images/Customization/Skin_6/large_left.png'
    skin_6_size_4_right = '../../static/images/Customization/Skin_6/large_right.png'

    
    skin_7_size_2_left = '../../static/images/Customization/Skin_7/small_left.png'
    skin_7_size_2_right = '../../static/images/Customization/Skin_7/small_right.png'
    skin_7_size_3_left = '../../static/images/Customization/Skin_7/med_left.png'
    skin_7_size_3_right = '../../static/images/Customization/Skin_7/med_right.png'
    skin_7_size_4_left = '../../static/images/Customization/Skin_7/large_left.png'
    skin_7_size_4_right = '../../static/images/Customization/Skin_7/large_right.png'

    
    skin_0_scar_left = '../../static/images/Customization/default/scar_left.png'
    skin_0_scar_right = '../../static/images/Customization/default/scar_right.png'
    skin_1_scar_left = '../../static/images/Customization/Skin_1/scar_left.png'
    skin_1_scar_right = '../../static/images/Customization/Skin_1/scar_right.png'
    skin_2_scar_left = '../../static/images/Customization/Skin_2/scar_left.png'
    skin_2_scar_right = '../../static/images/Customization/Skin_2/scar_right.png'
    skin_3_scar_left = '../../static/images/Customization/Skin_3/scar_left.png'
    skin_3_scar_right = '../../static/images/Customization/Skin_3/scar_right.png'
    skin_4_scar_left = '../../static/images/Customization/Skin_4/scar_left.png'
    skin_4_scar_right = '../../static/images/Customization/Skin_4/scar_right.png'
    skin_5_scar_left = '../../static/images/Customization/Skin_5/scar_left.png'
    skin_5_scar_right = '../../static/images/Customization/Skin_5/scar_right.png'
    skin_6_scar_left = '../../static/images/Customization/Skin_6/scar_left.png'
    skin_6_scar_right = '../../static/images/Customization/Skin_6/scar_right.png'
    skin_7_scar_left = '../../static/images/Customization/Skin_7/scar_left.png'
    skin_7_scar_right = '../../static/images/Customization/Skin_7/scar_right.png'

    
    symptom_1_drag = '../../static/images/Customization/Symptoms/1_drag.png'
    symptom_2_drag = '../../static/images/Customization/Symptoms/2_drag.png'
    symptom_3_drag = '../../static/images/Customization/Symptoms/3_drag.png'
    symptom_4_drag = '../../static/images/Customization/Symptoms/4_drag.png'
    symptom_5_drag = '../../static/images/Customization/Symptoms/5_drag.png'
    symptom_6_drag = '../../static/images/Customization/Symptoms/6_drag.png'
    symptom_7_drag = '../../static/images/Customization/Symptoms/7_drag.png'
    symptom_8_drag = '../../static/images/Customization/Symptoms/8_drag.png'
    symptom_9_drag = '../../static/images/Customization/Symptoms/9_drag.png'
    symptom_10_drag = '../../static/images/Customization/Symptoms/10_drag.png'
    symptom_11_drag = '../../static/images/Customization/Symptoms/11_drag.png'
    symptom_12_drag = '../../static/images/Customization/Symptoms/12_drag.png'

    photoDict = {}
    photoDict['skin'] = {
        0: skin_0,
        1: skin_1,
        2: skin_2,
        3: skin_3,
        4: skin_4,
        5: skin_5,
        6: skin_6,
        7: skin_7,
    }

    photoDict['nipple'] = {
        0: None,
        1: nipple_1,
        2: nipple_2,
        3: nipple_3,
        4: nipple_4,
        5: nipple_5,
        6: nipple_6,
    }

    photoDict['size'] = {
        0: {2: [skin_0_size_2_left, skin_0_size_2_right], 3: [skin_0_size_3_left, skin_0_size_3_right],
            4: [skin_0_size_4_left, skin_0_size_4_right]},
        1: {2: [skin_1_size_2_left, skin_1_size_2_right], 3: [skin_1_size_3_left, skin_1_size_3_right],
            4: [skin_1_size_4_left, skin_1_size_4_right]},
        2: {2: [skin_2_size_2_left, skin_2_size_2_right], 3: [skin_2_size_3_left, skin_2_size_3_right],
            4: [skin_2_size_4_left, skin_2_size_4_right]},
        3: {2: [skin_3_size_2_left, skin_3_size_2_right], 3: [skin_3_size_3_left, skin_3_size_3_right],
            4: [skin_3_size_4_left, skin_3_size_4_right]},
        4: {2: [skin_4_size_2_left, skin_4_size_2_right], 3: [skin_4_size_3_left, skin_4_size_3_right],
            4: [skin_4_size_4_left, skin_4_size_4_right]},
        5: {2: [skin_5_size_2_left, skin_5_size_2_right], 3: [skin_5_size_3_left, skin_5_size_3_right],
            4: [skin_5_size_4_left, skin_5_size_4_right]},
        6: {2: [skin_6_size_2_left, skin_6_size_2_right], 3: [skin_6_size_3_left, skin_6_size_3_right],
            4: [skin_6_size_4_left, skin_6_size_4_right]},
        7: {2: [skin_7_size_2_left, skin_7_size_2_right], 3: [skin_7_size_3_left, skin_7_size_3_right],
            4: [skin_7_size_4_left, skin_7_size_4_right]},
    }

    photoDict['masectomy'] = {
        0: [skin_0_scar_left, skin_0_scar_right],
        1: [skin_1_scar_left, skin_1_scar_right],
        2: [skin_2_scar_left, skin_2_scar_right],
        3: [skin_3_scar_left, skin_3_scar_right],
        4: [skin_4_scar_left, skin_4_scar_right],
        5: [skin_5_scar_left, skin_5_scar_right],
        6: [skin_6_scar_left, skin_6_scar_right],
        7: [skin_7_scar_left, skin_7_scar_right],
    }

    symptomDict = {
        'Nipple Crust': symptom_1_drag,
        'Discharge': symptom_2_drag,
        'Texture': symptom_3_drag,
        'Redness or Heat': symptom_4_drag,
        'Pulled in Nipple': symptom_5_drag,
        'Growing Vein': symptom_6_drag,
        'New Shape or Size': symptom_7_drag,
        'Indentation': symptom_8_drag,
        'Thick Mass': symptom_9_drag,
        'Skin Sores': symptom_10_drag,
        'Bump': symptom_11_drag,
        'Hard Lump': symptom_12_drag,
    }

    customization = Customize.objects.filter(user=userId).first()
    journals = Journal.objects.filter(user=userId).prefetch_related('symptoms').order_by('-id')

    size = [None,None]
    if customization.size > 1:
        size = photoDict['size'][customization.skin_color][customization.size]
    custom_options = {'skin_color':photoDict['skin'][customization.skin_color], 'size': size,
                      'nipple_color':photoDict['nipple'][customization.nipple_color], 'masectomy_color': photoDict['masectomy'][customization.masectomy], 'masectomy':customization.masectomy}

    journal_details = []
    x_adj = 0
    y_adj = 0

    for journal in journals:
        journal_symptoms = []
        for symptom in journal.symptoms.all():
            y = int(symptom.y_coord/symptom.screen_height * 470)
            x = int(symptom.x_coord/symptom.screen_width * 250)
            style = "top:" + str(y) + "px;left:" + str(x) + "px;"
            journal_symptoms.append({'style':style, 'symptom_image': symptomDict[symptom.symptom]})

        phone_style = "position:absolute;left:" + str(285*x_adj) + "px;top:" + str(750 + 500*y_adj) + "px;"
        left_nipple_style = "position:absolute;height:10px;width:10px;top:" + str(211) + "px;left:" + str(87) + "px;"
        right_nipple_style = "position:absolute;height:10px;width:10px;top:" + str(211) + "px;left:" + str(147) + "px;"
        left_size_style = "position:absolute;height:55px;width:55px;top:" + str(181) + "px;left:" + str(67) + "px;"
        right_size_style = "position:absolute;height:55px;width:55px;top:" + str(181) + "px;left:" + str(124) + "px;"
        left_masectomy_style = "position:absolute;height:50px;width:50px;top:" + str(181) + "px;left:" + str(67) + "px;"
        right_masectomy_style = "position:absolute;height:50px;width:50px;top:" + str(181) + "px;left:" + str(124) + "px;"

        journal_details.append({'phone_style':phone_style,
                                'date': journal.date.strftime('%m-%d-%Y'),
                                'notes':journal.notes,
                                'symptoms':journal_symptoms,
                                'right_nipple_style':right_nipple_style,
                                'left_nipple_style':left_nipple_style,
                                'right_size_style': right_size_style,
                                'left_size_style': left_size_style,
                                'left_masectomy_style': left_masectomy_style,
                                'right_masectomy_style': right_masectomy_style,
                                })

        x_adj += 1
        if x_adj % 4 == 0:
            x_adj = 0
            y_adj += 1

    answers = Answer.objects.filter(user=userId).prefetch_related('question').order_by('id')

    i = 0
    for answer in answers:
        if i == 0:
            questions = "<tr>"
        questions += "<th>" + answer.question.name + "</th><td>" +  answer.answer + "</td>"
        i += 1
        if i % 3 == 0:
            questions += "</tr><tr>"
    questions += "</tr>"


    params = {'custom_options':custom_options, 'journal_details':journal_details, 'questions':questions}
    return render(request, 'pdf.html', params)