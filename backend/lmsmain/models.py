from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    USER_TYPES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Administrator')
    )
    
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPES, 
        default='student',
        verbose_name=_('User Type')
    )
    # profile_picture = models.ImageField(
    #     upload_to='profile_pics/', 
    #     null=True, 
    #     blank=True,
    #     verbose_name=_('Profile Picture')
    # )
    bio = models.TextField(
        max_length=500, 
        blank=True,
        verbose_name=_('Bio')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"