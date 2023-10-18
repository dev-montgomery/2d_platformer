const spriteSheet = new Image();
spriteSheet.src = './assets/female_warrior.png';
spriteSheet.onload = animate;

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 400
    };

    this.velocity = {
      x: 0,
      y: 0
    };
    
    this.frames = 0;
    this.frameWidth = 40;
    this.frameHeight = 40;
    this.characterWidth = 80;
    this.characterHeight = 80;
  };

  draw() {
    c.drawImage(
      spriteSheet,
      this.frames * this.frameWidth, 
      0, 
      this.frameWidth, 
      this.frameHeight,
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
    
    if (this.position.y + this.characterHeight + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    };
  };
};

class Platform {
  constructor({x, y}) {
    this.position = {
      x,
      y,
    },

    this.width = 200;
    this.height = 20;
  }

  draw() {
    c.fillStyle = '#333';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};

let scrollOffset = 0;

const platforms = [new Platform({x: 200, y: 450}), new Platform({x: 500, y: 370}), new Platform({x: 650, y: 250})];

function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  platforms.forEach(platform => {
    platform.draw();
  });
  player.update();

  // Scrolling Effect
  if (keys.right.pressed  && player.position.x < 400) {
    player.velocity.x = 6;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -6;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach(platform => {
        platform.position.x -= 6;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach(platform => {
        platform.position.x += 6;
      });
    }
  };

  // Platform Collision
  platforms.forEach(platform => {
    if (player.position.y + player.characterHeight <= platform.position.y && player.position.y + player.characterHeight + player.velocity.y >= platform.position.y && player.position.x + player.characterWidth >= platform.position.x && player.position.x + player.characterWidth <= platform.position.x + platform.width) {
      player.velocity.y = 0;
    }
  });

  // End of level
  if (scrollOffset > 2000) {

  }
};

// Character Movement
addEventListener('keydown', ({ key }) => {
  switch(key) {
    case 'a': 
      keys.left.pressed = true;
      break;
    case 's': 
      break;
    case 'd': 
      keys.right.pressed = true;
      break;
    case 'w': 
      if (player.velocity.y === 0) player.velocity.y -= 12;
      break;
  };
});

addEventListener('keyup', ({ key }) => {
  switch(key) {
    case 'a': 
      keys.left.pressed = false;
      break;
    case 's': 
      break;
    case 'd': 
      keys.right.pressed = false;
      break;
    case 'w': 
      break;
  };
});