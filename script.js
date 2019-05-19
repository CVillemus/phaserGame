
var dom = {
      loseBox: document.getElementById("loseBox"),
      winBox: document.getElementById("winBox"),

      deadOrigin: document.getElementById("containerDeadOrigin"),
      actualScore: document.getElementById("containerActualScore"),
      bestScore: document.getElementById("containerBestScore"),
      bestScoreMessage: document.getElementById("containerBestScoreMessage"),
      pause: document.getElementById("buttonGamePause"),
      actionBtn: document.querySelectorAll("[data-action-box]"),
      scoreBox: document.getElementById("scoreBox"),
      boxLoader: document.getElementById("boxLoader"),
      // cooldownBox1: document.getElementById("cooldownBox1"),
      // cooldownBox2: document.getElementById("cooldownBox2"),
      slimeCount: document.getElementById("slimeCountContainer"),
      slimePartWon: document.getElementById("slimePartWon"),
      totalSlimePartWon: document.getElementById("totalSlimePartWon"),
      newBestScoreBox: document.getElementById("newBestScoreBox")
}

let isPause = true;
let slimePart = 0;

let scoreBoard;
let scoreValue;

for (let index = 0; index < dom.actionBtn.length; index++) {
      dom.actionBtn[index].addEventListener("click", restartGame)
}
dom.pause.addEventListener('click', togglePause);
function togglePause() {
      if (isPause) {
            mainScene.scene.resume();
            dom.pause.innerHTML = "Pause";
            isPause = false;
      } else {
            mainScene.scene.pause();
            dom.pause.innerHTML = "Play";
            isPause = true;
      }
}



function updateSlimeCount(){
      dom.slimeCount.innerHTML = slimePart;
}

showWinScreen = function(){
      dom.winBox.classList.remove("dn");
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
      dom.newBestScoreBox.classList.remove("dn");
      console.log("goes");
      setTimeout(() => {
            disapearCongratMessage();
      }, 3000);
}


disapearCongratMessage = function disapearCongratMessage(){
      dom.newBestScoreBox.classList.add("dn");
}

function showDeadMenue() {
      dom.loseBox.classList.remove("dn");
      fillDeadMenue();
}

function showWinMenue() {
      dom.winBox.classList.remove("dn");
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



function restartGame() {
      let parentBox = this.closest("[data-type='box']");
      let actionType = this.getAttribute("data-action-box");
      parentBox.classList.add("dn");
      if (actionType == "retry") {
            mainScene.scene.restart();
      } else if (actionType == "play") {
            togglePause();
      }
}
  