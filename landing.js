
// var blocRed = document.querySelector("#blocRouge");

// var tlBlocRed = new TimelineMax({ repeat: -1 });
// tlBlocs.to(blocRed, 1, { x: 100, y: 0, ease: Power3.easeOut })

console.log("goes");


var maze = document.getElementById("maze");
var logoHero = document.getElementById("logoHero");

var slime = document.getElementById("animation-Loop");
var mazeSmall = document.getElementById("mazeSmall");

var nav = document.querySelector(".landing nav");





var timelineLogo = new TimelineMax({});
timelineLogo.to(maze, 0, { rotation: 0,  scale: 1, x: 20, transformOrigin: "50% 45%" },0)
            .to(maze, 6,{ rotation: 180,  scale: 1.2, x: 50, transformOrigin: "50% 45%" },0)

            .to(logoHero, 0, { autoAlpha: 1, y: 0, transformOrigin: "50% 50%" },0)
            .to(logoHero, 6, { autoAlpha: 0, y: 50, transformOrigin: "50% 50%" },0)

var timelineNav = new TimelineMax({ yoyo:true});
timelineNav.from(nav, 0, { autoAlpha: 0, y: -200, transformOrigin: "50% 50%" }, 0)
            .to(nav, 0, { autoAlpha: 0, y: -200, transformOrigin: "50% 50%" }, 0)
            .to(nav, 0.5, { autoAlpha: 1, y: 0, transformOrigin: "50% 50%" }, 0)

var controller = new ScrollMagic.Controller();
var controller2 = new ScrollMagic.Controller();

var sceneMagic = new ScrollMagic.Scene({
      triggerElement: parent,
      offset: 100,
      duration: 200
})

.setTween(timelineLogo)
// .addIndicators({
//       name: "Animation",
//       colorStart: '#FFF',
//       colorTrigger: '#AEAEAE'
// })
.reverse(true)
.addTo(controller)
// .scrollOffset(50);

var newScene = new ScrollMagic.Scene({
      triggerElement: parent,
      offset: 300,
      // duration: 300
})

      .setTween(timelineNav)
      // .addIndicators({
      //       name: "Anim",
      //       colorStart: '#AEAE',
      //       colorTrigger: '#AEAEAE'
      // })
      .reverse(true)
      .addTo(controller2)
// .scrollOffset(50);




var timelineMaze = new TimelineMax({ repeat: -1});
var timelineSlime = new TimelineMax({ repeat: -1 });
timelineMaze.to(maze, 0, { rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, 0)
      .to(mazeSmall, 30, { rotation: 45, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, 0)
      .to(mazeSmall, 30, { rotation: 90, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, 30)
      .to(mazeSmall, 30, { rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(1, 0.3) }, 60)


timelineSlime.to(slime, 0 ,{scaleY: 1, scaleX: 1, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 1.05, scaleX: 0.95, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 0.95, scaleX: 1.05, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 1.05, scaleX: 0.95, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 0.95, scaleX: 1.05, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 1.05, scaleX: 0.95, transformOrigin: "50% 50%"})
      .to(slime, 1, { scaleY: 1, scaleX: 1, transformOrigin: "50% 50%"})

      .to(slime, 3, { rotation: 360 , transformOrigin: "50% 50%" }, 0)
      .to(slime, 3, { rotation: 0, transformOrigin: "50% 50%" }, 3)



const sceneT = new Phaser.Scene("GameT");
sceneT.preload = preloadT;
sceneT.create = createT;
sceneT.update = updateT;



var configT = {
      type: Phaser.CANVAS,
      parent: document.getElementById('tutoCanvas'),
      backgroundColor: '#1E1E22',
      width: 500,
      height: 500,
      physics: {
            default: 'arcade',
            arcade: {
                  debug: false,
            }
      },
      scene: sceneT
};

// Local storage uses
var gameT = new Phaser.Game(configT);

var canvasTutoHeight = document.getElementById("tutoCanvas").clientHeight;
var canvasTutoWidth = document.getElementById("tutoCanvas").clientWidth;


var priseGroupT;
var isSuspendedT;

var centerT = canvasTutoWidth / 2;


const randomWidthT = [
      centerT - 200,
      centerT - 150,
      centerT - 100,
      centerT - 50,
      centerT,
      centerT + 50,
      centerT + 100,
      centerT + 150,
      centerT + 200,
]

var graphicsT;
var graphT;
var priseElementsT;

var directivesGave = false;
var directives;
var firstMessage = true;

function preloadT() {
      console.log("goesA");
      // Loader
      this.load.once('progress', function (progress) { console.log(progress) });
      this.load.on('complete', function () {
            tutoScene = gameT.scene.getScene("GameT");
            tutoScene.scene.stop('GameT');
            tutoScene.scene.start('GameT');
      });

      this.load.atlas('player', 'assets/images/game/animations/basic/prise.png', 'assets/images/game/animations/basic/prise.json')
      this.load.atlas('prise', 'assets/images/game/animations/prisesplash/splash.png', 'assets/images/game/animations/prisesplash/splash.json');

}

function createT() {


      
      directivesGave = false;

      graphT = this.add.graphics();
      var rect = new Phaser.Geom.Rectangle(centerT - 500/2, 0, 500, 1000);
      graphT.fillStyle(Phaser.Display.Color.HexStringToColor("3E3D3F").color, 1);
      graphT.fillRectShape(rect);
      
      directives = this.make.text({
            x: centerT,
            y: 600,
            text: 'Maintenez la pression sur Green',
            origin: 0.5,
            style: {
                  font: '24px "Fredoka One"',
                  fill: 'white',
                  wordWrap: { width: 250, useAdvancedWrap: true },
                  align: 'center'
            }
      });
      
      directives.setDepth(1);

      console.log("goesB");
      priseGroupT = this.physics.add.group();
      for (let i = 70; i < canvasTutoHeight; i += 75) {
            let pickWidth = Phaser.Math.Between(0, randomWidthT.length - 1);
            let randomHeight = canvasTutoHeight - i - 15; // var randomHeight = Phaser.Math.Between((screenSize.height - i) - 50, (screenSize.height - i) + 50);
            priseGroupT.create(randomWidthT[pickWidth], randomHeight, 'prise', 'prisesplash_00000.png').setScale(0.7).setOffset(30, 30).setCircle(40); //.setScale(Phaser.Math.Between(700, 1000) / 1000).refreshBody();  
      }
      priseElementsT = priseGroupT.getChildren();

      this.player = this.physics.add.sprite(centerT, 500, 'player', 'basic_00000.png').setCircle(55).setOffset(35).setScale(0.7).setBounce(0.9).setInteractive();
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

      var pcx;
      var pcy;

      // Relache mouse coords
      var prx;
      var pry;

      // Distance, Angle, Force
      var d;
      var rad;
      var str;

      var cursorCharDown = false;
      var graphicsT;
      
      
      isSuspendedT = true;
     
      this.player.on('pointerdown', function (pointer, localX, localY) {
            cursorCharDown = true;
            pcx = this.player.x;
            pcy = this.player.y;

            if (firstMessage && directivesGave == false){
                  directives.text = "Chargez votre tir dans une direction";
                  firstMessage = false;
            }

            graphicsT = this.add.graphics({ lineStyle: { width: 6, color: 0x08C455 } });
            lineStr = new Phaser.Geom.Line(pcx, pcy, pointer.worldX, pointer.worldY);

            if (isSuspendedT){
                  if (directivesGave == false) {
                        directives.text = "Chargez votre tir dans une direction";
                  }
                  
                  this.player.setGravityY(0);
                  this.player.setVelocity(0);
                  this.physics.world.overlap(this.player, priseGroupT, priseAteT);
            }
            d = 0;

            this.input.on('pointermove', function (pointer, currentlyOver) {
                  if (cursorCharDown || cursorCharDown == true) {
                        if (directivesGave == false) {
                              directives.text = "Relachez pour sauter";
                        }
                        lineStr.setTo(pcx, pcy, pointer.worldX, pointer.worldY);
                        graphicsT.clear();
                        graphicsT.strokeLineShape(lineStr);
                  }
            });

      }, this);

      this.input.on('pointerup', function (pointer, gameObject) {
            if (cursorCharDown && graphicsT != undefined){
                  if (directivesGave == false){
                        directives.text = "Cliquez et maintenez le clic au survol d'une prise";
                  }
                  
                  graphicsT.clear();
                  this.player.setGravityY(350);

                  var velocity = new Phaser.Math.Vector2();
                  var velocityFromRotation = this.physics.velocityFromRotation;
                  let str;
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
                  str = d * 3
                  if (d > 150) {
                        d = 150;
                  }

                  if (isflying == false) {
                        velocityFromRotation(rad, str, velocity);
                        this.player.setVelocity(velocity.x, velocity.y);
                  }
            }
            cursorCharDown = false;
      }, this);

}

function updateT() {
      this.cameras.main.centerOn(this.player.x, this.player.y - 50);
      graphT.setPosition(centerT - 500/2 - 15, this.cameras.main.scrollY);

      

      priseElementsT.forEach(ele => {
            if (ele.y > this.cameras.main.scrollY + canvasTutoHeight) {
                  priseGroupT.kill(ele);
                  priseLastDead = priseGroupT.getFirstDead();

                  let pickWidth = Phaser.Math.Between(0, randomWidthT.length - 1);
                  priseLastDead.body.reset(randomWidthT[pickWidth], this.cameras.main.scrollY - 75); // Changer 75 pour changer la difficulté ?
                  priseLastDead.anims.stop();
                  priseLastDead.setTexture('prise', 'prisesplash_00000.png');
                  priseLastDead.setActive(true);
                  priseLastDead.enableBody();
            }


      });

      if (this.player.body.velocity.y > 600) {
            tutoScene.scene.restart()
      }

      this.player.body.velocity.y < 4 && this.player.body.velocity.y > -4 ? isflying = false : isflying = true;
      isSuspendedT = this.physics.world.overlap(this.player, priseGroupT);

      directives.setPosition(this.player.x, this.cameras.main.scrollY + canvasTutoHeight - 100)
}

directiveF = function (info) {
      directives.text = info;
}

killDirectives = function () {
      directives.text = "";
}

priseAteT = function (gameObject1, gameObject2) {
      if (directivesGave == false){
            directives.text = "Répétez l'opération";
            directivesGave = true;
            tutoScene.time.delayedCall(2000, killDirectives, [], this);
      }
      
      
      gameObject2.play("disap");
      gameObject2.disableBody();
      if (gameObject2.isAte != true) {
            gameObject2.isAte = true;
            gameObject2.on('animationcomplete-' + 'disap', function (currentAnim, currentFramee, sprite) {
                  gameObject2.isAte = false;
            });
      }
}

let elanchor = document.querySelectorAll("[data-dest]");

for (let i = 0; i < elanchor.length; i++) {
      elanchor[i].addEventListener("click", scroll);
}

function scroll(e) {
      e.preventDefault();
      let el = this.getAttribute("data-dest");
      document.getElementById(el).scrollIntoView({
            behavior: 'smooth'
      });
      
}
