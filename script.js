
var dom = {
      loseBox: document.getElementById("loseBox"),
      deadOrigin: document.getElementById("containerDeadOrigin"),
      actualScore: document.getElementById("containerActualScore"),
      bestScore: document.getElementById("containerBestScore"),
      bestScoreMessage: document.getElementById("containerBestScoreMessage"),
      pause: document.getElementById("buttonGamePause"),
      retry: document.getElementById("buttonGameRetry"),
      scoreBox: document.getElementById("scoreBox"),
      boxLoader: document.getElementById("boxLoader"),
      onBoarding: document.getElementById("onBoarding"),
      onBoardingBtnBefore: document.querySelector("#onBoarding .btn--prev"),
      // cooldownBox1: document.getElementById("cooldownBox1"),
      // cooldownBox2: document.getElementById("cooldownBox2"),
      slimeCount: document.getElementById("slimeCountContainer"),

      slimePartWon: document.getElementById("slimePartWon"),
      totalSlimePartWon: document.getElementById("totalSlimePartWon"),
      newBestScoreBox: document.getElementById("newBestScoreBox")
}

let isPause = false;
let slimePart = 0;

let scoreBoard;
let scoreValue;

dom.pause.addEventListener('click', togglePause);
function togglePause() {
      if (isPause) {
            globaliseThis.scene.resume();
            dom.pause.innerHTML = "Pause";
            isPause = false;
      } else {
            globaliseThis.scene.pause();
            dom.pause.innerHTML = "Play";
            isPause = true;
      }
}



function updateSlimeCount(){
      dom.slimeCount.innerHTML = slimePart;
}



function updateGlobalSlimeCount() {
      slimeStorageCount = localStorage.getItem('slimeStorageCount');
      if (slimeStorageCount == "null") {
            localStorage.setItem('slimeStorageCount', slimePart);
      } else {
            slimeStorageCount = Number(slimeStorageCount);
            slimeStorageCount += slimePart;
            localStorage.setItem('slimeStorageCount', slimeStorageCount);
      }
}

function appearCongratMessage(){
      newBestScoreBox.classList.remove("dn");
      globaliseThis.time.delayedCall(3000, disapearCongratMessage, [], this);
}


function disapearCongratMessage(){
      newBestScoreBox.classList.add("dn");
}

function showDeadMenue() {
      dom.loseBox.classList.remove("dn");
      fillDeadMenue();
      dom.retry.addEventListener("click", restartGame);
}

function fillDeadMenue() {
      updateGlobalSlimeCount();
      dom.actualScore.innerHTML = scoreBoard;
      getBestScore();
      dom.bestScore.innerHTML = bestScore;
      dom.slimePartWon.innerHTML = slimePart;
      dom.totalSlimePartWon.innerHTML = slimeStorageCount;
}

var bestScore = localStorage.getItem('bestScore');

function getBestScore() {
      if (bestScore == "null") {
            localStorage.setItem('bestScore', scoreBoard);
      }
      if (bestScore < scoreBoard) {
            localStorage.setItem('bestScore', scoreBoard);
            bestScore = scoreBoard;
            showNewBestScore();
      }
}

function displayCurrentScore(){
      dom.scoreBox.innerHTML = scoreBoard;
}

function showNewBestScore() {
      dom.bestScoreMessage.innerHTML = "Nouveau meilleur score !";
}


function closeDeadMenue() {
      dom.loseBox.classList.add("dn");
}

function restartGame() {
      globaliseThis.scene.restart();
      closeDeadMenue();
}

dom.onBoardingBtnBefore.addEventListener("click", toggleOnboarding)
function toggleOnboarding() {
      dom.onBoarding.classList.toggle("dn");
}   