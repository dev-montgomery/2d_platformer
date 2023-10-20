// Adding Image Assets
const spriteSheet = {
  warrior: new Image(),
  sky: new Image(),
  mountains: new Image(),
  bgtrees: new Image(),
  fgtrees: new Image(),
  ground: new Image()
};

spriteSheet.warrior.src = './assets/female_warrior.png';
spriteSheet.sky.src = './assets/5_sky.png';
spriteSheet.mountains.src = './assets/4_mountains.png';
spriteSheet.bgtrees.src = './assets/3_bg_trees.png';
spriteSheet.fgtrees.src = './assets/2_fg_trees.png';
spriteSheet.ground.src = './assets/1_ground.png';
spriteSheet.warrior.onload = animate;

// Canvas 2d Context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = 550;

const gravity = 0.8;

// Create Player
class Player {
  constructor() {
    this.position = {
      x: 200,
      y: 440
    };

    this.velocity = {
      x: 0,
      y: 0
    };
    
    this.frames = 0;
    this.characterWidth = 80;
    this.characterHeight = 80;

    this.sprites = {
      stand: {
        right: 0,
        left: 41
      },
      run: {
        right : 81,
        left: 121
      },
      jump: {
        right: 161,
        left: 201
      }
    };

    this.currentSprite = this.sprites.stand.right
  };

  draw() {
    c.drawImage(
      spriteSheet.warrior,
      this.frames * 40, 
      this.currentSprite, 
      40, 
      40,
      this.position.x,
      this.position.y,
      this.characterWidth,
      this.characterHeight
    )
  };

  update() {
    this.frames = (this.frames + 1) % 24;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // Gravity
    if (this.position.y + 20 + this.characterHeight + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    };
  };
};

// Create Background
class Scenery {
  constructor({x, y, image}) {
    this.position = {
      x,
      y
    },

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  };

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  };
};

// class Platform {
//   constructor({x, y}) {
//     this.position = {
//       x,
//       y,
//     },

//     this.width = 200;
//     this.height = 20;
//   };

//   draw() {
//     c.fillStyle = '#333';
//     c.fillRect(this.position.x, this.position.y, this.width, this.height);
//   };
// };

let scrollOffset = 0;

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  },
  up: {
    pressed: false
  }
};

const parallax = [
  new Scenery({x: 0, y: 0, image: spriteSheet.sky}), 
  new Scenery({x: 0, y: 0, image: spriteSheet.mountains}), 
  new Scenery({x: 0, y: 0, image: spriteSheet.bgtrees}), 
  new Scenery({x: 0, y: 0, image: spriteSheet.fgtrees}), 
  new Scenery({x: 0, y: 0, image: spriteSheet.ground}),
  new Scenery({x: canvas.width, y: 0, image: spriteSheet.ground})
];

const player = new Player();

// const platforms = [new Platform({x: 200, y: 450}), new Platform({x: 500, y: 370}), new Platform({x: 650, y: 300})];

function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  parallax.forEach(scenery => {
    scenery.draw();
  });  
  
  // platforms.forEach(platform => {
  //   platform.draw();
  // });
  
  player.update();
  
  // 2D Scroller Effect
  if (keys.right.pressed  && player.position.x < 400) {
    player.velocity.x = 20;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -20;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed && scrollOffset < canvas.width * 4) {
      scrollOffset += 20;
      // platforms.forEach(platform => {
      //   platform.position.x -= 20;
      // });
      parallax.forEach((scene, index) => {
        scene.position.x -= (6 + (index * 2));
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 20;
      // platforms.forEach(platform => {
      //   platform.position.x += 20;
      // });
      parallax.forEach((scene, index) => {
        scene.position.x += (6 + (index * 2));
      });
    };
  };

  // Platform Collision
  // platforms.forEach(platform => {
  //   if (player.position.y + player.characterHeight <= platform.position.y && player.position.y + player.characterHeight + player.velocity.y >= platform.position.y && player.position.x + player.characterWidth >= platform.position.x && player.position.x + player.characterWidth <= platform.position.x + platform.width) {
  //     player.velocity.y = 0;
  //   }
  // });

  // End of level
  const endGame = document.createElement('div');
  endGame.classList.add('fade-in');
  document.body.appendChild(endGame);
  
  endGame.textContent = '...the prince is in an other forest!';
  endGame.style.position = 'absolute';
  endGame.style.top = '20%';
  endGame.style.right = '10%';
  endGame.style.color = '#fff';
  endGame.style.fontSize = '2rem';
  endGame.style.opacity = 0;
  
  const fadeIn = document.querySelector('.fade-in');

  if (scrollOffset > 3000) {
    fadeIn.style.opacity = 1;
    fadeIn.style.transition = 'opacity 1s ease-in-out';
  };
};

// Character Movement
addEventListener('keydown', ({ key }) => {
  switch(key) {
    case 'a': 
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left;
      break;
    case 'd': 
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
    break;
    case 'w': 
      if (player.velocity.y === 0) {
        player.velocity.y -= 12;
        keys.up.pressed = true;
      }
      // Fix animation while holding keys down
      if(keys.right.pressed) {
        player.currentSprite = player.sprites.jump.right;
      } else if (keys.left.pressed) {
        player.currentSprite = player.sprites.jump.left;
      }
      break;
  };
});

addEventListener('keyup', ({ key }) => {
  switch(key) {
    case 'a': 
      keys.left.pressed = false;
      if (!keys.right.pressed) player.currentSprite = player.sprites.stand.left;
      break;
    case 'd': 
      keys.right.pressed = false;
      if (!keys.left.pressed) player.currentSprite = player.sprites.stand.right;
      break;
    case 'w': 
      keys.up.pressed = false;
      break;
  };
});