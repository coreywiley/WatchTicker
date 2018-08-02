from pprint import pprint

from apiclient import discovery
from httplib2 import Http
from oauth2client.service_account import ServiceAccountCredentials
import os

SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'
print (os.getcwd())

creds = ServiceAccountCredentials.from_json_keyfile_name(
    'D:\Rogue\MathAnex\ComponentMadness/home/helpers/client_secret.json', scopes=['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive'])

#creds = ServiceAccountCredentials.from_json_keyfile_name(
#    '/home/jthiesen1/webapps/math_anex/ComponentMadness/home/helpers/client_secret.json', scopes=['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive'])


SHEETS = discovery.build('sheets', 'v4', http=creds.authorize(Http()))

SHEET_ID = '1j7wo8aFjX4iY43PJxukA3RgDGke5MpkYr1WdlLl4B4I'

def get(sheetName):
    rows = SHEETS.spreadsheets().values().get(spreadsheetId=SHEET_ID,
        range=sheetName, fields='values').execute().get('values', [])

    realRows = [[i+1] + rows[i+1] for i in range(len(rows[1:]))]

    return realRows

def put(sheetName, values, row):
    if sheetName == 'Questions':
        range = "%s!A%s:B%s" % (sheetName,row+1,row+1)
    elif sheetName == 'Responses':
        range = "%s!A%s:C%s" % (sheetName, row+1, row+1)
    elif sheetName == 'Grades':
        range = "%s!A%s:G%s" % (sheetName, row+1, row+1)
    elif sheetName == 'Users':
        range = "%s!A%s:E%s" % (sheetName, row+1, row+1)
    print (range)
    SHEETS.spreadsheets().values().update(spreadsheetId=SHEET_ID, range=range,
                                          body={'values': [values]}, valueInputOption="RAW").execute()

def post(sheetName, values):
    SHEETS.spreadsheets().values().append(spreadsheetId=SHEET_ID,
        range=sheetName, body={'values':[values]}, valueInputOption="RAW").execute()
