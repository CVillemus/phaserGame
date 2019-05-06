
var dom = {
      loseBox: document.getElementById("loseBox"),
      deadOrigin: document.getElementById("containerDeadOrigin"),
      actualScore: document.getElementById("containerActualScore"),
      bestScore: document.getElementById("containerBestScore"),
      bestScoreMessage: document.getElementById("containerBestScoreMessage"),
      pause: document.getElementById("buttonGamePause"),
      retry: document.getElementById("buttonGameRetry"),
      scoreBox: document.getElementById("scoreBox"),
      
      onBoarding: document.getElementById("onBoarding"),
      onBoardingBtnBefore: document.querySelector("#onBoarding .btn--prev"),
}

let isPause = false;

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

function showDeadMenue() {
      dom.loseBox.classList.remove("dn");
      fillDeadMenue();
      dom.retry.addEventListener("click", restartGame);
}

function fillDeadMenue() {
      dom.actualScore.innerHTML = scoreBoard;
      getBestScore();
      dom.bestScore.innerHTML = bestScore;
}

function getBestScore() {
      bestScore = localStorage.getItem('bestScore');
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
      bestScoreMessage.innerHTML = "Nouveau meilleur score !";
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