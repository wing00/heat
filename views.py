from django.shortcuts import render
from django.views.generic import TemplateView


class HeatView(TemplateView):
    template_name = 'heat/heatmap.html'
    title = 'heatmap'



