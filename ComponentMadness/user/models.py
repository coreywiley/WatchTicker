from django.db import models
from django.utils import timezone
from sorl.thumbnail import ImageField
from django.apps import apps

from django_extensions.db.fields import ModificationDateTimeField
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.mail import EmailMessage
import uuid

class UserManager(BaseUserManager):
    
    def create_user(self, email, password, imageUrl):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        #if not email:
        #    raise ValueError('The given email address must be set')
        #email = ShrinkUserManager.normalize_email(email)
        model = apps.get_model(app_label='user', model_name='user')
        user = model(email=email, is_staff=False, is_active=True,last_login=now, date_joined=now, imageUrl=imageUrl)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        u = self.create_user(email, password, "", **extra_fields)
        u.is_staff = True
        u.is_active = True
        u.save(using=self._db)
        return u

class User(AbstractBaseUser):
    GET_STAFF = True
    POST_STAFF = False
    DELETE_STAFF = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(max_length=120, blank=True, default="")
    last_name = models.CharField(max_length=120, blank=True, default="")
    #company_name = models.CharField(max_length=250, blank=True, default="")
    email = models.EmailField(_('email address'), max_length=254, unique=True, db_index=True)
    type = models.CharField(max_length=7, choices=(('User', 'User'), ('Parent', 'Parent')), default='User')
    imageUrl = models.CharField(max_length=120, blank=True, default="")

    parent = models.ForeignKey('User', related_name='children', blank=True, null=True, on_delete=models.CASCADE)

    is_staff = models.BooleanField(
        _('staff status'), default=False, help_text=_('Designates whether the user can log into this admin site.'))
    is_active = models.BooleanField(
        _('active'), default=True,
        help_text=_('Designates whether this user should be treated as active. Unselect this instead of deleting '
                    'accounts.'))

    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    updated = ModificationDateTimeField()
    #updated = ModificationDateTimeField()
    deleted = models.DateTimeField(_('deleted'), null=True, blank=True)
    
    #picture = ImageField(_('picture'), upload_to='tutor-images/', default='tutor-images/defaultUser.png')
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    slug_field = 'email'
    
    # Only email and password is required to create a user account but this is how you'd require other fields.
    REQUIRED_FIELDS = ['password']
    
    def __unicode__( self ):
        return self.get_full_name()
    
    @property
    def is_superuser(self):
        return self.is_staff



