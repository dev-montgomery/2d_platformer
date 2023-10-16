const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100
    };

    this.velocity = {
      x: 0,
      y: 0
    };
    
    this.width = 30;
    this.height = 30;
  };

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  };

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    };
  };
};

class Platform {
  constructor() {
    this.position = {
      x: 200,
      y: 800
    }

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

const platform = new Platform();

function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platform.draw();

  if (keys.right.pressed) {
    player.velocity.x = 6;
  } else if (keys.left.pressed) {
    player.velocity.x = -6;
  } else {
    player.velocity.x = 0;
  };

  if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x + player.width <= platform.position.x + platform.width) {
    player.velocity.y = 0;
  }
};

animate();

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
      player.velocity.y -= 12;
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