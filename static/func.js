    let contentFilled = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function sentenceSentiment(){
        let teks = document.getElementById("tweet").value;
        const kalimat = { 'kalimat': teks };
        let muncul = document.querySelector('#response');
        muncul.style.display = "none";

        if(contentFilled) {
            muncul.innerHTML = "";
        }

            let divResponse = document.getElementById('response');

            let teksStemmed = document.createElement('div');
            teksStemmed.setAttribute('id', 'kata-awal');
            teksStemmed.innerHTML = "Kalimat setelah melalui <i>stemmer</i>: ";
            let stemmedString = document.createElement('h4');
            stemmedString.setAttribute('id', 'stemmedString');

            let divCircleWrap = document.createElement('div');
            divCircleWrap.className = 'circle-wrap';
            let divCircle = document.createElement('div');
            divCircle.className = 'circle';

            let divMaskFull = document.createElement('div');
            divMaskFull.className = 'mask full';
            let divMaskHalf = document.createElement('div');
            divMaskHalf.className = 'mask half';
            let divFill1 = document.createElement('div');
            divFill1.className = 'fill';
            let divFill2 = document.createElement('div');
            divFill2.className = 'fill';

            let divInsideCircle = document.createElement('div');
            divInsideCircle.className = 'inside-circle';
            divInsideCircle.innerHTML = "<br>";

            let spanSentTitle = document.createElement('div');
            spanSentTitle.className = 'text';
            spanSentTitle.setAttribute('id', 'persentase');
            let spanSent = document.createElement('div');
            spanSent.className = 'text';
            spanSent.setAttribute('id', 'sentimen');

            divInsideCircle.append(spanSentTitle, spanSent);
            divMaskHalf.append(divFill2);
            divMaskFull.append(divFill1);
            divCircle.append(divMaskFull, divMaskHalf, divInsideCircle);
            divCircleWrap.append(divCircle);
            teksStemmed.append(stemmedString);
            divResponse.append(teksStemmed, divCircleWrap);

        fetch("/olah",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(kalimat)
            })
        .then(response => response.json())
        .then(function(json){
            let root = document.documentElement;
//            let persen = 0;

            if(json['sentimen'] == 'positive'){
                spanSent.innerHTML = "Positif";
                divFill1.style.backgroundColor = "#005B9A";
                divFill2.style.backgroundColor = "#005B9A";
            } else {
                spanSent.innerHTML = "Negatif";
                divFill1.style.backgroundColor = "#AA0020";
                divFill2.style.backgroundColor = "#AA0020";
            }

            root.style.setProperty('--persentase', 180 + "deg");

            spanSentTitle.innerHTML = "sentimen";

            stemmedString.innerHTML = "";
            for(let x = 0; x < json['kataStemmed'].length; x++){
               stemmedString.innerHTML += json['kataStemmed'][x] + " ";
            }
        });
        contentFilled = true;
        muncul.style.display = "block";
        }

    document.querySelector('#upload').addEventListener('change', event => {
        handleUpload(event);
    });

    async function handleUpload(e){
        let file = e.target.files;
        let formData = new FormData();
        formData.append('file', file[0]);

        let muncul = document.querySelector('#response');
        muncul.style.display = "none";

        let spinner = document.querySelector('#loading-spinner');
        spinner.style.display = "block";

        if(contentFilled) {
            muncul.innerHTML = "";
        }

            fetch('/unggah', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {

                let divResponse = document.getElementById('response');
                divResponse.innerHTML = "<div class='container'><div class='kata-awal'>" +
                                        "<span class='title originalString'>Kalimat Awal</span>" +
                                        "<span class='title stemmedString'>Kalimat Setelah Melalui Stemmer</span>" +
                                        "<span class='title sentiment'>Sentimen</span>" +
                                        "</div></div>";

                for(let x = 0; x < data['sentences'].length; x++){
                    let container = document.createElement('div');
                    container.className = 'container';
                    let teksStemmed = document.createElement('div');
                    teksStemmed.className = 'kata-awal';
                    let originalString = document.createElement('span');
                    originalString.className = 'originalString';
                    let stemmedString = document.createElement('span');
                    stemmedString.className = 'stemmedString';

                    let sentiment = document.createElement('span');
                    sentiment.className = 'sentiment';

                    teksStemmed.append(originalString, stemmedString, sentiment);

                    container.append(teksStemmed);
                    divResponse.append(container);

                    if(data['sentences'][x]['sentimen'] == 'positive'){
                        sentiment.innerHTML = "Positif";
                        sentiment.style.color = "#005B9A";
                    } else {
                        sentiment.innerHTML = "Negatif";
                        sentiment.style.color = "#AA0020";
                    }

                    let root = document.documentElement;

                    stemmedString.innerHTML = "";
                    for(let y = 0; y < data['sentences'][x]['kataStemmed'].length; y++){
                       stemmedString.innerHTML += data['sentences'][x]['kataStemmed'][y] + " ";
                    }
                    for(let z = 0; z < data['sentences'][x]['kataAsli'].length; z++){
                       originalString.innerHTML += data['sentences'][x]['kataAsli'][z];
                    }
                    sleep(100);
                    spinner.style.display = "none";
                    muncul.style.display = "block";
                    console.log(data['sentences'][x]['kataAsli']);
                }
            });
        contentFilled = true;


    }
