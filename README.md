# Features Heatmap

- Django App for features heatmap
- Generates coefficients (weights) from sci-kit learn model and then visualizes with d3.js 


## Getting Started

- Making the coefficient data

        pip install -r requirements.txt
        python features.py

- Serving with django
   
   - add to urls.py
   
            url(r'^heat/', include('apps.heat.urls'))
            
   - add to INSTALLED_APPS in settings.py 
   
             'heat'
             
    - make sure static is served
           
## Example

[youngsco.tt/heat](youngsco.tt/heat)
