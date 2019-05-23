var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// Key Event Handling
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

// Slime Character
var slime = {
    x: 335,
    y: 475,
    width: 25,
    height: 25,
    alive: true
}

// Basic Game Variables
var textVars = {
    score: 0,
    anvilSpawnRate: 1000,
    restartButtonLoaded: false,
    gameStarted: false
}

// Anvil Object
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

// Draws Slime
function drawSlime() {
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(slime.x, slime.y, slime.width, slime.height);
}

// All of the anvils that are onscreen
var anvils = [];

// xSpawnPoints[Math.floor(Math.random()*xSpawnPoints.length)] + 50

// Adds a new anvil to the anvils[] array every 35ms
setInterval(function() {
    if (anvils.length <= 2000) {
        anvils.push(new Anvil(xSpawnPoints[Math.floor(Math.random() * xSpawnPoints.length)] + 50, 25, 25));
    }
}, 35);

// Loads the restart button for when your characer dies
restartbutton.onload = function () {
  textVars.restartButtonLoaded = true;
};

// Game Started so run this function
function gameStarted() {
  // Main game loop
  setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //Score text
      ctx.font = "20px Arial";
      ctx.fillText("Score" + " " + textVars.score, 600, 50);
      
      //Slime is alive so complete every function needed to run the game
      if (slime.alive == true) {
          drawSlime();
          
          //Keypressed
          if (rightPressed && slime.x < canvas.width - slime.height) {
              slime.x += 5;
          }

          if (leftPressed && slime.x > 0) {
              slime.x -= 5;
          }
          //Draw anvils if the slime is alive
          if (slime.alive == true) {
              for (let i = 0; i < anvils.length; i++) {
                  //Draw single anvil
                  anvils[i].draw();
                  //Setting the gravity of all of the anvils
                  anvils[i].gravitySpeed += anvils[i].gravity;
                  anvils[i].y += anvils[i].speedY + anvils[i].gravitySpeed;
                  //If anvils has touched the bottom
                  if (anvils[i].y > 475) {
                      anvils[i].gravitySpeed = 0;
                      anvils[i].gravity = 0;
                      anvils[i].speedY = 0;
                      //Remove anvil from array
                      anvils.splice(i, 1);
                      if (slime.alive == true) {
                          textVars.score += 1;
                      }
                  }
                  //Collision detection of slime and anvil
                  if (anvils[i].x < slime.x + slime.width && anvils[i].x + anvils[i].width > slime.x && anvils[i].y < slime.y + slime.height && anvils[i].y + anvils[i].height > slime.y && anvils[i].y < 475) {
                      //Slime set to dead so therefore game over
                      slime.alive = false;
                  }
              }
          }
      }
      
      //Slime is dead and game over
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
