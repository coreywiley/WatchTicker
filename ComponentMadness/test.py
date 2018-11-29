import os

fileList = []
for subdir, dirs, files in os.walk('D:\Rogue\Food Porn'):
    for file in files:
        #print os.path.join(subdir, file)
        filepath = subdir + os.sep + file
        fileList.append(filepath)

i = 0
for file in fileList:
   newName = str(i) + '_' + file.split('\\')[-2].replace(' ','_') + file[-4:]
   print (newName)
   os.rename(file, 'D:\Rogue\Food Porn\All\\' + newName)
   i += 1