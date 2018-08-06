from django.db import models

from user.models import User
# Create your models here.


class Test(models.Model):
    name = models.CharField(default = "", max_length=200, null = False)


class Question(models.Model):
    test = models.ForeignKey(Test, null = False, on_delete=models.CASCADE)
    text = models.TextField(default = "", null = False)
    options = models.CharField(default = "", max_length=200, null = False)


class Answer(models.Model):
    question = models.ForeignKey(Question, null = False, on_delete=models.CASCADE)
    sid = models.IntegerField(default = 0, null = False)

    text = models.TextField(default = "", null = False)


class Analysis(models.Model):
    answer = models.ForeignKey(Answer, null = False, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null = False, on_delete=models.CASCADE)

    score = models.CharField(default = "", max_length=200, null = False)



class Comment(models.Model):
    answer = models.ForeignKey(Answer, null = False, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null = False, on_delete=models.CASCADE)

    text = models.TextField(default = "", null = False)

