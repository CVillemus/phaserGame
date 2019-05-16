
var screenSize = {
      width: window.innerWidth,
      height: window.innerHeight
}

window.addEventListener('resize', function(){
      if (isPause == false){
            togglePause();
      }
      screenSize = {
            width: window.innerWidth,
            height: window.innerHeight
      }
      // globaliseThis.resize(screenSize.width, screenSize.height); 
})

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
var game = new Phaser.Game(config);




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

// Sounds


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
            skills : {
                  superStrenght: true,
                  stickySlime: true,
                  elasticSlime: true,
                  dobJump: false,
            }
      };
      
}

let walls = ['surface_broken', 'surface_caution', 'surface_classic', 'surface_dead', 'surface_paint'];

let highElements = [];

// Bonus CD
const cooldown = 10;
var cooldownSuperStrenght;
var cooldownDobJump;
var cooldownElasticSlime;

var borderRight;
var borderLeft;
var hitBorderRight;
var hitBorderLeft;
var borderBot; 

function preload() {

      // Loader
      this.load.once('progress', function (progress) { console.log(progress)});
      this.load.on('complete', function () {dom.boxLoader.classList.add("dn")});

      // this.load.setPath('assets/sprites/');

      this.load.atlas('playerTop', 'custom/slimeAnim/slimeAnim.png', 'custom/slimeAnim/slimeAnim.json');
      this.load.atlas('prise', 'custom/prises/prise.png', 'custom/prises/prise.json')

      this.load.image('surface_classic', 'custom/bocal/bocal_classic.png');

      this.load.image('surface_caution', 'custom/bocal/bocal_caution.png');
      this.load.image('surface_dead', 'custom/bocal/bocal_dead.png');
      this.load.image('surface_paint', 'custom/bocal/bocal_paint.png');
      this.load.image('surface_broken', 'custom/bocal/bocal_broken.png');

      this.load.image('surface_bottom', 'custom/bocal/bocal_bottom.png');
      // this.load.image('botImage', 'custom/bocal/bocal_classic.png');
      // this.load.image('centerImage', 'custom/bocal/bocal_classic.png');
      this.load.image('background', 'custom/background.png');
      this.load.image('desk', 'custom/desk.png');
      this.load.image('enemy', 'custom/enemy.png')
      
      // audio
      // this.load.audio('Catch1', ['custom/sound/player' + playerConfig.skin + 'Catch1.ogg', 'custom/sound/player' + playerConfig.skin + 'Catch1.mp3']);
}



function create() {
      
      initPlayer();
      deadSoundProgress = false;


      globaliseThis = this;

      isSuspended = true;
      // isUnderRock = false;

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
      // Background repeat
      desk = this.add.sprite(center + 200, screenSize.height + 1000, 'desk');
      surface1 = this.add.sprite(center, screenSize.height - 1145, 'surface_classic').setOrigin(0.5);
      surface2 = this.add.sprite(center, screenSize.height - 2145, 'surface_classic').setOrigin(0.5);
      surface3 = this.add.sprite(center, screenSize.height - 145, 'surface_bottom').setOrigin(0.5);
      
      highElements.push(surface1, surface2, surface3);

      // Init songs
      // jump1 = this.sound.add('Jump1');

      
      priseGroup = this.physics.add.group();
      for (let i = 70; i < screenSize.height; i += 75) {
            let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
            let randomHeight = screenSize.height - i - 15; // var randomHeight = Phaser.Math.Between((screenSize.height - i) - 50, (screenSize.height - i) + 50);
            priseGroup.create(randomWidth[pickWidth], randomHeight, 'prise', 'Composition 1_00000.png').setScale(0.4).setOffset(40, 40).setCircle(60); //.setScale(Phaser.Math.Between(700, 1000) / 1000).refreshBody();  
      }
      priseElements = priseGroup.getChildren();

      this.player = this.physics.add.sprite(center, screenSize.height, 'playerTop', 'Slime_Stall_00000.png').setCircle(50).setOffset(50).setScale(0.9).setBounce(0.9).setInteractive();
     

      

      this.physics.add.collider(this.player, borderRight, hitGlass);
      this.physics.add.collider(this.player, borderLeft, hitGlass);
      this.physics.add.collider(this.player, borderBot, gameOver);

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
      var disabDobJump = true;
      var isStick = false;


      this.player.on('pointerdown', function (pointer, localX, localY) {
            cursorCharDown = true;
            
            pcx = this.player.x;
            pcy = this.player.y;

            graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            lineStr = new Phaser.Geom.Line(pcx, pcy, pointer.worldX, pointer.worldY);
            
            if (isSuspended || playerConfig.skills.stickySlime) {    
                  this.player.setGravityY(0);
                  this.player.setVelocity(0);
                  if(isSuspended){
                        this.physics.world.overlap(this.player, priseGroup, priseAte);
                        disabDobJump = true;
                  } else if (playerConfig.skills.stickySlime && disabDobJump == false){
                        playerConfig.skills.stickySlime = false;
                        isStick = true;
                        //cooldownStickySlime = this.time.delayedCall(cooldown * 1000, cooldownBonusUp, ["stickySlime"], this);
                        bonusGone("stickySlime");
                  }
                  d = 0;
            }

            if (playerConfig.skills.dobJump && disabDobJump == false) {
                  this.player.body.setVelocityY(-600);
                  this.player.setGravityY(350);
                  playerConfig.skills.dobJump = false;
                  // cooldownDobJump = this.time.delayedCall(cooldown * 1000, cooldownBonusUp, ["dobJump"], this);
                  bonusGone("dobJump");
            }

            this.input.on('pointermove', function (pointer, currentlyOver) {
                  if (cursorCharDown && disabDobJump == true || cursorCharDown && isStick) {
                        lineStr.setTo(pcx, pcy, pointer.worldX, pointer.worldY);
                        graphics.clear();
                        graphics.strokeLineShape(lineStr);
                  }
            }); 
      }, this);


      this.input.on('pointerup', function (pointer, gameObject) {
            if (cursorCharDown || disabDobJump) {
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

                  

                  if (deg > 270 && deg < 360 || deg > 0 && deg < 75) {
                        //jump direction left

                  } else if (deg < 95 && deg > 75) {
                        //jump direction top

                  } else {
                        //jump direction right
                  }
                  

                  d = Phaser.Math.Distance.Between(pcx, pcy, prx, pry);
                  rad = Phaser.Math.Angle.Between(prx, pry, pcx, pcy);

                  if (d > 150) {
                        d = 150;
                  }
                  
                  playerConfig.skills.superStrenght ? str = d * 5 : str = d * 3;
                  if (isflying == false) {
                        if (playerConfig.skills.superStrenght) {
                              playerConfig.skills.superStrenght = false;
                              // cooldownSuperStrenght = this.time.delayedCall(cooldown * 1000, cooldownBonusUp, ["superStrenght"], this);
                              bonusGone("superStrenght");
                        }

                        else if (d == 150) {
                              // son selon puissance fort
                        } else {
                              // son selon puissance faible
                        }

                        disabDobJump = false;
                        velocityFromRotation(rad, str, velocity);
                        this.player.setVelocity(velocity.x, velocity.y);
                  }
            }
            cursorCharDown = false;

      }, this);  
}


function update() {
      

      // this.enemy = this.physics.add.sprite(center, 500, 'enemy').setCircle(100).setOffset(50, 25).setScale(0.2).setInteractive();
      // this.enemy.setGravityY(700);

      // ALSOTHERE
      this.physics.world.overlap(this.player, this.enemy, cutPlayer);

      this.cameras.main.centerOn(this.player.x, this.player.y - 100);

      // Et les rebords
      background.setPosition(screenSize.width / 2, this.cameras.main.scrollY + screenSize.height / 2 + 40);
      borderRight.setPosition(center + 280, this.cameras.main.scrollY + screenSize.height / 2);
      borderLeft.setPosition(center - 280, this.cameras.main.scrollY + screenSize.height / 2)


      if (this.player.y - screenSize.height < scoreValue) {
            scoreValue = this.player.y - screenSize.height;
      }
      scoreBoard = -1 * scoreValue;
      if (scoreBoard == -0) {
            scoreBoard = 0;
      }
      scoreBoard = scoreBoard / 10;
      scoreBoard = Math.trunc(scoreBoard);

      if (scoreBoard > bestScore){
            sendCongratMessage();
      }

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
            if (ele.y > this.cameras.main.scrollY + screenSize.height + 1500) {
                  ele.setPosition(center, ele.y - 3000); // - screenSize.height);
                  ele.setTexture('surface_classic');
                  
                  ele.setTexture(walls[Phaser.Math.Between(0, walls.length - 1)])
                  console.log("change");
            }
      });

      this.player.body.velocity.y < 4 && this.player.body.velocity.y > -4 ? isflying = false : isflying = true;


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

priseAte = function (gameObject1, gameObject2) {
      gameObject2.play("disap");
      slimePart++;
      updateSlimeCount();
      gameObject2.disableBody();
      if(gameObject2.isAte != true){
            gameObject2.isAte = true;
            gameObject2.on('animationcomplete-' + 'disap', function (currentAnim, currentFramee, sprite) { 
                  gameObject2.isAte = false;
            });
      }
}

// Pause + Lance les actions sous-jacentes
hitGlass = function () {
      if(playerConfig.skills.elasticSlime){
            playerConfig.skills.elasticSlime = false;
            bonusGone("elasticSlime");
      }else{
            globaliseThis.time.delayedCall(100, gameOver, [], this);
      }
}

gameOver = function gameOver() {
      globaliseThis.scene.pause();
      showDeadMenue();
}

var timerStart = false;

bonusGone = function cooldownBonusGone(bonus){
      playerConfig.skills[bonus] = false;
      globaliseThis.time.delayedCall(cooldown * 1000, bonusUp, [bonus], this);
      timerStart = true;
}


bonusUp = function (bonus){
      playerConfig.skills[bonus] = true;
      timerStart = false;
}

cutPlayer = function cutPlayer(){
      globaliseThis.time.delayedCall(100, gameOver, [], this); 
}

sendCongratMessage = function sendCongratMessage(){
      appearCongratMessage();
      // Faire apparaitre le message;
      // cooldown qui le fait disparaitre;
}

enemySlime = function enemySlime(){
      // 0 = 0 prob
      // 10 000 = 1 obligé

      // this.enemy = this.physics.add.sprite(center, 500, 'enemy').setCircle(100).setOffset(50, 25).setScale(0.2).setInteractive();
      globaliseThis.time.delayedCall(100, gameOver, [], this)
      // this.enemy.setGravityY(700);

}













