from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_extensions.db.fields import ModificationDateTimeField, CreationDateTimeField
from django.conf import settings

from jsonfield import JSONField
import datetime

from user.models import User
# Create your models here.


class Company(models.Model):
    title = models.CharField(_('title'), max_length=255, default='My Company')

    # Basics
    created = CreationDateTimeField(_('created'), help_text=_('When this project was created.'))
    updated = ModificationDateTimeField(_('updated'))

    def __unicode__(self):
        return unicode(self.title)

    class Meta:
        ordering = ['title']



class Project(models.Model):
    """ The base Project model. """
    company = models.ForeignKey(Company, blank=True, null=True, on_delete=models.CASCADE)

    managers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_managers', blank=True)
    directors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_directors', blank=True)
    field_pros = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_field_pros', blank=True)
    supports = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_supports', blank=True)
    clients = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_clients', blank=True)

    # Basics
    created = CreationDateTimeField(_('created'), help_text=_('When this project was created.'))
    updated = ModificationDateTimeField(_('updated'))

    title = models.CharField(_('title'), max_length=255, default='New project')
    description = models.TextField(_('Description'), help_text=_(''), blank=True)

    public = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)


    def __unicode__(self):
        return unicode(self.title)

    class Meta:
        ordering = ['title']

    def has_permission(self, user):
        if user and user.is_authenticated() and user in self.all_user_list():
            return True
        else:
            return False



class ProjectForm(models.Model):
    project = models.ForeignKey(Project, related_name='forms', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    title = models.CharField(_('Title'), max_length=200, default='New Form')

    emailUsers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='form_emails', blank=True)

    created = CreationDateTimeField(_('created'), help_text=_('When this form was created.'))
    updated = ModificationDateTimeField(_('updated'))

    completed = models.BooleanField(default=False)
    completedDate = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return "%s : %s" % (self.title, self.project)



FORMTYPENAMES = ((0, 'Radio'),
                 (1, 'Checkbox'),
                 (2, 'Text Input'),
                 (3, 'Paragraph Input'),
                 (4, 'Text Only'),
                 (5, 'Embedded'),
                 (6, 'Image'),)

class FormElement(models.Model):
    form = models.ForeignKey(ProjectForm, on_delete=models.CASCADE)
    parent = models.ForeignKey('FormElement', null=True, blank=True, on_delete=models.CASCADE)

    type = models.IntegerField(default=0, choices=FORMTYPENAMES)
    order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    required = models.BooleanField(default=False, help_text='Make the element required when completing the form.')

    pretext = models.TextField(_('Pretext'), help_text=_(''), blank=True)
    posttext = models.TextField(_('Posttext'), help_text=_(''), blank=True)

    data = JSONField()

    display = models.CharField(default='', max_length=100, blank=True, null=True)
    style = models.CharField(default='', max_length=300, blank=True, null=True)



class FormSubmission(models.Model):
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE)
    form = models.ForeignKey(ProjectForm, on_delete=models.CASCADE)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('initiator'),
                              help_text=_('Submission owner'), null=True, blank=True, on_delete=models.CASCADE)

    created = CreationDateTimeField(_('created'), help_text=_('When this submission was created.'))
    updated = ModificationDateTimeField(_('updated'))
    # Represents the last time the submission was touched in UNIX integer format
    timestamp = models.BigIntegerField(default=0)
    # This flag denotes the last time the user actually hit the submit button
    completed = models.BooleanField(default=False)
    completedDate = models.DateTimeField(blank=True, null=True)

    answers = JSONField(null=True, blank=True, default={})
    jsonData = JSONField(null=True, blank=True, default={})

    archived = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created']

    def __unicode__(self):
        return "%s : %s" % (self.form, self.owner)

    def has_permission(self, user):
        if self.project:
            user_list = self.project.all_user_list()
        else:
            user_list = self.form.project.all_user_list()

        if user and user.is_authenticated() and user in user_list:
            return True
        else:
            return False



class FormEvent(models.Model):
    form = models.ForeignKey(ProjectForm, on_delete=models.CASCADE)
    submission = models.ForeignKey(FormSubmission, blank=True, null=True, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('initiator'),
                              help_text=_('Event owner'), null=True, blank=True, on_delete=models.CASCADE)

    element = models.ForeignKey(FormElement, blank=True, null=True, on_delete=models.CASCADE)

    created = CreationDateTimeField(_('created'), help_text=_('When this project was created.'))
    updated = ModificationDateTimeField(_('updated'))
    timestamp = models.BigIntegerField(blank=True, null=True)

    answers = JSONField(null=True, blank=True)

    def __unicode__(self):
        return "%s : %s : %s" % (self.form, self.owner, self.answers.get('name', 'NONE'))
