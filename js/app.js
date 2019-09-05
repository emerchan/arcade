
// The code for the game
let Game = function() {
/*
  INSTANTIATE PLAYER AND ENE 
*/
    // Place the player object in a variable called player
    this.player = new Player(200, 400);

    // Place all enemy objects in an array called allEnemies
    const bug_1 = new Enemy(40, 'enemy-bug.png');
    const bug_2 = new Enemy(130, 'Rock.png');
    const bug_3 = new Enemy(220, 'enemy-bug.png');
    this.allEnemies = [bug_1, bug_2, bug_3];

    // Start Score
    this.score = 0;

    // Start Level 
    this.level = 0; 
};

// Every time player goes to next level, looses a life or 
// the score is increased the Game Top Panel is updated
Game.prototype.updateTopPanel = function() {
    // Update Level
    const level = document.querySelector('.level-number');
    level.innerHTML = this.level;
    // Update Lives
    const livesContainer = document.getElementById('lives_container');
    livesContainer.innerHTML = "";
    for(let i = 0; i < this.player.lives; i++){
        const lifeIcon = document.createElement('i');
        lifeIcon.setAttribute("class", "fa fa-thumbs-up heart-lives");
        livesContainer.appendChild(lifeIcon);
    }

    // Update Score
    const playerScore = document.querySelector('.points');
    playerScore.innerHTML = this.player.points;
};

Game.prototype.startGettingInput = function(){
    const input = function(direction){
        arcadeGame.player.handleInput(direction);
    }
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        const allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        input(allowedKeys[e.keyCode]);
    });


};



// Changes on Game when next level happens
Game.prototype.goToNextLevel = function(){
    // Level is increased
    this.level++;
    // Enemies became faster
    for (let i = 0; i < this.allEnemies.length; i++) {
        this.allEnemies[i].goToNextLevel();
    };
    // Top Panel is updated    
    this.updateTopPanel();
};


// When Player looses all lifes the Game Over Screen shows up
Game.prototype.showGameOverScreen = function() {
    const gameOverScreen = document.querySelector('#gameOverScreen');
    gameOverScreen.classList.add('show');

    // Shows Final Score
    const finalScore = document.querySelector('.points-finalScore');
    finalScore.innerHTML = this.player.points;

    // Shows Level
    const finalLevel = document.querySelector('.points-level');
    finalLevel.innerHTML = this.level;

    // Button that enables to Play Again
    const buttonPlayAgain = document.querySelector('#playAgain');
    buttonPlayAgain.focus();
    buttonPlayAgain.addEventListener('click', function() {
        gameOverScreen.classList.remove('show');
        arcadeGame.reset();
    });
};

// Used on button "Try Again" to restart the game and return to its initial state
Game.prototype.reset = function() {
    this.level = 0;
    this.player.reset();
    for(let i = 0; i < this.allEnemies.length; i++){
        this.allEnemies[i].reset();
    }
    this.updateTopPanel();

};

/*
 ENEMY CODE 
*/
// Enemies our player must avoid
let Enemy = function(y, imagename) {
    // Variables applied to each of our instances go here,

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    
    this.sprite = 'images/' + imagename;
    this.y = y;
    this.reset();
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // https://discussions.udacity.com/t/how-do-i-define-the-enemys-speed/185100
    this.x = this.x + (this.speed * dt);
    
    // When enemy reachs the right boundary it gets a new "X" position
    if (this.x > 506) {
        this.x = -100;
    }
};

// Based on: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

Enemy.prototype.reset = function(){
    this.speed = getRandomInt(50, 150);
    this.x = getRandomInt(0,500);
};

Enemy.prototype.goToNextLevel = function() {
    this.speed+= getRandomInt(30,100);
    this.x = getRandomInt(0,500);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// When enemy and player collision happen = they occupy the same space
Enemy.prototype.checkCollisions = function() {
    const player = arcadeGame.player;
    // Check if enemy and player are at same line
    if (this.y === player.y) {
        // Check if enemy and player are touching horizontaly
        const enemyRightSideX = this.x + 101;
        const playerRightSideX = player.x + 101;
        if((enemyRightSideX > player.x) && !(playerRightSideX < this.x)){
            player.hit();
            
        }
    } 
};


/*
  PLAYER CONSTRUCTOR 
*/
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    // Variables applied to each of our instances go here,

    // The image/sprite for the player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    
    // Lives at Start
    this.lives = 5;

    // Points of Score 
    this.points = 0;

    this.backToInitialPosition();
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Player.prototype.reset = function() {
    this.lives = 5;
    this.points = 0;
    this.backToInitialPosition();
};

Player.prototype.backToInitialPosition = function(){
    this.x = 200;
    this.y = 400;
};

// When Player have a collision with Enemy 
Player.prototype.hit = function(){
    this.backToInitialPosition();

    // Decrease lives when hit the Enemy
    this.lives--;

    arcadeGame.updateTopPanel();

    // Game Over Screen shows up when Player has no more lives 
    if (this.lives === 0) {
        arcadeGame.showGameOverScreen();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// When Player reaches the "Water Block"
Player.prototype.goToNextLevel = function(){
    this.backToInitialPosition();
    // Score is increased
    this.points+= 10;
    // A new level starts
    arcadeGame.goToNextLevel();
};

// Handle direction of Player
Player.prototype.handleInput = function(key) {
    // Top end 
    if (key === 'up') {
        this.y -= 90;

        // Check if Player reaches the Water Block 
        if(this.y === -50) {
            this.goToNextLevel();
        }
    } else if (key === 'down') {
        this.y += 90;

        // Bottom end 
        if(this.y === 490) {
            this.y = 400;
        }
    } else if (key === 'left') {
        this.x -= 100;

        // Left end 
        if (this.x === -100) {
            this.x = 0;
        } 
    } else if (key === 'right') {
        this.x += 100;

        // Right end
        if (this.x === 500) {
            this.x = 400;
        }
    }
};


const arcadeGame = new Game();


// Game Start with Start Screen
window.onload = function() {
   arcadeGame.startGettingInput();
   arcadeGame.updateTopPanel();

}