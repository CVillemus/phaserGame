window.onload = function () {

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
                        debug: true
                  }
            },
            scene: {
                  preload: preload,
                  create: create,
                  update: update
            }

      };

      var dom = {
            loseBox: document.getElementById("loseBox"),
            deadOrigin: document.getElementById("containerDeadOrigin"),
            actualScore: document.getElementById("containerActualScore"),
            bestScore: document.getElementById("containerBestScore"),
            bestScoreMessage: document.getElementById("containerBestScoreMessage"),
            pause: document.getElementById("buttonGamePause"),
            retry: document.getElementById("buttonGameRetry"),

            onBoarding: document.getElementById("onBoarding"),
            onBoardingBtnBefore: document.querySelector("#onBoarding .btn--prev"),
      }

      // Local storage uses
      var bestScore;

      var game = new Phaser.Game(config);


      // Scores
      var scoreBoard;
      var scoreText;
      var scoreValue;

      var camera;

      // Joueur
      var player;
      var isSuspended;
      // var isUnderRock;
      var playerConfig = {};


      var lineStr;

      // Prises
      var platformGroup;
      var platformElements;
      var platformLastDead;

      var obstacleGroup;
      var obstacleElements;

      // var bonusGroup;
      // var bonusElements;
      // var hasHulk;

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

      var isPause = false;
      // var isHulk = false;
      // var collideToRock;

      const center = screenSize.width / 2;
      
      const randomWidth = [
            center - 250,
            center - 200,
            center - 150,
            center - 100,
            center - 50,
            center,
            center + 50,
            center + 100,
            center + 150,
            center + 200,
            center + 250
      ]

      initPlayer();

      function initPlayer() {
            playerConfig = {
                  skin: 'Classic',
                  boost: '',
            };
      }
      var highElements = [];

      function preload() {
            // images
            this.load.image('playerTop', 'custom/player' + playerConfig.skin + 'Top.png');
            this.load.image('playerRight', 'custom/player' + playerConfig.skin + 'Right.png');
            this.load.image('playerLeft', 'custom/player' + playerConfig.skin + 'Left.png');
            this.load.image('playerGrab', 'custom/player' + playerConfig.skin + 'Grab.png');

            // this.load.image('playerHulkTop', 'custom/playerHulkTop.png');
            // this.load.image('playerHulkRight', 'custom/playerHulkRight.png');
            // this.load.image('playerHulkLeft', 'custom/playerHulkLeft.png');
            // this.load.image('playerHulkGrab', 'custom/playerHulkGrab.png');

            this.load.image('platform', 'custom/platform.png');

            this.load.image('topImage', 'custom/top.png');
            this.load.image('rightImage', 'custom/left.png');
            this.load.image('botImage', 'custom/bottom.png');
            this.load.image('leftImage', 'custom/right.png');
            this.load.image('centerImage', 'custom/center.png');

            this.load.image('bgCenter', 'custom/fullW.png');
            // this.load.image('obstacle', 'custom/obstacleRock.png');
            // this.load.image('bonusHulk', 'custom/bonusHulk2.png');
            // audio
            this.load.audio('Catch1', ['custom/sound/player' + playerConfig.skin + 'Catch1.ogg', 'custom/sound/player' + playerConfig.skin + 'Catch1.mp3']);
            this.load.audio('Catch2', ['custom/sound/player' + playerConfig.skin + 'Catch2.ogg', 'custom/sound/player' + playerConfig.skin + 'Catch2.mp3']);
            this.load.audio('Jump1', ['custom/sound/player' + playerConfig.skin + 'Jump1.ogg', 'custom/sound/player' + playerConfig.skin + 'Jump1.mp3']);
            this.load.audio('Jump2', ['custom/sound/player' + playerConfig.skin + 'Jump2.ogg', 'custom/sound/player' + playerConfig.skin + 'Jump2.mp3']);
            // this.load.audio('JumpBonusHulk', ['custom/sound/playerHulkBonusJump.ogg', 'custom/sound/playerHulkBonusJump.mp3']);
            this.load.audio('crackNeck', ['custom/sound/crackNeck.ogg', 'custom/sound/crackNeck.mp3']);
            this.load.audio('Dead', ['custom/sound/playerClassicDead.ogg', 'custom/sound/playerClassicDead.mp3']);
      }



      function create() {

            initPlayer();
            deadSoundProgress = false;

            this.input.addDownCallback(function () {
                  if (game.sound.context.state === 'suspended') {
                        game.sound.context.resume();
                  }

            });

            globaliseThis = this;
            camera = this.cameras.main;

            isSuspended = false;
            // isUnderRock = false;

            isOver = false;
            isflying = false;

            bgCenter = this.add.sprite(center - 1100, window.innerHeight, 'bgCenter');

            // Background repeat
            up = this.add.sprite(center + 50, window.innerHeight - 1300, 'topImage');
            bot = this.add.sprite(center + 50, window.innerHeight - 2600, 'botImage');
            middle = this.add.sprite(center + 50, window.innerHeight, 'centerImage');
            highElements.push(up, bot, middle);

            // Init songs
            jump1 = this.sound.add('Jump1');
            jump2 = this.sound.add('Jump2');
            catch1 = this.sound.add('Catch1');
            catch2 = this.sound.add('Catch2');
            dead = this.sound.add('Dead');
            crackNeck = this.sound.add('crackNeck');
            // hulkJump = this.sound.add('JumpBonusHulk');

            

            // Génération prises

            
            
            platformGroup = this.physics.add.staticGroup();
            for (let i = 70; i < screenSize.height; i += 75) {
                  let pickWidth = Phaser.Math.Between(0, randomWidth.length - 1);
                  let randomHeight = screenSize.height - i - 15; // var randomHeight = Phaser.Math.Between((screenSize.height - i) - 50, (screenSize.height - i) + 50);
                  platformGroup.create(randomWidth[pickWidth], randomHeight, 'platform'); //.setScale(Phaser.Math.Between(700, 1000) / 1000).refreshBody();  
            }
            platformElements = platformGroup.getChildren();

            // Update plateformes
            



            

            // Init player
            player = this.physics.add.sprite(window.innerWidth / 2 + 50, window.innerHeight, 'playerTop').setScale(0.2).setInteractive();;

            // Obstacles
            // obstacleGroup = this.physics.add.staticGroup();

            // obstacleGroup.create(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(-1300, -2000), 'obstacle').setScale(0.8).setCircle(100).refreshBody();
            // obstacleGroup.create(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(-2600, -4000), 'obstacle').setScale(0.4).setCircle(45).refreshBody();
            // obstacleGroup.create(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(-4000, -6000), 'obstacle').setScale(0.6).setCircle(60).refreshBody();

            // obstacleElements = obstacleGroup.getChildren();
            // collideToRock = this.physics.add.collider(player, obstacleGroup, hitRock);

            // bonus
            // bonusGroup = this.physics.add.staticGroup();
            // bonusGroup.create(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(-1000, -2000), 'bonusHulk').setScale(0.2).setCircle(45).refreshBody();
            
            // bonusElements = bonusGroup.getChildren();





            // init score
            scoreValue = player.y - screenSize.height;
            scoreText = this.add.text(camera.scrollX + 100, camera.scrollY + 450, 'Score: ' + scoreValue, { fontFamily: 'Arial', fontSize: 30, color: '#000' });

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

            player.on('pointerdown', function (pointer, localX, localY) {
                  cursorCharDown = true;
                  
                  if (playerConfig.boost == '') {
                        player.setTexture('playerGrab');
                        // globaliseThis.physics.world.removeCollider(isUnderRock);
                        // if (isHulk == true){
                        //       // collideToRock = this.physics.add.collider(player, obstacleGroup, hitRock);
                        // }
                        // isHulk = false;
                  } else {
                        // player.setTexture('playerHulkGrab');
                  }

                  

                  pcx = player.x;
                  pcy = player.y;

                  graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
                  lineStr = new Phaser.Geom.Line(pcx, pcy, pointer.worldX, pointer.worldY);

                  if (isSuspended) {    
                        player.setGravityY(0);
                        player.setVelocity(0);
                        if (d == 200) {
                              catch1.play();
                        } else {
                              catch2.play();
                        }

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
                  console.log(pointer.worldY);
                  if (cursorCharDown) {
                        graphics.clear();
                        player.setGravityY(300);

                        var BetweenPoints = Phaser.Math.Angle.BetweenPoints;

                        prx = pointer.worldX;
                        pry = pointer.worldY;

                        var releasePoint = { x: prx, y: pry }

                        rad = BetweenPoints(player, releasePoint);
                        rad = Phaser.Math.Angle.Normalize(rad);
                        deg = rad * (180 / Math.PI);
                        rad = rad - Math.PI;

                        if (deg > 270 && deg < 360 || deg > 0 && deg < 75) {
                              if (playerConfig.boost == 'hulk') {
                                    // player.setTexture('playerHulkLeft');
                              } else {
                                    player.setTexture('playerLeft');
                              }

                        } else if (deg < 95 && deg > 75) {
                              if (playerConfig.boost == 'hulk') {
                                    // player.setTexture('playerHulkTop');
                              } else {
                                    player.setTexture('playerTop');
                              }

                        } else {

                              if (playerConfig.boost == 'hulk') {
                                    // player.setTexture('playerHulkRight');
                              } else {
                                    // collideToRock = this.physics.add.collider(player, obstacleGroup, hitRock);
                                    player.setTexture('playerRight');
                              }
                        }

                        

                        d = Phaser.Math.Distance.Between(pcx, pcy, prx, pry);
                        rad = Phaser.Math.Angle.Between(prx, pry, pcx, pcy);


                        if (playerConfig.boost == 'hulk') {
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
                              if (playerConfig.boost == 'hulk') {
                                    hulkJump.play();
                                    playerConfig.boost = '';
                              }
                              else if (d == 150) {
                                    jump2.play(); // sound
                              } else {
                                    jump1.play(); // sound
                              }

                              velocityFromRotation(rad, str, velocity);
                              jump(velocity);
                        }
                  }
                  cursorCharDown = false;

            }, this);

            // Pause
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

            // Lance le saut
            function jump(velocite) {
                  player.setVelocity(velocity.x, velocity.y);
            }


      }


      giveHulk = function (gameObject1, gameObject2) {
            isHulk = true;
            // globaliseThis.physics.world.removeCollider(collideToRock);

            // bonusGroup.kill(gameObject2);
            player.setTexture('playerHulkTop');
            playerConfig.boost = 'hulk';
            // bonusLastDead = bonusGroup.getFirstDead();
            // bonusLastDead.body.reset(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(camera.scrollY - 10000, camera.scrollY + 30000)); // THERE
            // bonusLastDead.setActive(true);
      }

      // killRock = function (gameObject1, gameObject2){
      //       gameObject2.destroy();
      // }



      // hitRock = function (gameObject1, gameObject2) {
      //       if (isHulk == true ) {
      //             gameObject2.destroy();
      //       } else {
      //             crackNeck.play();
      //             isOver = true;
      //       }
      // }

      function update() {
            // Centrer la camera sur le joueur en permanence
            camera.centerOn(player.x, player.y - 100);

            // Place l'arrière plan
            bgCenter.setPosition(window.innerWidth / 2, camera.scrollY + window.innerHeight / 2);

            // Score
            if (player.y - screenSize.height < scoreValue) {
                  scoreValue = player.y - screenSize.height;
            }
            scoreBoard = -1 * scoreValue;
            if (scoreBoard == -0) {
                  scoreBoard = 0;
            }
            scoreBoard = scoreBoard / 10;
            scoreBoard = Math.trunc(scoreBoard);

            scoreText.setPosition(camera.scrollX + 30, camera.scrollY + 30);
            scoreText.setText('Score: ' + scoreBoard);

            // Bonus
            // bonusElements.forEach(ele => {
            //       if (ele.y - 300 > camera.scrollY + screenSize.height) {
            //             bonusGroup.kill(ele);
            //             bonusLastDead = bonusGroup.getFirstDead();
            //             bonusLastDead.body.reset(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(camera.scrollY - 10000, camera.scrollY));
            //             bonusLastDead.setActive(true);
            //       }
            // });

            platformElements.forEach(ele => {
                  // Si: Position prise dépasse la caméra de 300 px
                  if (ele.y > camera.scrollY + screenSize.height) {
                        platformGroup.kill(ele);
                        platformLastDead = platformGroup.getFirstDead();
                        let pickWidth = Phaser.Math.Between(0, randomWidth.length);
                        platformLastDead.body.reset(randomWidth[pickWidth], camera.scrollY - 75); // Changer 75 pour changer la difficulté ?
                        platformLastDead.setActive(true);
                  }
            });

            

            // Update obstacle
            // var obstacleDead;
            // obstacleElements.forEach(ele => {
            //       if (ele.y - 300 > camera.scrollY + screenSize.height) {
            //             obstacleGroup.kill(ele);
            //             obstacleDead = platformGroup.getFirstDead();
            //             ele.body.reset(Phaser.Math.Between(center - 300, center + 300), Phaser.Math.Between(camera.scrollY - 700, camera.scrollY - 2200));
            //             ele.setActive(true);

            //       }

            // });

            // Update fond de grimpe
            highElements.forEach(ele => {
                  if (ele.y - 1300 > camera.scrollY + screenSize.height) {
                        ele.setPosition(screenSize.width / 2 + 50, camera.scrollY - 500 - screenSize.height);
                  }
            });
            player.body.velocity.y < 4 && player.body.velocity.y > -4 ? isflying = false : isflying = true;


            // Game over
            if (player.body.velocity.y > 600) {
                  if (deadSoundProgress == false) {
                        dead.play();
                        isOver = false;
                        deadSoundProgress = true;
                  }
                  this.time.delayedCall(1500, gameOver, [], this);
            }
            if(isOver){
                  if (deadSoundProgress == false){
                        isOver = false;
                        deadSoundProgress = true;
                        // crackNeck.play();
                  } 
                  this.time.delayedCall(1500, gameOver, [], this);
            }

            // overlaps
            // this.physics.world.overlap(player, bonusGroup, giveHulk);
            isSuspended = this.physics.world.overlap(player, platformGroup);
            // isUnderRock = this.physics.world.overlap(player, obstacleGroup, killRock);
            

      }

      // Pause + Lance les actions sous-jacentes
      gameOver = function () {
            globaliseThis.scene.pause();
            showDeadMenue();
      }

      
      // Ouvre la box de mort
      function showDeadMenue() {
            dom.loseBox.classList.remove("dn");
            fillDeadMenue();
            dom.retry.addEventListener("click", restartGame);
      }
      
      // Remplis les champs de score si besoin et le nouveau meilleur score
      function fillDeadMenue() {
            dom.actualScore.innerHTML = scoreBoard;
            getBestScore();
            dom.bestScore.innerHTML = bestScore;
      }

      // Check le score actual avec le meilleur score dans le local storage
      function getBestScore(){
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

      // Si un nouveau meilleur score est établis, met la phrase de nouveau score
      function showNewBestScore(){
            // et lui donne un peu de contenu 
            bestScoreMessage.innerHTML = "Nouveau meilleur score !";


      }

      // Ferme l'interface
      function closeDeadMenue() {
            dom.loseBox.classList.add("dn");
      }

      // Relance le jeu
      function restartGame() {
            globaliseThis.scene.restart();
            closeDeadMenue();
      }

      dom.onBoardingBtnBefore.addEventListener("click", toggleOnboarding)
      function toggleOnboarding() {
            dom.onBoarding.classList.toggle("dn");
      }
}







