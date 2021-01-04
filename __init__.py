from flask import Flask

fl_app = Flask("skripsi",
               template_folder='app/templates',
               static_folder='app/static')

# Konfigurasi file sentimen
fl_app.config['UPLOAD_FOLDER'] = 'app/data/uploaded_sentiment'
fl_app.config['MAX_CONTENT_PATH'] = 5 * 1024 * 1024

from app import routes

