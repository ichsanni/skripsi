import re, csv

#
# with open('app/data/fitur.txt', 'r') as gisel:
#     for l in gisel:
#         en = re.sub(r'=|:', ',', l)
#         md = re.sub(r'\s', '', en)
#         ct = re.sub(r'True|None', '', md)
#         po = re.sub(r'positi', 'positif', ct)
#         ne = re.sub(r'negati', 'negatif', po)
#         with open('app/data/fitur.csv', 'a+') as miho:
#            miho.write(ne + "\n")

kata = {'omnibus': True, 'law': True, 'omnibuslaw':True, 'jokowi':True}
fitur = []
rm_double = []
fitur_akhir = []
with open("app/data/fitur.csv", 'r') as f:
    f_read = csv.reader(f)
    for row in f_read:
        for k in kata:
            if k == row[0]:
                temp_fitur = {'kata': k, 'info_sent': row[1], 'skor': row[3]}
                fitur.append(temp_fitur)
for f in fitur:
    if f['kata'] not in rm_double:
        print(f['kata'], 'beda')
        rm_double.append(f['kata'])
        fitur_akhir.append(f)

print(rm_double)
print(fitur_akhir)




