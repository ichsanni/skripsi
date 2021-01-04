from flask import render_template, request
from app import fl_app
from app.lihat_sentimen import LihatSentimen
import os
import time


lihat_sent = LihatSentimen()


@fl_app.route('/')
@fl_app.route('/index')
def index():
    return render_template('index.html')


@fl_app.route('/olah', methods=['POST'])
def process_tweet():
    tweet = request.json
    final = lihat_sent.klasifikasi_kalimat(str(tweet['kalimat']))

    return final


@fl_app.route('/unggah', methods=['POST', 'GET'])
def process_file_upload():
    if request.method == 'GET':
        return "You're not supposed to get through here. Pun intended"
    else:
        file = request.files['file']
        file_name = 'temp' + str(time.strftime("%Y%m%d-%H%M%S", time.gmtime())) + '.txt'
        file_path = os.path.join(fl_app.config['UPLOAD_FOLDER'], file_name)
        file.save(file_path)
        final = []

        with open(file_path, 'r') as f:
            z = f.readlines()
            for x in z:
                split_dot = x.split('.')
                for s in split_dot:
                    if s != '\n':
                        sentimen = lihat_sent.klasifikasi_kalimat(s)
                        final.append(sentimen)
        os.remove(file_path)
        return {'filename': file_name, 'sentences': final}
