var canvas;
var ctx;
var pix;
var pix2
var pixDefault;
var defaultWidth;
var defaultHeight;
var gray = false;
var resetPicture;
var brightness = 0;
var contrast = 0;


//#Problem: Einige Bilder werden abgeschnitten und nicht in der originalen Größe angezeigt
//#Problem: Seite ist nicht responsive
function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    /* Get Image from local files */
    const reader = new FileReader(); //create new filereader
    const img = new Image(); //create new Image
    const uploadImg = (e) => {
        reader.onload = () => {
            img.onload = () => {
                canvas.width = img.height;
                canvas.height = img.height;
                ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);

                pix = ctx.getImageData(0, 0, canvas.width, canvas.height);
                pix2 = ctx.createImageData(canvas.width, canvas.height);

                //Save the default state
                pixDefault = ctx.getImageData(0, 0, canvas.width, canvas.height);
                defaultWidth = canvas.width;
                defaultHeight = canvas.height;
            };
            img.src = reader.result; // convert image file to base64 string
        };
        reader.readAsDataURL(e.target.files[0]); //return uploaded img
    };

    const hochladen = document.getElementById("hochladen");
    hochladen.addEventListener("change", uploadImg);
}

function download() {
    var imgURL = canvas.toDataURL(); //image as URL
    var link = document.createElement("a"); //html link
    link.href = imgURL;
    link.download = "image.jpg"; //default name of image file
    link.click();
}

/*Reset*/
//#TODO: Histogramm resetten
function reset() {
    //    ctx.putImageData(resetPicture, 0, 0);
    // resetPicture = pix; nur bei init() klappts nichtxD
    document.getElementById("brightness-slider").value = 0;
    document.getElementById("brightness-value").innerHTML = 0;
    document.getElementById("contrast-slider").value = 0;
    document.getElementById("contrast-value").innerHTML = 0;
    gray = false;
    document.getElementById("input-schwellwert").value = 0;
    document.getElementById("red-slider").value = 0;
    document.getElementById("red-value").innerHTML = 0;
    document.getElementById("green-slider").value = 0;
    document.getElementById("green-value").innerHTML = 0;
    document.getElementById("blue-slider").value = 0;
    document.getElementById("blue-value").innerHTML = 0;

    canvas.width = defaultWidth;
    canvas.height = defaultHeight;
    ctx.putImageData(pixDefault, 0, 0);
    pix = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/* Brightness */
function makeBrigther() {
    var brightnessVal = document.getElementById("brightness-slider").value; // get setted brightness attribute on slider
    document.getElementById("brightness-value").innerHTML = brightnessVal; // set new slider value
    console.log("Brightness: " + brightnessVal);

    for (var i = 0; i < pix.data.length; i += 4) {
        pix.data[i] += brightnessVal - brightness;
        pix.data[i + 1] += brightnessVal - brightness;
        pix.data[i + 2] += brightnessVal - brightness;
    }
    brightness = brightnessVal;
    ctx.putImageData(pix, 0, 0);
}

/* Contrast */
function makeContrast() {
    var contrastVal = document.getElementById("contrast-slider").value; // get setted brightness attribute on slider
    document.getElementById("contrast-value").innerHTML = contrastVal; // set new slider value
    console.log("Contrast: " + contrastVal);

    if (contrastVal > 0) {
        for (var i = 0; i < pix.data.length; i += 4) {
            pix.data[i] = pix.data[i] * 2;
            pix.data[i + 1] = pix.data[i + 1] * 2;
            pix.data[i + 2] = pix.data[i + 2] * 2;
            pix.data[i + 3] = pix.data[i + 3] * 2;
        }
    } else {
        for (var i = 0; i < pix.data.length; i += 4) {
            pix.data[i] = pix.data[i] * 0.5;
            pix.data[i + 1] = pix.data[i + 1] * 0.5;
            pix.data[i + 2] = pix.data[i + 2] * 0.5;
            pix.data[i + 3] = pix.data[i + 3] * 0.5;
        }
    }
    ctx.putImageData(pix, 0, 0);
}

/* Grauwertbild */
function makeGray() {
    //Set boolean = true if button was clicked (this bool val is for the function makeSW())
    gray = true;

    for (let i = 0; i < pix.data.length; i += 4) {
        const total = pix.data[i] + pix.data[i + 1] + pix.data[i + 2];
        const averageColorVal = total / 3;
        pix.data[i] = averageColorVal;
        pix.data[i + 1] = averageColorVal;
        pix.data[i + 2] = averageColorVal;
    }
    ctx.putImageData(pix, 0, 0);
}

/* SW Bild mit Schwellwert */
function makeSW(schwellwert) {
    //If image was grayscaled then do...
    if (gray) {
        for (let i = 0; i < pix.data.length; i += 4) {
            if (pix.data[i] < schwellwert) {
                pix.data[i] = 0;
                pix.data[i + 1] = 0;
                pix.data[i + 2] = 0;
            } else {
                pix.data[i] = 255;
                pix.data[i + 1] = 255;
                pix.data[i + 2] = 255;
            }
        }
        ctx.putImageData(pix, 0, 0);
    }
}

/* Farbe Rot anpassen */
function makeRed() {
    var redVal = document.getElementById("red-slider").value; // get setted red attribute on slider
    document.getElementById("red-value").innerHTML = redVal; // set new slider value
    console.log("Red: " + redVal);

    for (let i = 0; i < pix.data.length; i += 4) {
        pix.data[i] = pix.data[i] * 1.5;
    }
    ctx.putImageData(pix, 0, 0);
}

/* Farbe Grün anpassen */
function makeGreen() {
    var greenVal = document.getElementById("green-slider").value; // get setted green attribute on slider
    document.getElementById("green-value").innerHTML = greenVal; // set new slider value
    console.log("Green: " + greenVal);

    for (let i = 0; i < pix.data.length; i += 4) {
        pix.data[i + 1] = pix.data[i + 1] * 1.5;
    }
    ctx.putImageData(pix, 0, 0);
}

/* Farbe Blau anpassen */
function makeBlue() {
    var blueVal = document.getElementById("blue-slider").value; // get setted green attribute on slider
    document.getElementById("blue-value").innerHTML = blueVal; // set new slider value
    console.log("Blue: " + blueVal);

    for (let i = 0; i < pix.data.length; i += 4) {
        pix.data[i + 2] = pix.data[i + 2] * 1.5;
    }
    ctx.putImageData(pix, 0, 0);
}

/* Generate an array with default values: 0 */
function get255Array() {
    var arr = [];
    for (let i = 0; i < 256; i++) {
        arr[i] = 0;
    }
    return arr;
}

function calcFrequency(arr) {
    var freqArr = get255Array();
    var pos = 0;
    var index = 0;

    for (var i = 0; i < arr.length; i++) {
        pos = arr[i]; //Get the value of arr[i] to get the position for the array that saves the frequency of each color-value from 0-255
        freqArr[pos]++; //Count the frequency of each value
    }

    return freqArr;
}

function getMax(arr) {
    var max = 0;
    for (var i = 1; i < arr.length; i++) { //Skip index 0 because 0 is not a color
        if (max < arr[i]) {
            max = arr[i];
        }
    }

    return max;
}

function calcNumbers(arr, max, maxPx) {
    var calcArr = [];
    for (var i = 0; i < arr.length; i++) {
        calcArr[i] = maxPx * (arr[i] / max); //arr[i]/max entspricht Prozentwert/Grundwert um den Prozentsatz zu erhalten
        //maxPx * (arr[i]/max) => Die canvas höhe (max Pixelanzahl) mit dem Prozentsatz multiplizieren, um die umgerechnete Länge des Wertes, angepasst an der max Pixelanzahl, zu erhalten
    }

    return calcArr;
}

function drawHistogramm(ctx, strokeColor, arr, height) {
    ctx.beginPath();
    ctx.strokeStyle = strokeColor; //Stroke color

    //ctx.rect(x-Achse, y-Achse, Breite, Länge);
    for (var i = 0; i < arr.length; i++) {
        ctx.rect(i, height - arr[i], 0, arr[i]); //height - arr[i] to set the strokes at the bottom
    }

    ctx.stroke();
}

/* Histogramm rot */
function makeHistogrammRed() {
    //Step0: Grundgerüst
    const canvasHistogramm = document.getElementById("canvas-histogramm-red");
    const ctxHistogramm = canvasHistogramm.getContext("2d");
    var pixHistogramm = ctxHistogramm.getImageData(0, 0, canvasHistogramm.width, canvasHistogramm.height);
    pix = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Step1: Saving all red values in the image into array redArr[]
    var redArr = [];
    var index = 0;
    for (var i = 0; i < pix.data.length; i += 4) {
        redArr[index++] = pix.data[i];
    }
    console.log("Unsorted: " + redArr);

    //Step2: Berechne die Häufigkeiten jedes rot-Wertes 0-255 in redArr[] und speicher sie in frequencyRedArr[]
    var frequencyRedArr = calcFrequency(redArr);
    console.log("Sorted by frequency: " + frequencyRedArr);

    //Step3: get second max value in frequencyRedArr[] because max value is always 0
    var maxPx = canvasHistogramm.height; //height of canvas
    var max = getMax(frequencyRedArr); //red value with the most frequency
    console.log("2. Max: " + max);

    //Step4: Umrechnung aller Werte in frequencyRedArr[], so dass max in einem Histogramm der größe canvasHistogramm.height (255px) reinpasst. Speicher die neuen Werte in calculatedRedArr[]
    var calculatedRedArr = calcNumbers(frequencyRedArr, max, maxPx);

    //Step5: Drawing histogramm by using rectangle
    drawHistogramm(ctxHistogramm, "#e44f3b", calculatedRedArr, canvasHistogramm.height);
}

/* Histogramm Grün */
function makeHistogrammGreen() {
    const canvasHistogramm = document.getElementById("canvas-histogramm-green");
    const ctxHistogramm = canvasHistogramm.getContext("2d");
    var pixHistogramm = ctxHistogramm.getImageData(0, 0, canvasHistogramm.width, canvasHistogramm.height);
    pix = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Step1
    var greenArr = [];
    var index = 0;
    for (var i = 0; i < pix.data.length; i += 4) {
        greenArr[index++] = pix.data[i + 1];
    }

    //Step2
    var frequencyGreenArr = calcFrequency(greenArr);

    //Step3
    var max = getMax(frequencyGreenArr); //green value with the most frequency
    var maxPx = canvasHistogramm.height; //height of canvas

    //Step4
    var calculatedGreenArr = calcNumbers(frequencyGreenArr, max, maxPx);

    //Step5
    drawHistogramm(ctxHistogramm, "#51c16b", calculatedGreenArr, canvasHistogramm.height);
}

/* Histogramm Blau */
function makeHistogrammBlue() {
    const canvasHistogramm = document.getElementById("canvas-histogramm-blue");
    const ctxHistogramm = canvasHistogramm.getContext("2d");
    var pixHistogramm = ctxHistogramm.getImageData(0, 0, canvasHistogramm.width, canvasHistogramm.height);
    pix = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Step1
    var blueArr = [];
    var index = 0;
    for (var i = 0; i < pix.data.length; i += 4) {
        blueArr[index++] = pix.data[i + 2];
    }

    //Step2
    var frequencyBlueArr = calcFrequency(blueArr);

    //Step3
    var max = getMax(frequencyBlueArr); //blue value with the most frequency
    var maxPx = canvasHistogramm.height; //height of canvas

    //Step4
    var calculatedBlueArr = calcNumbers(frequencyBlueArr, max, maxPx);

    //Step5
    drawHistogramm(ctxHistogramm, "#3136a9", calculatedBlueArr, canvasHistogramm.height);
}

/* Negativbild */
function makeNegative() {
    for (let i = 0; i < pix.data.length; i += 4) {
        pix.data[i] = 255 - pix.data[i];
        pix.data[i + 1] = 255 - pix.data[i + 1];
        pix.data[i + 2] = 255 - pix.data[i + 2];
    }

    ctx.putImageData(pix, 0, 0);
}

/* Rotation im Uhrzeigersinn */
function rotateRight() {
    var h = canvas.height;
    var w = canvas.width;
    pix3 = ctx.createImageData(h, w);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h * 4; j += 4) {
            pix3.data[j + (h * 4 * i)] = pix.data[((h - j / 4) * w * 4) + (i * 4)];
            pix3.data[j + 1 + (h * 4 * i)] = pix.data[((h - j / 4) * w * 4) + (i * 4) + 1];
            pix3.data[j + 2 + (h * 4 * i)] = pix.data[((h - j / 4) * w * 4) + (i * 4) + 2];
            pix3.data[j + 3 + (h * 4 * i)] = pix.data[((h - j / 4) * w * 4) + (i * 4) + 3];
        }
    }
    canvas.height = w;
    canvas.width = h;

    pix = pix3;
    ctx.putImageData(pix, 0, 0);
}

/* Rotation gegen den Uhrzeigersinn */
function rotateLeft() {
    var h = canvas.height;
    var w = canvas.width;
    pix3 = ctx.createImageData(h, w);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h * 4; j += 4) {
            pix3.data[j + (h * 4 * i)] = pix.data[(w * 4 - i * 4) + (w * 4 * (j / 4))];
            pix3.data[j + 1 + (h * 4 * i)] = pix.data[(w * 4 - i * 4) + (w * 4 * (j / 4)) + 1];
            pix3.data[j + 2 + (h * 4 * i)] = pix.data[(w * 4 - i * 4) + (w * 4 * (j / 4)) + 2];
            pix3.data[j + 3 + (h * 4 * i)] = pix.data[(w * 4 - i * 4) + (w * 4 * (j / 4)) + 3];
        }
    }
    canvas.height = w;
    canvas.width = h;

    pix = pix3;
    ctx.putImageData(pix, 0, 0);
}

/* Spiegelung horizontal */
function makeMirrorHorizontal() {
    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width * 4; j += 4) {
            pix2.data[j + (canvas.width * 4 * i)] = pix.data[canvas.width * 4 - 4 - j + (canvas.width * 4 * i)];
            pix2.data[j + 1 + (canvas.width * 4 * i)] = pix.data[canvas.width * 4 - 3 - j + (canvas.width * 4 * i)];
            pix2.data[j + 2 + (canvas.width * 4 * i)] = pix.data[canvas.width * 4 - 2 - j + (canvas.width * 4 * i)];
            pix2.data[j + 3 + (canvas.width * 4 * i)] = pix.data[canvas.width * 4 - 1 - j + (canvas.width * 4 * i)];
        }
    }

    pix = pix2;

    ctx.putImageData(pix, 0, 0);
}

/* Spiegelung vertikal */
function makeMirrorVertical() {
    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width * 4; j += 4) {
            pix2.data[j + (canvas.width * 4 * i)] = pix.data[j + (canvas.width * 4 * (canvas.height - i))];
            pix2.data[j + 1 + (canvas.width * 4 * i)] = pix.data[j + 1 + (canvas.width * 4 * (canvas.height - i))];
            pix2.data[j + 2 + (canvas.width * 4 * i)] = pix.data[j + 2 + (canvas.width * 4 * (canvas.height - i))];
            pix2.data[j + 3 + (canvas.width * 4 * i)] = pix.data[j + 3 + (canvas.width * 4 * (canvas.height - i))];
        }
    }

    pix = pix2;
    
    ctx.putImageData(pix, 0, 0);
}

/* Verkleinern */
function makeSmaller() {
    var w = canvas.width / 2;
    var h = canvas.height / 2;
    var pix3 = ctx.createImageData(w, h);

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w * 4; j += 4) {
            pix3.data[j + (w * 4 * i)] = pix.data[j * 2 + (w * 8 * i)];
            pix3.data[j + 1 + (w * 4 * i)] = pix.data[j * 2 + 1 + (w * 8 * i)];
            pix3.data[j + 2 + (w * 4 * i)] = pix.data[j * 2 + 2 + (w * 8 * i)];
            pix3.data[j + 3 + (w * 4 * i)] = pix.data[j * 2 + 3 + (w * 8 * i)];
        }
    }
    canvas.width = w;
    canvas.height = h;

    pix = pix3;
    ctx.putImageData(pix, 0, 0);
}


/* Vergrößern */
function makeBigger() {
    var w = canvas.width * 2;
    var h = canvas.height * 2;
    var pix3 = ctx.createImageData(w, h);

    for (let i = 0; i < h; i += 2) {
        for (let j = 0; j < w * 4; j += 8) {
            pix3.data[j + (w * 4 * i)] = pix.data[j / 2 + (w * i)];
            pix3.data[j + 1 + (w * 4 * i)] = pix.data[j / 2 + 1 + (w * i)];
            pix3.data[j + 2 + (w * 4 * i)] = pix.data[j / 2 + 2 + (w * i)];
            pix3.data[j + 3 + (w * 4 * i)] = pix.data[j / 2 + 3 + (w * i)];

            pix3.data[j + 4 + (w * 4 * i)] = pix.data[j / 2 + (w * i)];
            pix3.data[j + 5 + (w * 4 * i)] = pix.data[j / 2 + 1 + (w * i)];
            pix3.data[j + 6 + (w * 4 * i)] = pix.data[j / 2 + 2 + (w * i)];
            pix3.data[j + 7 + (w * 4 * i)] = pix.data[j / 2 + 3 + (w * i)];

            pix3.data[j + (w * 4 * (i + 1))] = pix.data[j / 2 + (w * i)];
            pix3.data[j + 1 + (w * 4 * (i + 1))] = pix.data[j / 2 + 1 + (w * i)];
            pix3.data[j + 2 + (w * 4 * (i + 1))] = pix.data[j / 2 + 2 + (w * i)];
            pix3.data[j + 3 + (w * 4 * (i + 1))] = pix.data[j / 2 + 3 + (w * i)];

            pix3.data[j + 4 + (w * 4 * (i + 1))] = pix.data[j / 2 + (w * i)];
            pix3.data[j + 5 + (w * 4 * (i + 1))] = pix.data[j / 2 + 1 + (w * i)];
            pix3.data[j + 6 + (w * 4 * (i + 1))] = pix.data[j / 2 + 2 + (w * i)];
            pix3.data[j + 7 + (w * 4 * (i + 1))] = pix.data[j / 2 + 3 + (w * i)];
        }
    }
    canvas.width = w;
    canvas.height = h;

    pix = pix3;
    ctx.putImageData(pix, 0, 0);
}

function getIndex(x, y) {
    var index = (x + y * canvas.width) * 4;
    return index;
}

// Rauschfilter
//#Problem: Das Bild wird grau
function makeRausch() {
    //ol om or obenlinks obenmitte obenrechts
    //ml mm mr mittelinks mittemitte mitterechts
    //ul um ur untenlinks untenmitte untenrechts
    // =>
    //(x-1, y-1) (x, y-1) (x+1, y-1)
    //(x-1, y) (x, y) (x+1, y)
    //(x-1, y+1) (x, y+1) (x+1, y+1)

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const total = pix.data[getIndex(x - 4, y - 1)] + pix.data[getIndex(x, y - 1)] + pix.data[getIndex(x + 4, y - 1)] +
                pix.data[getIndex(x - 4, y)] + pix.data[getIndex(x, y)] + pix.data[getIndex(x + 4, y)] +
                pix.data[getIndex(x - 4, y + 1)] + pix.data[getIndex(x, y + 1)] + pix.data[getIndex(x + 4, y + 1)];
            const avg = total / 9;

            pix.data[getIndex(x, y)] = avg;
            pix.data[getIndex(x, y) + 1] = avg;
            pix.data[getIndex(x, y) + 2] = avg;
        }
    }

    ctx.putImageData(pix, 0, 0);
}

/* Kantenerkennung */
function showOutlines() {
    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width * 4; j += 4) {
            if ((pix.data[j + (canvas.width * 4 * i)] +
                    pix.data[j + 1 + (canvas.width * 4 * i)] +
                    pix.data[j + 2 + (canvas.width * 4 * i)]) / 3 -
                (pix.data[j + 4 + (canvas.width * 4 * i)] +
                    pix.data[j + 5 + (canvas.width * 4 * i)] +
                    pix.data[j + 6 + (canvas.width * 4 * i)]) / 3 > 5) // Schwellwert für die Kantenerkennung
            {
                pix.data[j + (canvas.width * 4 * i)] = 255;
                pix.data[j + 1 + (canvas.width * 4 * i)] = 255;
                pix.data[j + 2 + (canvas.width * 4 * i)] = 255;
            } else {
                pix.data[j + (canvas.width * 4 * i)] = 0;
                pix.data[j + 1 + (canvas.width * 4 * i)] = 0;
                pix.data[j + 2 + (canvas.width * 4 * i)] = 0;
            }
        }
    }
    ctx.putImageData(pix, 0, 0);
}

window.addEventListener('load', init);
