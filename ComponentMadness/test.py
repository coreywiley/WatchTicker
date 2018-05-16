import json

testStr = "[{'form': {'redirectLocationHidden': 'http://localhost/tweets/', 'formEndpoint': 'http://localhost/models/modelInstance/home/user/', 'input2Data': 'image', 'input1Data': 'name', 'display1': 'Name', 'input2Display': 'Image Url'}}]"
#testStr = '{"form":"test"}'

print testStr.replace("'",'"')
testStr = testStr.replace("'",'"')
print json.loads(testStr)