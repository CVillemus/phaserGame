document.addEventListener('DOMContentLoaded', function(){
      var dom = {
            loseBox: document.getElementById("loseBox"),
            winBox: document.getElementById("winBox"),

            deadOrigin: document.getElementById("containerDeadOrigin"),
            actualScore: document.getElementById("containerActualScore"),

            pause: document.querySelectorAll("[data-action='pause']"),
            actionBtn: document.querySelectorAll("[data-action-box]"),

            // Message meilleur score
            bestScoreMessage: document.querySelector(".page-game__best"),

            

            // gameFrag: document.querySelectorAll(".game-frag"),
            // pauseFrag: document.querySelectorAll(".pause-frag"),

            

            // Liens interne au jeu
            gameFakeLinks: document.querySelectorAll('[data-game-link]'),
            // Argent

            collectedMoney: document.querySelector('[data-fill="parts"]'),
            height: document.querySelector('[data-fill="height"]'),
            totalMoney: document.querySelector('[data-fill="money"]'),
            bestHeight: document.querySelector('[data-fill="maxHeight"]'),
            bestTime: document.querySelector('[data-fill="time"'),
            lessJumps : document.querySelector('[data-fill="lessJump"]'),
            mostCollected : document.querySelector('[data-fill="mostCollected"]'),

            slotPrimary: document.querySelector('[data-skill-slot="primary"]'),
            slotSecondary: document.querySelector('[data-skill-slot="secondary"]'),

            skillSlots: document.querySelectorAll(["data-skill-slot"]), // -> primary secondary -> data-name
            
            itemShop: document.querySelectorAll('[data-item]'),
            shopButtons: document.querySelectorAll('[data-state]'),
      }

      
var bestScore;
var slimeStorageCount;
var bestTime;
var lowJump;

var isSticky;
var isStrenght;
var isBound;
var isJumpy;

var primary;
var secondary;
var bestSlimeCollected;

      for (let index = 0; index < dom.shopButtons.length; index++) {
            dom.shopButtons[index].addEventListener("click", changeSkillState); 
      }

      for (let index = 0; index < dom.gameFakeLinks.length; index++) {
            dom.gameFakeLinks[index].addEventListener("click", changeSlide); 
      }

      // Peut être optimisé 
      function updateSkillsState(){
            getLocalStorage();

            if(isBound){
                  let elBoundy = document.querySelector('[data-skill="bound"]');
                  if (secondary != "bound") {
                        elBoundy.setAttribute("data-state", "equip");
                        elBoundy.innerHTML = "Équiper";
                  } else {
                        elBoundy.setAttribute("data-state", "unequip");
                        elBoundy.innerHTML = "Retirer";
                  }
            }

            if(isJumpy){
                  let elJumpy = document.querySelector('[data-skill="jumpy"]');
                  if (primary != "jumpy") {
                        elJumpy.setAttribute("data-state", "equip");
                        elJumpy.innerHTML = "Équiper";
                  } else {
                        elJumpy.setAttribute("data-state", "unequip");
                        elJumpy.innerHTML = "Retirer";
                  }
            }

            if(isSticky){
                  let elSticky = document.querySelector('[data-skill="sticky"]')
                  if (primary != "sticky") {
                        elSticky.setAttribute("data-state", "equip");
                        elSticky.innerHTML = "Équiper";
                  } else {
                        elSticky.setAttribute("data-state", "unequip");
                        elSticky.innerHTML = "Retirer";
                  }
            }

            if(isStrenght){
                  let elStrenght = document.querySelector('[data-skill="strenght"]');
                  if(secondary != "strenght"){
                        elStrenght.setAttribute("data-state", "equip");
                        elStrenght.innerHTML = "Équiper";
                  }else{
                        elStrenght.setAttribute("data-state", "unequip");
                        elStrenght.innerHTML = "Retirer";   
                  }                  
            }
      }
      
      // Peut être optimisé
      function changeSkillState(){
            let actualState = this.getAttribute("data-state");
            let type = this.getAttribute("data-type");
            let name = this.getAttribute("data-skill");
            let price = this.getAttribute("data-price");


            if(actualState == "equip"){

                  this.setAttribute("data-state", "unequip");
                  this.innerHTML = "Retirer";
                  
                  if(type == "secondary"){
                        if (secondary != "undefined" && secondary != "" && secondary != null && secondary != undefined) {
                              let secSkills = document.querySelectorAll('[data-type="secondary"][data-state="unequip"]'); 
                              if(secSkills.length >= 2){
                                    for (let index = 0; index < secSkills.length; index++) {
                                          if (secSkills[index].getAttribute("data-skill") != name){
                                                secSkills[index].setAttribute("data-state", "equip");
                                                secSkills[index].innerHTML = "Équiper";
                                          }   
                                          
                                    }
                              }
                        }
                        localStorage.setItem('secondary', name);
                  }

                  if (type == "primary") {
                        
                        if (primary != "undefined" && primary != "" && primary != null && primary != undefined) {
                              let primSkills = document.querySelectorAll('[data-type="primary"][data-state="unequip"]');
                              if (primSkills.length >= 2) {
                                    for (let index = 0; index < primSkills.length; index++) {
                                          if (primSkills[index].getAttribute("data-skill") != name) {
                                                primSkills[index].setAttribute("data-state", "equip");
                                                primSkills[index].innerHTML = "Équiper";
                                          }
                                    }
                              }
                        }
                        localStorage.setItem('primary', name); 
                  }
            }else if(actualState == "buy"){

                  if (slimeStorageCount >= price){
                        this.setAttribute("data-state", "equip");   
                        this.innerHTML = "Équiper";

                        slimeStorageCount -= price;
                        localStorage.setItem('slimeStorageCount', slimeStorageCount);                       
                        localStorage.setItem(name, true);
                  }

            }else if(actualState == "unequip"){
                  if (type == "primary") {
                        localStorage.setItem('primary', "");
                  } else if (type == "secondary") {
                        localStorage.setItem('secondary', "");
                  }

                  this.setAttribute("data-state", "equip");
                  this.innerHTML = "Équiper";
            }

            getLocalStorage();
      }


      updateActiveSkills();
      
      function updateActiveSkills(){
            // getLocalStorage();

            // let items = document.querySelectorAll(".page-game__skillbox");
            // for (let index = 0; index < items.length; index++) {
            //       items[index].classList.add("dn"); 
            // }
            
            // if (primary != "") {
            //       if (primary == "strenght") {
            //             document.getElementById("strongy").classList.remove("dn");
            //       } else if (primary == "bound") {
            //             document.getElementById("sideJump").classList.remove("dn");
            //       }
            // }

            // if (secondary != "") {
            //       if (secondary == "sticky") {
            //             document.getElementById("spellSplash").classList.remove("dn");
            //       } else if (secondary == "jumpy") {
            //             document.getElementById("dobJump").classList.remove("dn");
            //       }
            // }      
      }
      
      
      // Place les boites au début du jeux selon le local storage
      // if(isJumpy){
      //       if (secondary != "jumpy") {
      //             document.querySelector('[data-name="jumpy"][data-item="equip"]').classList.remove("dn");
      //       } else {
      //             document.querySelector('[data-name="jumpy"][data-item="unequip"]').classList.remove("dn");
      //       }
      // }else if (isJumpy == null) {
      //       document.querySelector('[data-name="jumpy"][data-item="purchase"]').classList.remove("dn"); 
      // }

      // if(isStrenght){
      //       if (primary != "strenght") {
      //             document.querySelector('[data-name="strenght"][data-item="equip"]').classList.remove("dn");
      //       } else {
      //             document.querySelector('[data-name="strenght"][data-item="unequip"]').classList.remove("dn");
      //       }
      // }else if (isStrenght == null) {
      //       document.querySelector('[data-name="strenght"][data-item="purchase"]').classList.remove("dn"); 
      // }

      // if(isBound){
      //       if (primary != "bound") {
      //             document.querySelector('[data-name="bound"][data-item="equip"]').classList.remove("dn");
      //       } else {
      //             document.querySelector('[data-name="bound"][data-item="unequip"]').classList.remove("dn");
      //       }
      // }else if (isBound == null){
      //       document.querySelector('[data-name="bound"][data-item="purchase"]').classList.remove("dn"); 
      // }

      // if(isSticky){
      //       if(secondary != "sticky"){
      //             document.querySelector('[data-name="sticky"][data-item="equip"]').classList.remove("dn");
      //       }else{
      //             document.querySelector('[data-name="sticky"][data-item="unequip"]').classList.remove("dn");  
      //       }
      // }else if (isSticky == null) {
      //       document.querySelector('[data-name="sticky"][data-item="purchase"]').classList.remove("dn"); 
      // }
      
      // for (let index = 0; index < dom.itemShop.length; index++) {
      //       dom.itemShop[index].addEventListener("click", purchase); 
      // }

      // function purchase() {
      //       let actionItem = this.getAttribute("data-item");
      //       let skillSlot = this.getAttribute("data-skill");
      //       let skillName = this.getAttribute("data-name");
      //       let parent = this.closest(".skills__el");
      //       let childs = parent.querySelectorAll("[data-item]");

      //       console.log(actionItem);
      //       if (actionItem == "equip") {// EQUIP Slot - Name

      //             let grandpa = this.closest(".page-shop__skills");
      //             // let grandpaEquiped = grandpa.querySelectorAll('[data-item="unequip"]');
      //             // let grandpaEquip = grandpa.querySelectorAll('[data-item="equip"]');

      //             // Dégage les double équipés
      //             if (localStorage.getItem(skillSlot, skillName) != "") {
      //                   let els = grandpa.querySelectorAll("[data-skill=" + skillSlot + "]");
      //                   if (skillSlot == "primary" && isStrenght && isBound || skillSlot == "secondary" && isSticky && isJumpy){ 
      //                       killDobble(); 
      //                   }
                        
      //                   function killDobble(){
      //                         for (let index = 0; index < els.length; index++) {
      //                               if (els[index].getAttribute("data-name") != skillName) {

      //                                     els[index].classList.add("dn");
      //                                     let parentOf = els[index].closest(".skills__el");
      //                                     parentOf.querySelector("[data-item='equip']").classList.remove("dn");
      //                               }

      //                         }
      //                   }
                          
      //             }

      //             localStorage.setItem(skillSlot, skillName);
      //             updateActiveSkills(); 

      //             for (let index = 0; index < childs.length; index++) {
      //                   childs[index].classList.remove("dn");
      //                   if (childs[index].getAttribute("data-item") != "unequip"){
      //                         childs[index].classList.add("dn");
      //                   }
      //             }
      //       }else if(actionItem == "purchase"){ // PURCHASE isSkill = true

      //             let price = this.getAttribute("data-price");
      //             slimeStorageCount = Number(slimeStorageCount);
      //             if (slimeStorageCount >= price){
      //                   slimeStorageCount -= price;
      //                   localStorage.setItem('slimeStorageCount', slimeStorageCount);
      //                   reduceSold();
      //                   localStorage.setItem(skillName, 'true');

      //                   for (let index = 0; index < childs.length; index++) {
      //                         childs[index].classList.remove("dn");
      //                         if (childs[index].getAttribute("data-item") != "equip") {
      //                               childs[index].classList.add("dn");
      //                         }
      //                   }
      //             }
      //       } else if (actionItem == "unequip"){ // UNEQUIP Slot - Name

                  
      //             for (let index = 0; index < childs.length; index++) {
      //                   childs[index].classList.remove("dn");
      //                   if (childs[index].getAttribute("data-item") != "equip") {
      //                         childs[index].classList.add("dn");
      //                   }
      //             }
      //             localStorage.setItem(skillSlot, ''); 

      //             updateActiveSkills();      
      //       } 
      //       getLocalStorage(); 
      // }



// function reduceSold(){
//       dom.moneyAmount.innerHTML = "";
//       dom.moneyAmount.innerHTML = localStorage.getItem('slimeStorageCount');
// }


function getLocalStorage(){
      primary = localStorage.getItem("primary");
      secondary = localStorage.getItem("secondary");

      isSticky = localStorage.getItem("sticky");
      isStrenght = localStorage.getItem("strenght");
      isBound = localStorage.getItem("bound");
      isJumpy = localStorage.getItem("jumpy");

      slimeStorageCount = localStorage.getItem('slimeStorageCount'); 
      bestScore = localStorage.getItem('bestScore'); 
      bestTime = localStorage.getItem('bestTime');
      lowJump = localStorage.getItem('lowJump');

      bestSlimeCollected = localStorage.getItem("bestSlimeCollected");

      



      if (slimeStorageCount == null){
            slimeStorageCount = 0;
      }

      if(bestScore == null){
            bestScore = 0;
      }

      if (bestSlimeCollected == null){
            bestSlimeCollected = 0;
      }

      

      fillValues();
}







function fillValues() {
      // Hauteur
      dom.height.innerHTML = "0";
      

      // Parts
      dom.collectedMoney.innerHTML = "0";
  

      // Hauteur max
      dom.bestHeight.innerHTML = bestScore;


      // Argent actuel
      dom.totalMoney.innerHTML = Number(slimeStorageCount);


      // Argent Max en 1 partie
      dom.mostCollected.innerHTML = bestSlimeCollected;
      
      // Chronos
      if (bestTime == null) {
            bestTime = 9999999;
            dom.bestTime.innerHTML = "X";
      }else{
            convertTimeToSeconds();
      }
      

      // Less jumps

      if (lowJump == null || lowJump == "undefined" || lowJump == "null" || lowJump == ""){
            dom.lessJumps.innerHTML = "X";
            lowJump = 9999999;
      }else{
            dom.lessJumps.innerHTML = lowJump;
      }

      


      checkSkills();
}



var screenSize = {
      width: window.innerWidth,
      height: window.innerHeight
}

var center = screenSize.width / 2;


let scoreBoard;
let scoreValue;


var playerConfig = {};
initPlayer();
getLocalStorage();







function checkSkills() {
      if (secondary != "" && secondary != null && secondary != "undefined" && secondary != undefined) {            
            dom.slotPrimary.classList.remove("dn");
            let activeSkillP = dom.slotPrimary.querySelector("span");
            if (secondary == "strenght") {
                  playerConfig.skills.superStrenght = true;
                  activeSkillP.setAttribute("data-name", "strenght");
            } else if (secondary == "bound") {
                  playerConfig.skills.elasticSlime = true;
                  activeSkillP.setAttribute("data-name", "bound");
            }
      } else {
            dom.slotPrimary.classList.add("dn");
      }


      if (primary != "" && primary != null && primary != "undefined" && primary != undefined) {
            dom.slotSecondary.classList.remove("dn");
            let activeSkillS = dom.slotSecondary.querySelector("span");
            if (primary == "sticky") {
                  playerConfig.skills.stickySlime = true;
                  activeSkillS.setAttribute("data-name", "sticky");
            } else if (primary == "jumpy") {
                  playerConfig.skills.dobJump = true;
                  activeSkillS.setAttribute("data-name", "jumpy");
            }
      } else {
            dom.slotSecondary.classList.add("dn");
      }
}

// A REBOSSER








for (let index = 0; index < dom.pause.length; index++) {
      dom.pause[index].addEventListener('click', togglePause);
}




function appearCongratMessage() {
      if(slimePart != 0){
            dom.bestScoreMessage.classList.add("page-game__best--active");

            setTimeout(() => {
                  disapearCongratMessage();
            }, 3000);
      }    
}


disapearCongratMessage = function disapearCongratMessage() {
      dom.bestScoreMessage.classList.remove("page-game__best--active");
}

showWinScreen = function () {
      let direction = document.getElementById("victory");
      let parent = document.getElementById("game");
      
      

      // Hide la section active  
      parent.classList.add("opacity");

      setTimeout(function () {
            parent.classList.add("dn");
            mainScene.scene.stop("Game");
            direction.classList.remove("dn");
      }, 100);
      setTimeout(function () {
            direction.classList.remove("opacity");
      }, 150);
}


const scene = new Phaser.Scene("Game");
scene.preload = preload;
scene.create = create;
scene.update = update;


var config = {
      type: Phaser.CANVAS,
      parent: document.getElementById('gameCanvas'),
      backgroundColor: '#000',
      width: screenSize.width,
      height: screenSize.height,
      
      physics: {
            default: 'arcade',
            arcade: {
                  debug: true,
            }
      },
      scene
};


// Local storage uses
var game = new Phaser.Game(config);
var mainScene;




let isCheat = true;

// Joueur
var isSuspended;
// var isUnderRock;



var lineStr;

// Prises
var priseGroup;
var priseElements;
var priseLastDead;

var obstacleGroup;
var obstacleElements;

// Sounds


var deadSoundProgress;

var isOver;
var isHit;
var isflying = false;
var isTheTop = false;
var isNoMorePrise = false;




const randomWidth = [
      center - 200,
      center - 150,
      center - 100,
      center - 50,
      center,
      center + 50,
      center + 100,
      center + 150,
      center + 200,
]

let isBestScoreBoxDisplayed;
let isWon = false;
var stopGenerate = false

var slimePart = 0;
var jumpCount = 0;
var timer;

var timerInProgress = false;
var flagTimer = false;
var stopTimer = false;

function initGame() {
      timerInProgress = false;
      flagTimer = false;
      stopTimer = false;
      timer = 0;
      if (mainScene.scene != undefined){
            mainScene.scene.start('Game');
      }
      jumpCount = 0;
      stopGenerate = false;
      isWon = false;
      isBestScoreBoxDisplayed = false;
      isTheTop = false;
      isNoMorePrise = false;
      slimePart = 0;
      scoreBoard = 0;
      document.querySelector('[data-skill-slot= "secondary"] span').setAttribute('data-state-skill', "up");
      document.querySelector('[data-skill-slot= "primary"] span').setAttribute('data-state-skill', "up");
      getLocalStorage();
}

function initPlayer() {
      playerConfig = {
            skills: {
                  superStrenght:false,
                  stickySlime:false,
                  elasticSlime:false,
                  dobJump: false,
            }
      };
}

const walls = ['surface_broken', 'surface_caution', 'surface_classic', 'surface_dead', 'surface_paint'];

let highElements;

// Bonus CD
const cooldown = 10;


var borderRight;
var borderLeft;
var hitBorderRight;
var hitBorderLeft;
var borderBot;
var succesTop;
var countHeight = 0;
let surfaceGroup;

function preload() {

      // Loader
      this.load.on('complete', function () {
            mainScene = game.scene.getScene("Game");
            mainScene.scene.stop('Game');
            mainScene.scene.start('Game');
            mainScene.scene.pause('Game');
      });

      
      this.load.atlas('player', 'assets/images/game/animations/basic/prise.png', 'assets/images/game/animations/basic/prise.json')
      this.load.atlas('extend', 'assets/images/game/animations/extend/extend.png', 'assets/images/game/animations/extend/extend.json')
      this.load.atlas('dead', 'assets/images/game/animations/death/dead.png', 'assets/images/game/animations/death/dead.json');
      this.load.atlas('cut', 'assets/images/game/animations/cut/cut.png', 'assets/images/game/animations/cut/cut.json');
      this.load.atlas('prise', 'assets/images/game/animations/prisesplash/splash.png', 'assets/images/game/animations/prisesplash/splash.json');
      
      this.load.image('surface_classic', 'assets/images/game/bocal_classic.png');
      this.load.image('surface_top', 'assets/images/game/bocal_top.png');
      this.load.image('surface_caution', 'assets/images/game/bocal_caution.png');
      this.load.image('surface_dead', 'assets/images/game/bocal_dead.png');
      this.load.image('surface_paint', 'assets/images/game/bocal_paint.png');
      this.load.image('surface_broken', 'assets/images/game/bocal_broken.png');

      this.load.image('topSurface', 'assets/images/game/bocal_topFront.png');
      this.load.image('surface_bottom', 'assets/images/game/bocal_bottom.png');
      this.load.image('background', 'assets/images/game/background.png');
      this.load.image('desk', 'assets/images/game/desk.png');

      // audio
      // this.load.audio('Catch1', ['assets/sound/player' + playerConfig.skin + 'Catch1.ogg', 'assets/sound/player' + playerConfig.skin + 'Catch1.mp3']);
}



function create() {
      

      deadSoundProgress = false;
      isSuspended = true;

      isOver = false;
      isflying = false;

      background = this.add.sprite(center - 1100, screenSize.height, 'background');


      borderRight = this.add.zone(center + 300, screenSize.height, 10, screenSize.height);
      borderLeft = this.add.zone(center - 300, screenSize.height, 10, screenSize.height);
      borderBot = this.add.zone(center, screenSize.height + 200, screenSize.width, 10)


      this.physics.world.enable(borderRight);
      this.physics.world.enable(borderLeft);
      this.physics.world.enable(borderBot);

      borderRight.body.setImmovable(true);
      borderLeft.body.setImmovable(true);
      borderBot.body.setImmovable(true);

      desk = this.add.sprite(center + 200, screenSize.height + 1000, 'desk');

      surfaceGroup = this.add.group();
      surfaceGroup.create(center, screenSize.height - 1145, 'surface_classic').setOrigin(0.5);
      surfaceGroup.create(center, screenSize.height - 2145, 'surface_classic').setOrigin(0.5);
      surfaceGroup.create(center, screenSize.height - 145, 'surface_bottom').setOrigin(0.5);

      highElements = surfaceGroup.getChildren();



      priseGroup = this.physics.add.group();
      for (let i = 70; i < screenSize.height; i += 100) {
            let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
            let randomHeight = screenSize.height - i - 50; // var randomHeight = Phaser.Math.Between((screenSize.height - i) - 50, (screenSize.height - i) + 50);
            priseGroup.create(randomWidth[pickWidth], randomHeight, 'prise', 'prisesplash_00000.png').setScale(0.7).setOffset(30, 30).setCircle(40); //.setScale(Phaser.Math.Between(700, 1000) / 1000).refreshBody();  
      }
      priseElements = priseGroup.getChildren();

      
      this.player = this.physics.add.sprite(center, screenSize.height, 'player', 'basic_00000.png').setCircle(55).setOffset(35).setScale(0.7).setBounce(0.9).setInteractive();

      this.physics.add.collider(this.player, borderRight, hitGlass);
      this.physics.add.collider(this.player, borderLeft, hitGlass);
      this.physics.add.collider(this.player, borderBot, gameOver);


      this.anims.create({
            key: 'loop',
            frames: this.anims.generateFrameNames('player',
                  {
                        prefix: 'basic_',
                        suffix: '.png',
                        start: 0,
                        end: 91,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
      });

      this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNames('dead',
                  {
                        prefix: 'death_',
                        suffix: '.png',
                        start: 0,
                        end: 8,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
      });

      this.anims.create({
            key: 'loopOut',
            frames: this.anims.generateFrameNames('player',
                  {
                        prefix: 'basic_',
                        suffix: '.png',
                        start: 86,
                        end: 91,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
      });

      this.anims.create({
            key: 'extendIn',
            frames: this.anims.generateFrameNames('extend',
                  {
                        prefix: 'extend_',
                        suffix: '.png',
                        start: 0,
                        end: 8,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
            repeat: 0,
      });

      this.anims.create({
            key: 'extendOut',
            frames: this.anims.generateFrameNames('extend',
                  {
                        prefix: 'extend_',
                        suffix: '.png',
                        start: 8,
                        end: 14,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
            repeat: 0,
      });

      this.anims.create({
            key: 'disap',
            frames: this.anims.generateFrameNames('prise',
                  {
                        prefix: 'prisesplash_',
                        suffix: '.png',
                        start: 0,
                        end: 20,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
      });



      scoreValue = this.player.y - screenSize.height;

      // Variables pour le lancer
      var velocity = new Phaser.Math.Vector2();
      var velocityFromRotation = this.physics.velocityFromRotation;

      // Joueur position
      var pcx;
      var pcy;

      // Relache mouse coords
      var prx;
      var pry;

      // Distance, Angle, Force
      var d;
      var rad;
      var str;

      // Surfacede grimpe
      var up;
      var bot;
      var middle;

      var cursorCharDown = false;

      // Tracé de trajectoire (chargement)
      var graphics;
      var disabDobJump = true;
      var isStick = false;



      this.player.on('pointerdown', function (pointer, localX, localY) {

            
            if (isWon == false) {
                  
                  cursorCharDown = true;

                  pcx = this.player.x;
                  pcy = this.player.y;

                  graphics = this.add.graphics({ lineStyle: { width: 6, color: 0x08C455 } });
                  lineStr = new Phaser.Geom.Line(pcx, pcy, pointer.worldX, pointer.worldY);

                  if (isSuspended || playerConfig.skills.stickySlime) {
                        this.player.setGravityY(0);
                        this.player.setVelocity(0);
                        if (isSuspended) {
                              this.physics.world.overlap(this.player, priseGroup, priseAte);
                              disabDobJump = true;
                              this.player.play("loop");

                        } else if (playerConfig.skills.stickySlime && disabDobJump == false) {
                              playerConfig.skills.stickySlime = false;
                              isStick = true;

                              this.player.play("extendIn");
                              bonusGone("stickySlime");
                        }
                        d = 0;
                  }

                  if (playerConfig.skills.dobJump && disabDobJump == false) {
                        this.player.body.setVelocityY(-600);
                        this.player.setGravityY(350);
                        playerConfig.skills.dobJump = false;
                        bonusGone("dobJump");
                  }

                  this.input.on('pointermove', function (pointer, currentlyOver) {
                        if (cursorCharDown && disabDobJump == true || cursorCharDown == true && isStick &&  isWon == false) {
                              lineStr.setTo(pcx, pcy, pointer.worldX, pointer.worldY);
                              graphics.clear();
                              graphics.strokeLineShape(lineStr);
                        }
                  });
            }
      }, this);


      this.input.on('pointerup', function (pointer, gameObject) {
            if (cursorCharDown && graphics != undefined || disabDobJump && graphics != undefined) {
                  if(isStick){
                        this.player.play("extendOut");
                  } else if (isflying == false){
                        this.player.play("loopOut");
                  }
                  isStick = false;
                  graphics.clear();
                  this.player.setGravityY(350);

                  let BetweenPoints = Phaser.Math.Angle.BetweenPoints;
                  prx = pointer.worldX;
                  pry = pointer.worldY;
                  let releasePoint = { x: prx, y: pry };
                  rad = BetweenPoints(this.player, releasePoint);
                  rad = Phaser.Math.Angle.Normalize(rad);
                  deg = rad * (180 / Math.PI);
                  rad = rad - Math.PI;
                
                  d = Phaser.Math.Distance.Between(pcx, pcy, prx, pry);
                  rad = Phaser.Math.Angle.Between(prx, pry, pcx, pcy);

                  if (d > 150) {
                        d = 150;
                  }

                  playerConfig.skills.superStrenght ? str = d * 5 : str = d * 3;

                  if (isflying == false) {

                        if (playerConfig.skills.superStrenght) {
                              playerConfig.skills.superStrenght = false;
                              bonusGone("superStrenght");
                        }

                        disabDobJump = false;
                        velocityFromRotation(rad, str, velocity);

                        jumpCount++;

                        this.player.setVelocity(velocity.x, velocity.y);
                  }
            }
            cursorCharDown = false;

      }, this);


}


function update() {

      if(isWon == false){
            increaseTimer();
            
            dom.height.innerHTML = scoreBoard;

            if (bestScore < scoreBoard && bestScore != "Victoire") {

                  localStorage.setItem('bestScore', scoreBoard);
                  bestScore = scoreBoard;

                  dom.bestHeight.innerHTML = bestScore;


                  if (flagBest == false) {
                        sendCongratMessage();
                        flagBest = true;
                  }
            } 
      }
      


      // ALSOTHERE
      this.physics.world.overlap(this.player, this.topSurface, victory);

      if (isWon == false) {
            this.cameras.main.centerOn(this.player.x, this.player.y - 100);
      }


      // Et les rebords
      background.setPosition(screenSize.width / 2, this.cameras.main.scrollY + screenSize.height / 2 + 40);
      if (isWon == false) {
            borderRight.setPosition(center + 280, this.cameras.main.scrollY + screenSize.height / 2);
            borderLeft.setPosition(center - 280, this.cameras.main.scrollY + screenSize.height / 2)
      }



      if (this.player.y - screenSize.height < scoreValue) {
            scoreValue = this.player.y - screenSize.height;
      }
      scoreBoard = -1 * scoreValue;
      if (scoreBoard == -0) {
            scoreBoard = 0;
      }
      scoreBoard = scoreBoard / 10;
      scoreBoard = Math.trunc(scoreBoard);

      if (scoreBoard > bestScore && isBestScoreBoxDisplayed == false) {
            isBestScoreBoxDisplayed = true;
            sendCongratMessage();
      }


      priseElements.forEach(ele => {
            if (ele.y > this.cameras.main.scrollY + screenSize.height && stopGenerate == false) {
                  priseGroup.kill(ele);
                  priseLastDead = priseGroup.getFirstDead();

                  let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
                  priseLastDead.body.reset(randomWidth[pickWidth], this.cameras.main.scrollY - 100); // Changer 75 pour changer la difficulté ?

                  priseLastDead.anims.stop();
                  priseLastDead.setTexture('prise', 'prisesplash_00000.png');
                  priseLastDead.setActive(true);
                  priseLastDead.enableBody();
                  if (ele.y < -6470) { // -TO CHANGE
                        priseGroup.killAndHide(ele);
                        priseGroup.remove(ele);
                        stopGenerate = true;
                  }
            }
      });

      
      if (this.player.y + 100 < this.cameras.main.scrollY) {
            this.player.setVelocityY(0);
      }

      highElements.forEach(function (eles) {
            if (eles.y > mainScene.cameras.main.scrollY + screenSize.height + 1500 && isWon == false) {

                  if (eles.y + 145 - screenSize.height == -4000 && isTheTop == false && isWon == false) { // -3000 = tranche de fin
                        mainScene.topSurface = mainScene.physics.add.sprite(center, eles.y - 3295, 'topSurface').setSize(600, 100, 300).setOffset(0, 0).setInteractive(); // THERE
                        eles.setPosition(center, eles.y - 2995); // THERE
                        eles.setTexture('surface_top');
                        
                        isTheTop = true;
                  } else if (isTheTop == false) {
                        
                        eles.setPosition(center, eles.y - 3000); // THERE
                        let randomTexture = walls[Phaser.Math.Between(0, walls.length - 1)];
                        eles.setTexture(randomTexture);
                        /* REMETRE TEXTURES ALEATOIRES */
                  }
            }

      });

      this.player.body.velocity.y < 4 && this.player.body.velocity.y > -4 ? isflying = false : isflying = true;

      if (this.player.body.velocity.y > 500) {
            if (deadSoundProgress == false) {
                  isOver = false;
                  deadSoundProgress = true;
                  mainScene.player.play("die");
                  this.time.delayedCall(800, gameOver, [], this);
            }   
      }
      if (isOver) {
            if (deadSoundProgress == false) {
                  isOver = false;
                  deadSoundProgress = true;
                  // crackNeck.play();
            }
            mainScene.player.play("die");
            this.time.delayedCall(800, gameOver, [], this);
      }
      isSuspended = this.physics.world.overlap(this.player, priseGroup);
}


priseAte = function (gameObject1, gameObject2) {
      gameObject2.play("disap");
      slimePart++;


      dom.collectedMoney.innerHTML = Number(slimePart);
      


      let flag = false;
      /* Définis la quantité TOTALE de slime  */
      if (slimeStorageCount == null ) {

            /* Init total slimeStoragecount  */
            localStorage.setItem('slimeStorageCount', slimePart);
            slimeStorageCount = slimePart;
            dom.totalMoney.innerHTML = Number(slimeStorageCount);
            
      } else {

            /* Update total slimeStoragecount  */
  
            slimeStorageCount = Number(slimeStorageCount) + 1;
            localStorage.setItem('slimeStorageCount', slimeStorageCount);
            dom.totalMoney.innerHTML = slimeStorageCount;
      }

      // Update nombre de slime actuel

      

      // Nouveau nombre max de slime en 1 partie
      if (bestSlimeCollected < slimePart) {
            localStorage.setItem("bestSlimeCollected", slimePart);
            dom.mostCollected.innerHTML = Number(slimePart);
            bestSlimeCollected = slimePart;
      }

      gameObject2.disableBody();
      if (gameObject2.isAte != true) {
            gameObject2.isAte = true;
            gameObject2.on('animationcomplete-' + 'disap', function (currentAnim, currentFramee, sprite) {
                  gameObject2.isAte = false;
            });
      }
}

function convertTimeToSeconds(){
      let sec = bestTime;

      let newsec = sec % 60;
      let newmin = Math.floor(sec / 60);

      if (newsec < 10) { newsec = "0" + newmin }
      if (newmin < 10) { newmin = "0" + newmin }

      dom.bestTime.innerHTML = newmin + ":" + newsec;
}

victory = function (gameObject1, gameObject2) {

      if (isWon == false) {
            if(timer < bestTime){
                  localStorage.setItem('bestTime', timer);
                  bestTime = timer;
                  convertTimeToSeconds();
                  // Update bestTime value (dom.bestTime);
            }
            
            if (jumpCount < lowJump){
                  lowJump = jumpCount;
                  dom.lessJumps.innerHTML = jumpCount;
                  localStorage.setItem('lowJump', jumpCount);  
            }
            localStorage.setItem('bestScore', "Victoire");
            bestScore = "Victoire";
            dom.bestHeight.innerHTML = "Victoire";


            borderRight.setPosition(center + 280, mainScene.cameras.main.scrollY + 500 + screenSize.height / 2);
            borderLeft.setPosition(center - 280, mainScene.cameras.main.scrollY + 500 + screenSize.height / 2);
            gameObject1.setGravityY(-200);
            gameObject1.setInteractive(false);
            mainScene.time.delayedCall(3000, showWinScreen, [], this);
            isWon = true;

      }

}

hitGlass = function () {
      

      if (playerConfig.skills.elasticSlime) {
            playerConfig.skills.elasticSlime = false;
            bonusGone("elasticSlime");
      } else {
            mainScene.player.play("die");
            mainScene.time.delayedCall(800, gameOver, [], this);
      }
}

gameOver = function gameOver(dest) {
      let direction = document.getElementById("defeat");
      let parent = document.getElementById("game");

      

      // Hide la section active  
      parent.classList.add("opacity");

      setTimeout(function () {
            parent.classList.add("dn");
            mainScene.scene.stop('Game');
            direction.classList.remove("dn");
      }, 100);
      setTimeout(function () {
            direction.classList.remove("opacity");
      }, 150);

      
      // THERE BRO
}



bonusGone = function cooldownBonusGone(bonus) {
      playerConfig.skills[bonus] = false;
      mainScene.time.delayedCall(cooldown * 1000, bonusUp, [bonus], this);
      timerStart = true;
      if (bonus == "stickySlime" || bonus == "dobJump"){
            document.querySelector('[data-skill-slot="secondary"] span').setAttribute('data-state-skill', "down");
      }else{
            document.querySelector('[data-skill-slot="primary"] span').setAttribute('data-state-skill', "down");
      }
}


bonusUp = function (bonus) {
      playerConfig.skills[bonus] = true;
      timerStart = false;
      if (bonus == "stickySlime" || bonus == "dobJump") {
            document.querySelector('[data-skill-slot="secondary"] span').setAttribute('data-state-skill', "up");
      } else {
            document.querySelector('[data-skill-slot="primary"] span').setAttribute('data-state-skill', "up");
      }

      // Retirer classe qui met opacité sur le skill slot
}


increaseTimer = function increaseTimer(){
      if (timerInProgress == false && flagTimer == false) {
            mainScene.time.delayedCall(1000, upTimer, [], this); 
            flagzTimer();  
      }
}


function flagzTimer(){
      flagTimer = true;
}

upTimer = function upTimer(){
      timer++;
      flagTimer = false;
}


sendCongratMessage = function sendCongratMessage() {
      appearCongratMessage();
}

var flagBest = false;

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', function () {
      screenSize = {
            width: window.innerWidth,
            height: window.innerHeight
      }
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
})




      function changeSlide(e) {
            e.preventDefault();
            let directionName = this.getAttribute("data-game-link");
            let direction = document.getElementById(directionName);
            let parent = this.closest(".page");

            // Update Solde total
            

            if (parent.classList.contains("page-game")) {
                  mainScene.scene.pause();
                  mainScene.time.paused = true;
            }
            if (parent.classList.contains("page-pause")) {
                  mainScene.scene.resume();
                  mainScene.time.paused = false;

            } else if (directionName == "game"){
                  initPlayer();
                  initGame();
                  mainScene.scene.resume();
            }else if(directionName == "skills"){
                  updateSkillsState();
            }


            parent.classList.add("opacity");

            setTimeout(function () {
                  parent.classList.add("dn");
                  direction.classList.remove("dn");
            }, 100);
            setTimeout(function () {
                  direction.classList.remove("opacity");
            }, 150);
      }

});

