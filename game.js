
var screenSize = {
      width: window.innerWidth,
      height: window.innerHeight
}

var config = {
      type: Phaser.AUTO,
      parent: 'phaser-example',
      backgroundColor: '#6bf',
      width: screenSize.width,
      height: screenSize.height,

      physics: {
            default: 'arcade',
            arcade: {
                  debug: false,
            }
      },
      scene: {
            preload: preload,
            create: create,
            update: update
      }

};


// Local storage uses
var bestScore;

var game = new Phaser.Game(config);


// Scores
var scoreBoard;
var scoreValue;


// Joueur
var isSuspended;
// var isUnderRock;
var playerConfig = {};


var lineStr;

// Prises
var priseGroup;
var priseElements;
var priseLastDead;

var obstacleGroup;
var obstacleElements;

// var hasStrenght;
// var isStrenght = false;

// Sounds
var catch1;
var catch2;
var jump1;
var jump2;
var dead;

var deadSoundProgress;

var isOver;
var isHit;
var isflying = false;

var globaliseThis;

const center = screenSize.width / 2;

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

initPlayer();

function initPlayer() {
      playerConfig = {
            skin: 'Classic',
            skills: ['sticky', 'megajump'],
      };
}
var highElements = [];

function preload() {
      this.load.atlas('playerTop', 'custom/slimeAnim/slimeAnim.png', 'custom/slimeAnim/slimeAnim.json');
      this.load.atlas('prise', 'custom/prises/prise.png', 'custom/prises/prise.json')

      this.load.image('topImage', 'custom/top.jpg');
      this.load.image('botImage', 'custom/bottom.jpg');
      this.load.image('centerImage', 'custom/center.jpg');
      this.load.image('bgCenter', 'custom/fullW.png');

      // audio
      // this.load.audio('Catch1', ['custom/sound/player' + playerConfig.skin + 'Catch1.ogg', 'custom/sound/player' + playerConfig.skin + 'Catch1.mp3']);
}



function create() {
      
      initPlayer();
      deadSoundProgress = false;


      globaliseThis = this;

      isSuspended = false;
      // isUnderRock = false;

      isOver = false;
      isflying = false;

      bgCenter = this.add.sprite(center - 1100, window.innerHeight, 'bgCenter');

      // Background repeat
      up = this.add.sprite(center, window.innerHeight - 1300, 'topImage').setOrigin(0.5);
      bot = this.add.sprite(center, window.innerHeight - 2600, 'botImage').setOrigin(0.5);
      middle = this.add.sprite(center, window.innerHeight, 'centerImage').setOrigin(0.5);
      highElements.push(up, bot, middle);

      // Init songs
      // jump1 = this.sound.add('Jump1');

      
      priseGroup = this.physics.add.group();
      for (let i = 70; i < screenSize.height; i += 75) {
            let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
            let randomHeight = screenSize.height - i - 15; // var randomHeight = Phaser.Math.Between((screenSize.height - i) - 50, (screenSize.height - i) + 50);
            priseGroup.create(randomWidth[pickWidth], randomHeight, 'prise', 'Composition 1_00000.png').setScale(0.4).setOffset(40, 40).setCircle(60); //.setScale(Phaser.Math.Between(700, 1000) / 1000).refreshBody();  
      }
      priseElements = priseGroup.getChildren();

      this.player = this.physics.add.sprite(center, screenSize.height, 'playerTop', 'Slime_Stall_00000.png').setCircle(50).setOffset(50).setScale(0.9).setInteractive();

      this.anims.create({
            key: 'stall',
            frames: this.anims.generateFrameNames('playerTop', 
                  { 
                        prefix: 'Slime_Stall_',
                        suffix: '.png',
                        start: 0,
                        end: 27,
                        zeroPad: 5

                  }
            ),
            frameRate: 10,
            repeat: -1
      });

      this.anims.create({
            key: 'disap',
            frames: this.anims.generateFrameNames('prise',
                  {
                        prefix: 'Composition 1_',
                        suffix: '.png',
                        start: 0,
                        end: 24,
                        zeroPad: 5

                  }
            ),
            frameRate: 20,
      });

      this.player.play("stall");
      
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

      this.player.on('pointerdown', function (pointer, localX, localY) {
            cursorCharDown = true;
            
            pcx = this.player.x;
            pcy = this.player.y;

            graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            lineStr = new Phaser.Geom.Line(pcx, pcy, pointer.worldX, pointer.worldY);

            if (isSuspended) {    
                  this.player.setGravityY(0);
                  this.player.setVelocity(0);
                  this.physics.world.overlap(this.player, priseGroup, priseAte);

                  d = 0;
            }

            // Indicateur précédent saut
            this.input.on('pointermove', function (pointer, currentlyOver) {
                  if (cursorCharDown == true) {
                        lineStr.setTo(pcx, pcy, pointer.worldX, pointer.worldY);
                        graphics.clear();
                        graphics.strokeLineShape(lineStr);
                  }
            });
      }, this);


      this.input.on('pointerup', function (pointer, gameObject) {
            if (cursorCharDown) {
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

                  if (deg > 270 && deg < 360 || deg > 0 && deg < 75) {
                        //jump direction left

                  } else if (deg < 95 && deg > 75) {
                        //jump direction top

                  } else {
                        //jump direction right
                  }

                  d = Phaser.Math.Distance.Between(pcx, pcy, prx, pry);
                  rad = Phaser.Math.Angle.Between(prx, pry, pcx, pcy);


                  if (playerConfig.skills == 'superStrenght') {
                        if (d > 800) {
                              d = 800;
                        }
                  } else {
                        if (d > 150) {
                              d = 150;
                        }
                  }

                  str = d * 3.5;
                  
                  if (isflying == false) {
                        if (playerConfig.skills == 'superStrenght') {
                              // mètre le skill en cooldown
                              playerConfig.skills = '';
                        }
                        else if (d == 150) {
                              // son selon puissance fort
                        } else {
                              // son selon puissance faible
                        }

                        velocityFromRotation(rad, str, velocity);
                        this.player.setVelocity(velocity.x, velocity.y);
                  }
            }
            cursorCharDown = false;

      }, this);  

}


function update() {
      this.cameras.main.centerOn(this.player.x, this.player.y - 100);

      // Place l'arrière plan
      bgCenter.setPosition(window.innerWidth / 2, this.cameras.main.scrollY + window.innerHeight / 2);

      // Score
      if (this.player.y - screenSize.height < scoreValue) {
            scoreValue = this.player.y - screenSize.height;
      }
      scoreBoard = -1 * scoreValue;
      if (scoreBoard == -0) {
            scoreBoard = 0;
      }
      scoreBoard = scoreBoard / 10;
      scoreBoard = Math.trunc(scoreBoard);
      displayCurrentScore();



      priseElements.forEach(ele => {
            if (ele.y > this.cameras.main.scrollY + screenSize.height) {
                  priseGroup.kill(ele);
                  priseLastDead = priseGroup.getFirstDead();
                  let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
                  priseLastDead.body.reset(randomWidth[pickWidth], this.cameras.main.scrollY - 75); // Changer 75 pour changer la difficulté ?
                  priseLastDead.anims.stop();
                  priseLastDead.setTexture('prise', 'Composition 1_00000.png');
                  priseLastDead.setActive(true);
                  priseLastDead.enableBody();
            }
      });


      // Update fond de grimpe
      highElements.forEach(ele => {
            if (ele.y - 1300 > this.cameras.main.scrollY + screenSize.height) {
                  ele.setPosition(center, this.cameras.main.scrollY - 500 - screenSize.height);
            }
      });
      this.player.body.velocity.y < 4 && this.player.body.velocity.y > -4 ? isflying = false : isflying = true;


      // Game over
      if (this.player.body.velocity.y > 600) {
            if (deadSoundProgress == false) {
                  // dead.play();
                  isOver = false;
                  deadSoundProgress = true;
            }
            this.time.delayedCall(1000, gameOver, [], this);
      }
      if(isOver){
            if (deadSoundProgress == false){
                  isOver = false;
                  deadSoundProgress = true;
                  // crackNeck.play();
            } 
            this.time.delayedCall(1000, gameOver, [], this);
      }

      isSuspended = this.physics.world.overlap(this.player, priseGroup);

}

giveStrenght = function (gameObject1, gameObject2) {
      isStrenght = true;
      // playerConfig.boost = 'superStrenght';
}

priseAte = function (gameObject1, gameObject2) {
      // globaliseThis.physics.moveToObject(gameObject2, gameObject1, 50);
      // gameObject2.disableBody();
      gameObject2.play("disap");
      gameObject2.disableBody();
      if(gameObject2.isAte != true){
            gameObject2.isAte = true;
            gameObject2.on('animationcomplete-' + 'disap', function (currentAnim, currentFramee, sprite) { 
                  gameObject2.isAte = false;
            });
      }
      // globaliseThis.physics.moveToObject(gameObject1, gameObject2, 200);
}

// Pause + Lance les actions sous-jacentes
gameOver = function () {
      globaliseThis.scene.pause();
      showDeadMenue();
}








