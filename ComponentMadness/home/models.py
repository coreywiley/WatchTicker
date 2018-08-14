from django.db import models
import datetime
from user.models import User
# Create your models here.


class Test(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default = "", max_length=200, null = False)
    analyses_per_response = models.IntegerField(default=2)
    completed = models.BooleanField(default=False)
    users = models.ManyToManyField(User,related_name='tests')

    def __str__(self):
        return u"{}".format(self.name)

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    test = models.ForeignKey(Test, null = False, on_delete=models.CASCADE, related_name='questions')
    name = models.TextField(default = "", null = False)
    text = models.TextField(default = "", null = False)
    options = models.CharField(default = "", max_length=200, null = False)

    def __str__(self):
        return u"{}".format(self.name)

    def dict(self):
        return {'name':self.name, 'text':self.text, 'options':self.options, 'test_id':self.test_id,'id':self.id}

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, null = False, on_delete=models.CASCADE, related_name='answers')
    sid = models.IntegerField(default = 0, null = False)
    response = models.TextField(default = "", null = False)
    active_analyses = models.IntegerField(default=0)
    last_completed_analysis = models.DateTimeField(default = datetime.datetime.now)
    completed_analyses = models.IntegerField(default=0)
    analysis_conflict = models.BooleanField(default=False)
    admin_answer =  models.CharField(default = "", max_length=200, null = False)
    admin_comment =  models.TextField(default = "", null = False)

    def dict(self):
        return {'sid':self.sid, 'response':self.response, 'id':self.id, 'question_id':self.question_id, 'admin_answer':self.admin_answer,'admin_comment':self.admin_comment}

class Analysis(models.Model):
    id = models.AutoField(primary_key=True)
    answer = models.ForeignKey(Answer, null = False, on_delete=models.CASCADE, related_name='analyses')
    user = models.ForeignKey(User, null = False, on_delete=models.CASCADE, related_name='analyses')
    timestamp = models.DateTimeField(auto_now_add=True, blank = True)
    score = models.CharField(default = "", max_length=200, null = False)
    conflict_score = models.CharField(default="", max_length=200, null=False)
    comment = models.TextField(default="", null=False)


class Discussion(models.Model):
    id = models.AutoField(primary_key=True)
    answer = models.ForeignKey(Answer, null = False, on_delete=models.CASCADE, related_name='discussions')
    user = models.ForeignKey(User, null = False, on_delete=models.CASCADE, related_name='discussions')
    text = models.TextField(default = "", null = False)

