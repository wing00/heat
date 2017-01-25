from django.conf.urls import include, url
from .views import *

urlpatterns = [
    url('^$', HeatView.as_view()),
]
