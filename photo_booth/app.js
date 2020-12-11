window.addEventListener("load", cameraStart, false);
const camera = document.querySelector("#camera--view"),
cameraSensor = document.querySelector("#canvas"),
tempSensor = document.querySelector("#temp--canvas"),
constraints = { video: { facingMode: "user" }, audio: false },
cameraNext = document.querySelector("#camera--next"),
cameraTrigger = document.querySelector("#camera--trigger"),
cameraRetrigger = document.querySelector("#camera--retrigger"),
upperCanvas = document.querySelector(".upper-canvas"),
canvasContainer = document.querySelector(".canvas-container"),
menuwrapper = document.querySelector(".menu-wrapper"),
menuwrapper1 = document.querySelector(".menu-wrapper1"),
menuwrapper2 = document.querySelector(".menu-wrapper2"),
downloadButton = document.querySelector("#download"),
uploadImg = document.querySelector("#image--upload"),
selfieText = document.querySelector("#selfie-text"),
next = document.querySelector("#next"),
prev = document.querySelector("#prev");

var HideControls = {
  'tl':true,
  'tr':false,
  'bl':true,
  'br':true,
  'ml':true,
  'mt':true,
  'mr':true,
  'mb':true,
  'mtr':true
};

let width= 320,
height = 240,
streaming = false,
track = null;

//entering into camera page
function cameraPage(){
  window.location="home.html";
}

//Starting the camera and setting width and height of canvas
function cameraStart() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        camera.srcObject = stream;
        camera.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

      camera.addEventListener('canplay', function(ev){
        if (!streaming) {
        
          camera.setAttribute('width', width);
          camera.setAttribute('height', height);
          cameraSensor.setAttribute('width', width);
          cameraSensor.setAttribute('height', height);
          tempSensor.setAttribute('width', width);
          tempSensor.setAttribute('height', height);
          streaming = true;
        }
      }, false);
}

//capturing the image from video and putting it into canvas
function capture(){
    context = tempSensor.getContext("2d");
    cameraSensor.width = width;
    cameraSensor.height = height;
    tempSensor.width = width;
    tempSensor.height = height;
    context.drawImage(camera, 0, 0, width, height);
    image = new Image();
    image.src = tempSensor.toDataURL('image/webp');
    image.onload = function(){
      flip = true;

      goToImage();
    }
}
//uploading image
function uploadImage(event){
  flip = false;
  var img = new Image();
  image = new Image();
  img.src = URL.createObjectURL(event.target.files[0]);
  img.onload = function(){
    context = tempSensor.getContext("2d");
    cameraSensor.width = width;
    cameraSensor.height = height;
    tempSensor.width = width;
    tempSensor.height = height;
    context.drawImage(img, 0, 0, width, height);
    image.src = tempSensor.toDataURL("image/webp");
  }
  image.onload = function(){
    console.log(image.src);
    goToImage();
  }
}

//after getting image
function goToImage(){
  selfieText.innerHTML = "Looking Good";
  console.log(image.src);
  canvas = new fabric.Canvas('canvas');
  initializeFunctions();
  var imgInstance = new fabric.Image(image, {
        left: 0,
        top: 0
        });
        imgInstance.set('selectable',false);
        imgInstance.set('flipX',flip);
        canvas.add(imgInstance);

    var filters = document.getElementsByClassName('item');
    for(let i=0;i<filters.length;i++){
        filters[i].style.backgroundImage = `url(${image.src})`;
        filters[i].style.backgroundSize = "cover";
        filters[i].style.backgroundRepeat = "no-repeat";
        filters[i].style.transform = "scaleX(-1)"
    }
camera.style.display = "none";
cameraSensor.style.display = "block";
cameraRetrigger.style.display = "inline-block";
cameraTrigger.style.display = "none";
cameraNext.style.display = "inline-block";
uploadImg.style.display = "none";
// cameraSensor.classList.add('taken');
var cl = new cloudinary.Cloudinary({cloud_name: "dsvdbwwlw", secure: true});
cl.v2.uploader.upload("dog_couch_orig.jpg", 
  { public_id: "dog_couch",
    background_removal: "cloudinary_ai",
    notification_url: "https://mysite.example.com/hooks" },
  function(error, result){console.log(result);});
}

//Retake
cameraRetrigger.onclick = function(){
  camera.style.display = "block";
  cameraSensor.style.display = "none";
  cameraRetrigger.style.display = "none";
  cameraTrigger.style.display = "block";
  cameraNext.style.display = "none";
  uploadImg.style.display = "block";
  location.reload(false);
}

//goToFilters
function goToFilters(){
  selfieText.innerHTML = "Apply Filters";
  var leftPaddle = document.getElementsByClassName('left-paddle');
  var rightPaddle = document.getElementsByClassName('right-paddle');
  // scroll to left
  var leftPos;
  var scroll = 200;

  // scroll to left
  $(rightPaddle).on('click', function() {
      leftPos = $('.menu').animate({scrollLeft:scroll},800);
      scroll = scroll+200;
  });

  // scroll to right
  $(leftPaddle).on('click', function() {
      $('.menu').animate({scrollLeft:leftPos - leftPos},800);
      scroll = 200;
  });
  menuwrapper.style.display = "block";
  cameraRetrigger.style.display = "none";
  cameraNext.style.display = "none";
  next.style.display = "block";
  prev.style.display = "block";
}

//Applying filters
function changeFilter(filter){
  var img1 = new Image();
      console.log(filter);
      switch(filter){
          case "none":
              context.filter = "none";
              console.log(context.filter);
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              break
          case "crema":
              context.filter = "none";
              context.filter = "sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) hue-rotate(-2deg)";
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              canvas.clear();
              break;
          case "hudson":
              context.filter = "none";
              context.filter = "sepia(.25) contrast(1.2) brightness(1.2) saturate(1.05) hue-rotate(-15deg)"
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              break;
          case "inkwell":
              context.filter = "none";
              context.filter = "brightness(1.25) contrast(.85) grayscale(1)";
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              break;
          case "maven":
              context.filter = "none";
              context.filter = "sepia(.35) contrast(1.05) brightness(1.05) saturate(1.75)";
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              break;
          case "trial":
              context.filter = "none";
              context.filter = "sepia(.5) hue-rotate(-30deg) saturate(1.4)";
              context.drawImage(image,0,0);
              img1.src = tempSensor.toDataURL('image/webp');
              break;
  }
  img1.onload = function(){
      var imgInstance = new fabric.Image(img1, {
          left: 0,
          top: 0
        });
        imgInstance.set('selectable', false);
        imgInstance.set('flipX',flip);
        canvas.add(imgInstance);
  }
}

//goToFrame
function goToFrame(){
  selfieText.innerHTML = "Apply Frames";
  console.log("go to frame");
  var leftPaddle = document.getElementsByClassName('left-paddle1');
  var rightPaddle = document.getElementsByClassName('right-paddle1');
  // scroll to left
  var leftPos;
  var scroll = 200;

  // scroll to left
  $(rightPaddle).on('click', function() {
      leftPos = $('.menu1').animate({scrollLeft:scroll},800);
      scroll = scroll+200;
  });

  // scroll to right
  $(leftPaddle).on('click', function() {
      $('.menu1').animate({scrollLeft:leftPos - leftPos},800);
      scroll = 200;
  });

  menuwrapper.style.display = "none";
  menuwrapper1.style.display = "block";
  // image.src = cameraSensor.toDataURL('image/webp');
  next.setAttribute( "onClick", "goToSticker()" );
  prev.setAttribute( "onClick", "backToFilters()" );
  var img2 = new Image();
  img2.src = "frame-1.png";
  img2.onload = function(){
      frameImage = new fabric.Image(img2, {
          left: 0,
          top: 0
        });
        frameImage.set('selectable',false);
        canvas.add(frameImage);
  }
}

function changeFrame(frame){
  context.filter = "none";
  var img2 = new Image();
    switch(frame){
        case "none":
          img2.src = image.src;
            break;
        case "frame1":
            console.log("ok");
            img2.src = "frames/frame-1.png";
            break;
        case "frame2":
            img2.src = "frames/frame-2.png";
            break;
        case "frame3":
            img2.src = "frames/frame-3.png";
            break;
        case "frame4":
            img2.src = "frames/frame-4.gif";
            break;
        case "frame5":
            img2.src = "frames/frame-5.png";
            break;
        case "frame6":
            img2.src = "frames/frame-6.png";
            break;
    }
    img2.onload = function(){
        if(canvas._objects.length !== 1){
          canvas.remove(canvas._objects[canvas._objects.length-1]);
        }
        if(frame != "none"){
          console.log("not none");
          frameImage = new fabric.Image(img2, {
            left: 0,
            top: 0
          });
          frameImage.set('selectable', false);
          canvas.add(frameImage);
        }
    }
}


function goToSticker(){
  selfieText.innerHTML = "Apply Stickers";
  var leftPaddle = document.getElementsByClassName('left-paddle2');
  var rightPaddle = document.getElementsByClassName('right-paddle2');
  // scroll to left
  var leftPos;
  var scroll = 200;

  // scroll to left
  $(rightPaddle).on('click', function() {
      leftPos = $('.menu2').animate({scrollLeft:scroll},800);
      scroll = scroll+200;
  });

  // scroll to right
  $(leftPaddle).on('click', function() {
      $('.menu2').animate({scrollLeft:leftPos - leftPos},800);
      scroll = 200;
  });
  menuwrapper1.style.display = "none";
  menuwrapper2.style.display = "block";
  next.setAttribute('onClick',"goToDownload()");
  prev.setAttribute( "onClick", "backToFrames()" );
}

function changeSticker(sticker){
  var img2 = new Image();
  img2.src = `./stickers/${sticker+'.png'}`;
  img2.onload = function(){
      var image2 = new fabric.Image(img2, {
          left: 50,
          top: 50
        });
        image2.setControlsVisibility(HideControls);
        canvas.add(image2);
  }
}

//Download

function download(){
    image.src = cameraSensor.toDataURL('image/png');
    cameraSensor.setAttribute('crossOrigin', 'anonymous');
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function(){
      var link = document.createElement('a');
        link.download = "image_PhotoBooth.png";
        link.href = image.src;
        link.click();
    }
}

function goToDownload(){
  selfieText.innerHTML = "Download Photo";
  cameraNext.style.display = "none";
  // downloadButton.style.display = "block";
  menuwrapper2.style.display = "none";
  next.innerHTML = "Download";
  next.setAttribute("onClick","download()");
  prev.setAttribute("onClick","backToStickers()");
}

function initializeFunctions(){
  function addDeleteBtn(x, y){
    $(".deleteBtn").remove(); 
    var btnLeft = x-10;
    var btnTop = y-10;
    var deleteBtn = '<img src="data:image/png;base64,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" class="deleteBtn" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;"/>';
    $(".canvas-container").append(deleteBtn);
  }
  
  canvas.on('object:selected',function(e){
        addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
  });
  
  canvas.on('mouse:down',function(e){
    if(!canvas.getActiveObject())
    {
        $(".deleteBtn").remove(); 
    }
  });
  
  canvas.on('object:modified',function(e){
    addDeleteBtn(e.target.oCoords.tr.x, e.target.oCoords.tr.y);
  });
  
  canvas.on('object:scaling',function(e){
    $(".deleteBtn").remove(); 
  });
  canvas.on('object:moving',function(e){
    $(".deleteBtn").remove(); 
  });
  canvas.on('object:rotating',function(e){
    $(".deleteBtn").remove(); 
  });
  $(document).on('click',".deleteBtn",function(){
    if(canvas.getActiveObject())
    {
        canvas.remove(canvas.getActiveObject());
        $(".deleteBtn").remove();
    }
  });
  
}

//previous button actions
function backToCamera(){
  camera.style.display = "block";
  cameraSensor.style.display = "none";
  cameraRetrigger.style.display = "none";
  cameraTrigger.style.display = "block";
  cameraNext.style.display = "none";
  uploadImg.style.display = "block";
  menuwrapper.style.display = "block";
  location.reload(false);
}

function backToFilters(){
  if(canvas._objects.length !== 1){
    canvas.remove(canvas._objects[canvas._objects.length-1]);
  }
  prev.setAttribute("onClick","backToCamera()");
  next.setAttribute("onClick","goToFrame()");
  menuwrapper1.style.display = "none"
  goToFilters();
}

function backToFrames(){
  while(canvas._objects.length >2){
    canvas.remove(canvas._objects[canvas._objects.length-1]);
  }
  prev.setAttribute("onClick","backToFilters()");
  menuwrapper2.style.display = "none";
  goToFrame();
}

function backToStickers(){
  prev.setAttribute("onClick","backToFrames()");
  next.setAttribute("onClick","goToDownload()");
  next.innerHTML = "Next";
  goToSticker();
}

