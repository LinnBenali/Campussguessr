/*
    Geoguesser Game Script
    
    The player has to place their guess with a marker on an interactive map showcasing the campus. 
    There will be 5 rounds where the scoring system will be based on length from actual placement 
    with a maximum of 100 points. The distance will be calculated and saved until the last round. 
    At the end, the results will be printed out in a readable way.
    
    Features:
    - Displays a map with photos marked on it.
    - Allows players to guess the location by clicking on the map.
    - Calculates and displays the score based on the accuracy of the guess.
    - Uses a confetti library and a map library.

    Author: Linn Benali and Ruby Ge
    Date: 2024-05-15

    Usage:
    - Run this script on a webpage with appropriate HTML elements (e.g., map container, buttons).
    - Ensure Leaflet library is included in the webpage.

    Dependencies:
    - https://leafletjs.com/
    - confetti-js

*/
let latAnswer = 59.346883;
let lonAnswer = 18.072521;
let rounds = 1;
let totalPoints = 0;
let scoreCurrentRound = 0;
const allUsedPhotos = [];
const coordinateMap = new Map();

let myMap = L.map("map", {
    center: [59.348452, 18.073366],
    zoom: 3,
    minZoom: 14 
});

var mapBounds = L.latLngBounds(
    [59.335055, 18.041040], // South West corner
    [59.357424, 18.107690]  // North East corner
);
myMap.fitBounds(mapBounds);
myMap.setMaxBounds(mapBounds); 

//Changing map layers in mode menu
var isSatlite = false;

var satiliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
});
var defaultLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(myMap);

function changeToDefault(){
  if (!isSatlite){
      return;
  }
  defaultLayer.addTo(myMap);
  satiliteLayer.remove();
  isSatlite = false;
}

function changeToSatilite(){
  if (isSatlite){
      return;
  }
  satiliteLayer.addTo(myMap)
  defaultLayer.remove(); 
  isSatlite = true;
}
//Information about all photos written in JSON
var photos = [
    {
        "name": "photo1.jpg", "latitude":59.347925, "longitude":18.073141
    },
    {
        "name": "photo2.jpg","latitude":59.348321, "longitude":18.073069
    },
    {
        "name": "photo3.jpg", "latitude":59.350163, "longitude":18.066736
    },
    {
        "name": "photo4.jpg", "latitude":59.347694, "longitude":18.073064
    },
    {
        "name": "photo5.jpg", "latitude":59.347955, "longitude":18.072942
    },
    {
        "name": "photo6.jpg", "latitude":59.347076, "longitude":18.071335
    },
    {
        "name": "photo7.jpg", "latitude":59.348104, "longitude":18.074815
    },
    {
        "name": "photo8.jpg", "latitude":59.348059, "longitude":18.074828
    },
    {
        "name": "photo9.jpg", "latitude":59.350208, "longitude":18.069746
    },
    {
        "name": "photo10.jpg", "latitude":59.351034, "longitude":18.069706
    },
    {
        "name": "photo11.jpg", "latitude":59.347765, "longitude":18.070864
    },
    {
        "name": "photo12.jpg", "latitude":59.346671, "longitude":18.072299
    }, 
    {
        "name": "photo13.jpg", "latitude":59.352784, "longitude":18.066720
    },
    {
        "name": "photo14.jpg", "latitude":59.353641, "longitude":18.065418
    },
    {
        "name": "photo15.jpg", "latitude":59.347786, "longitude":18.074057
    },
    {
        "name": "photo16.jpg", "latitude":59.347050, "longitude":18.072760
    },
    {
        "name": "photo17.jpg", "latitude":59.353382, "longitude":18.065060
    },
    {
        "name": "photo18.jpg", "latitude":59.353576, "longitude":18.065330
    },
    {
        "name": "photo19.jpg", "latitude":59.348000, "longitude":18.073459
    }, 
    {
        "name": "photo20.jpg", "latitude":59.350308, "longitude":18.066744
    },
    {
        "name": "photo21.jpg", "latitude":59.350270, "longitude":18.066752
    },
    {
        "name": "photo22.jpg", "latitude":59.348172, "longitude":18.074335
    },
    {
        "name": "photo23.jpg", "latitude":59.347290, "longitude":18.071549
    }, 
    {
        "name": "photo24.jpg", "latitude":59.347185, "longitude":18.072821
    },
    {
        "name": "photo25.jpg", "latitude":59.347533, "longitude":18.075175
    },
    {
        "name": "photo26.jpg", "latitude":59.347569, "longitude":18.075088
    },
    {
        "name": "photo27.jpg", "latitude":59.347644, "longitude":18.075827
    }
];

//Show a starting photo
showPicture(chooseRandomPhoto(photos));

//show starting round
document.getElementById("rounds").textContent = 'Rounds: '+rounds + '/5';


//choose a random photo (with unique ones in a single round) and assign new coordinates
function chooseRandomPhoto(photos){
    let chosenRandomPhotoNr;
    if (allUsedPhotos.length === (Math.floor((photos.length)/8)*8)) {
        //Reset allUsedPhotos array if all photos have been used
        allUsedPhotos.length = 0;
    }
    while(true){
        chosenRandomPhotoNr = Math.floor(Math.random() * (photos.length));
        if(!allUsedPhotos.includes(chosenRandomPhotoNr)){
            break;
        }
    }
    allUsedPhotos.push(chosenRandomPhotoNr);
    let photo = photos[chosenRandomPhotoNr];
    latAnswer = photo.latitude;
    lonAnswer = photo.longitude;
    return photo;
}


//show the picture on website
function showPicture(chosenRandomPhoto){
    document.getElementById("picture").innerHTML = `<img src = "Photos/${chosenRandomPhoto.name}">`;
}

//inrease nr of rounds and points
//and print the rounds like "1/5", where 1 is replaced by actual number
function increasePoints(currentScore){
    totalPoints += currentScore;
    document.getElementById("totalPoints").textContent = "Total: "+totalPoints + '/500';
    // if (rounds === 5){
    //     totalPoints = 0;
    // }
}

function stopPrintTotalPoints(){
    document.getElementById("totalPoints").textContent = "Total: 0/500 ";
}
//inrease rounds
function increaseRounds(){
    if (rounds === 5){
        rounds = 1;
    }else{
        rounds++;
    }
    document.getElementById("rounds").textContent = 'Rounds: ' +rounds + '/5';
}

//creating two custom markers - one for answer and one for guess
var iconOptions = {
    iconUrl: 'Photos/Guess.png',
    iconSize: [40, 65]
}
var iconOptions2 = {
    iconUrl: 'Photos/answerPin.png',
    iconSize: [40, 65]
}

var customIcon = L.icon(iconOptions);
var customAnswerIcon = L.icon(iconOptions2)

var markerOptions = {
    icon: customIcon
}
var markerOptions2 = {
    icon: customAnswerIcon
}

// starting marker
let guess = L.marker([59.348452, 18.072521], markerOptions).addTo(myMap);
let answer = L.marker([latAnswer, lonAnswer], markerOptions2);


//change marker position with mouse and updating map with coordinates
function updateMarkerPosition(event) {
    if (button.textContent != "Next Round"){
        if (!myMap.hasLayer(guess)){
            guess.addTo(myMap)
        }
        let lat = event.latlng.lat;
        let lon = event.latlng.lng;
        coordinateMap.set(rounds, [lat, lon, latAnswer, lonAnswer]);
        guess.setLatLng([lat, lon]);
    }   
}

myMap.on('click', updateMarkerPosition);


//create line when submitting answer
function createLine() {
    let latlngs = [
        guess.getLatLng(), 
        answer.getLatLng()  
    ];
        line = L.polyline(latlngs, {color: 'black', weight: "2", dashArray: '5, 5', dashOffset: '0'}).addTo(myMap);
}

//scoringsystem based on guessed coordinates
function scoringsystem(){
    lengthDiff = distanceInLatAndLon();
    let minusPoint = Math.floor(lengthDiff / 0.0001);
    let score = 100;
    score -= minusPoint;
    if(score < 0){
        score = 0;
    } 
    let outputScore = Math.floor(score)
    document.getElementById('score').textContent = "SCORE: " + outputScore + " /100";
    evaluateScore(outputScore);
    return outputScore;
}

//If the score is good enough, then confetti will pop up
function evaluateScore(score){
    if (score>96){
        confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
            zIndex: 1000
        }); 
    }
}

//calculate the difference in distance from the answer to the guess from lat- and longitude
function distanceInLatAndLon(){
    let lat = guess.getLatLng().lat;
    let lon = guess.getLatLng().lng;
    let latDiff = Math.abs(latAnswer - lat);
    let lonDiff =  Math.abs(lonAnswer - lon);
    let lengthDiff = Math.sqrt((latDiff ** 2) + (lonDiff ** 2));
    return lengthDiff;
}

//calculate the approximate difference in distance from the answer to the guess in metres if under 1 km
function distanceToAnswer(){
    lengthDiff = distanceInLatAndLon();
    //0.00001 is approximately 1.11 m
    lengthDiff = Math.floor(lengthDiff/0.00001);
    if(lengthDiff >= 1000){
        let lengthDiffTemp = lengthDiff/1000;
        lengthDiff = Math.floor(lengthDiffTemp);
        //rounding up
        if(lengthDiffTemp>=lengthDiff + 0.5){lengthDiff++;}
        document.getElementById('distance').textContent = "You were " + lengthDiff + " km from the correct place!"
    } else {
        document.getElementById('distance').textContent = "You were " + lengthDiff + " m from the correct place!"
    }
}

function updateAnswerMarker(lat, lon) {
    if (answer) {
        myMap.removeLayer(answer); // Remove the existing marker
    }
    answer = L.marker([lat, lon], markerOptions2).addTo(myMap); // Create a new marker with updated coordinates
    myMap.removeLayer(answer);
}

function emptyCoordinateMap(){
    coordinateMap.clear();
}

//button function
document.getElementById('button').addEventListener('click', function() {
    if (button.textContent == "Submit Guess" && myMap.hasLayer(guess)){
        answer.addTo(myMap); 
        createLine();
        guess.dragging.disable();
        scoreCurrentRound = scoringsystem();
        increasePoints(scoreCurrentRound); 

        //button style changes
        button.textContent = "Next Round";
        document.getElementById("buttonDiv").style.textAlign = "right";
        document.getElementById("buttonDiv").style.marginRight = "50px";
        
        distanceToAnswer();
    }
    else if (button.textContent == "Next Round") {
        myMap.removeLayer(guess);
        myMap.removeLayer(answer);
        myMap.removeLayer(line);
        if(rounds === 5){
            document.getElementById("summary-page").style.display = "flex";
            document.getElementById('score-Display').textContent = "Score:" + totalPoints + "/500" ;
            totalPoints = 0;
        //fireworks at the end, the following code is from https://www.kirilv.com/canvas-confetti/
        var duration = 15 * 100;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        
        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();
        
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
        
          var particleCount = 50 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
            stopPrintTotalPoints();
            emptyCoordinateMap();
        }
        document.getElementById('score').textContent = "";
        document.getElementById('distance').textContent = "";  
        increaseRounds();
        //choose new random photo
        let chosenRandomPhoto = chooseRandomPhoto(photos);
        //show picture on website
        showPicture(chosenRandomPhoto);
        // marker
        updateAnswerMarker(latAnswer, lonAnswer);


        //button style changes
        button.textContent = "Submit Guess";
        document.getElementById("buttonDiv").style.textAlign = "center";
        document.getElementById("buttonDiv").style.marginRight = "0px";
    }
});


// collapsable menu map modes
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "flex") { // Check for flex display
      content.style.display = "none";
    } else {
      content.style.display = "flex"; // Change to flex display
    }
  });
}

//summary page button
document.getElementById('summary-button').addEventListener('click', function() {
    console.log('Button clicked');
    document.getElementById("summary-page").style.display = "none";
});
