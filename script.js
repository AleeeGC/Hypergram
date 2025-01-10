
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d');
const reader = new FileReader();

const fileHandler = document.getElementById('file-input');

const img = new Image();
let originalImageData = null;

//Handle File Upload
fileHandler.addEventListener('change', (event) => {

    const files = event.target.files[0];
    reader.readAsDataURL(files);

    reader.addEventListener('load', (event) => {
        img.src = String(event.target.result);
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            originalImageData = context.getImageData(0,0,canvas.width,canvas.height);
        }
    })
});


let isUpdating = false;
const brightnessSlider = document.getElementById("brightness");
brightnessSlider.addEventListener("input", (event) => {
    if (!isUpdating)
    {
        isUpdating = true;
        requestAnimationFrame(() => {
            (function() {
                work();
        })();
        })
    }
});

const contrastSlider = document.getElementById("contrast");
contrastSlider.addEventListener("input", () => {
    if (!isUpdating)
    {
        requestAnimationFrame(() => {
            (function() {
                work();
            })();
        })
    }
})

const transparencySlider = document.getElementById("transparent")
transparencySlider.addEventListener("input", () => {
    if (!isUpdating)
    {
        isUpdating = true;
        requestAnimationFrame(() => {
            (function() {
                work();
            })();
        })
    }
});

//Download Canvas Content
const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'edit.png';
    link.click();
});

//Apply Filters
function work() {
    const imageData = context.createImageData(originalImageData.width, originalImageData.height);
    imageData.data.set(originalImageData.data);
    const pixels = imageData.data;

    const brightnessValue = parseInt(brightnessSlider.value)
    const contrastValue = parseInt(contrastSlider.value);
    const transparencyValue = parseFloat(transparencySlider.value)

    const factor = 259*(255+contrastValue)/(255*(259-contrastValue));
    for (let i = 0; i < pixels.length; i += 4)
    {
        pixels[i] = Truncate(factor * (pixels[i] - 128)+128);
        pixels[i+1] = Truncate(factor * (pixels[i+1] - 128)+128);
        pixels[i+2] = Truncate(factor * (pixels[i+2] - 128)+128);

        pixels[i] = pixels[i] + brightnessValue * 0.4;
        pixels[i+1] = pixels[i+1] + brightnessValue * 0.4;
        pixels[i+2] = pixels[i+2] + brightnessValue * 0.4;

        pixels[i+3] = pixels[i+3] * transparencyValue;
    }
    context.putImageData(imageData, 0, 0);
    isUpdating = false;
}

function Truncate(value) {
    if (value > 255) {
        return 255;
    }
    else if (value < 0)
    {
        return 0;
    }
    else
    {
        return value;
    }
}
