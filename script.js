var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var rightPressed = false;
var leftPressed = false;

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var xSpawnPoints = [-50, -10, 30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 580, 625];

var restartbutton = new Image();

var slime = {
    x: 335,
    y: 475,
    width: 25,
    height: 25,
    alive: true
}

var textVars = {
    score: 0,
    anvilSpawnRate: 1000,
    restartButtonLoaded: false,
    gameStarted: false
}

class Anvil {
    constructor(x, height, width) {
        this.x = x;
        this.y = 5;
        this.height = height;
        this.width = width;
        this.onScreenAnvils = 0;
        this.gravity = 0.02;
        this.gravitySpeed = 0;
        this.speedY = 0;
        this.draw = function() {
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function drawSlime() {
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(slime.x, slime.y, slime.width, slime.height);
}

var anvils = [];

// xSpawnPoints[Math.floor(Math.random()*xSpawnPoints.length)] + 50

setInterval(function() {
    if (anvils.length <= 2000) {
        anvils.push(new Anvil(xSpawnPoints[Math.floor(Math.random() * xSpawnPoints.length)] + 50, 25, 25));
    }
}, 35);

restartbutton.onload = function () {
  textVars.restartButtonLoaded = true;
};

function gameStarted() {
  setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = "20px Arial";
      ctx.fillText("Score" + " " + textVars.score, 600, 50);

      if (slime.alive == true) {
          drawSlime();

          if (rightPressed && slime.x < canvas.width - slime.height) {
              slime.x += 5;
          }

          if (leftPressed && slime.x > 0) {
              slime.x -= 5;
          }
          if (slime.alive == true) {
              for (let i = 0; i < anvils.length; i++) {
                  // console.log(anvils[i].x);
                  anvils[i].draw();
                  // anvils[i].y += 1;
                  anvils[i].gravitySpeed += anvils[i].gravity;
                  anvils[i].y += anvils[i].speedY + anvils[i].gravitySpeed;
                  if (anvils[i].y > 475) {
                      anvils[i].gravitySpeed = 0;
                      anvils[i].gravity = 0;
                      anvils[i].speedY = 0;
                      anvils.splice(i, 1);
                      if (slime.alive == true) {
                          textVars.score += 1;
                      }
                  }
                  if (anvils[i].x < slime.x + slime.width && anvils[i].x + anvils[i].width > slime.x && anvils[i].y < slime.y + slime.height && anvils[i].y + anvils[i].height > slime.y && anvils[i].y < 475) {
                      slime.alive = false;
                  }
              }
          }

      }

      if (slime.alive == false) {
          ctx.beginPath();
          ctx.font = "20px Arial";
          ctx.fillText("Game Over", 300, 250);
          ctx.closePath();

          anvils.length = 0;

          slime.x = 335;

          function getMousePos(canvas, event) {
              var rect = canvas.getBoundingClientRect();
              return {
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top
              };
          }
          //Function to check whether a point is inside a rectangle
          function isInside(pos, rect) {
              return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
          }
          //The rectangle should have x,y,width,height properties
          var rect = {
              x: 300,
              y: 300,
              width: 100,
              height: 50
          };
          // Binding the click event on the canvas
          canvas.addEventListener('click', function(evt) {
              var mousePos = getMousePos(canvas, evt);

              if (isInside(mousePos, rect)) {
                  slime.alive = true
                  textVars.score = 0;
              } else {
                  //nothing needs to happen here
              }
          }, false);

          // ctx.fillStyle = 'rgb(255, 255, 255)';
          // ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

          //drawing of the test image - img1
          if(textVars.restartButtonLoaded == true) {
              ctx.drawImage(restartbutton, rect.x, rect.y);
          }

          restartbutton.src = './restartbutton.png';
      }
  }, 10);
}
gameStarted();
// if (textVars.gameStarted == false) {
//   //Start Screen
//   ctx.beginPath();
//   ctx.font = "30px Arial";
//   ctx.fillStyle = 'rgb(255,255,255)'
//   ctx.fillText('Heavy Anvil', 275, 225);
//   ctx.closePath();

//   function getMousePos(canvas, event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
//   }
//   //Function to check whether a point is inside a rectangle
//   function isInside(pos, rect) {
//       return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
//   }
//   //The rectangle should have x,y,width,height properties
//   var rect = {
//       x: 300,
//       y: 300,
//       width: 100,
//       height: 50
//   };
//   // Binding the click event on the canvas
//   canvas.addEventListener('click', function(evt) {
//       var mousePos = getMousePos(canvas, evt);

//       if (isInside(mousePos, rect)) {

//           console.log('click inside');
//       } else {
//           //nothing needs to happen here
//           console.log('click outside');
//       }
//   }, false);

//   var startButton = new Image();

//   startButton.onload = function() {
//     ctx.drawImage(startButton, rect.x, rect.y);
//   };

//   startButton.src = './startbutton.png'
// }
