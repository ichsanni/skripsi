from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
import pickle, re, csv

class LihatSentimen:
    def word_features(self, words):
        words = re.sub(r'(<.+>)|\W', ' ', words)
        factory = StopWordRemoverFactory()
        stopword = factory.create_stop_word_remover()
        factory = StemmerFactory()
        stemmer = factory.create_stemmer()

        stop = stopword.remove(words)
        words = stemmer.stem(stop)

        return dict([(word.lower(), True) for word in words.split()])

    def klasifikasi_kalimat(self, tweet):
        f_class = open("app/data/naivebayes.pickle", 'rb')
        classifier = pickle.load(f_class)
        f_class.close()

        kata = self.word_features(tweet)
        temp = []
        for z in kata:
            temp.append(z)

        klasifikasi = classifier.classify(kata)
        dist = classifier.prob_classify(kata)

        rm_double = []
        fitur = []
        fitur_akhir = []

        with open("app/data/fitur.csv", 'r') as f:
            f_read = csv.reader(f)
            for row in f_read:
                for k in kata:
                    if k == row[0]:
                        temp_fitur = {'kata': k, 'info_sent': row[1] + " : " + row[2], 'skor': row[3]}
                        fitur.append(temp_fitur)
            for f in fitur:
                if f['kata'] not in rm_double:
                    rm_double.append(f['kata'])
                    fitur_akhir.append(f)

        return {'sentimen': klasifikasi,
                'positif': dist.prob('positive') * 100,
                'negatif': dist.prob('negative') * 100,
                'kataAsli': tweet,
                'kataStemmed': temp}

#                'fitur': fitur_akhir
# LihatSentimen("<html> <form action='/nice'>dukung atau tolak OmNibus Law, yang penting kalian jangan rusuh dan bakar halte ya!")