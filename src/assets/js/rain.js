let canvas, ctx, DPR, wind_anger;
let hasBounce, maxNum, numLevel, speed, wind_direction, drop_chance, gravity;
let speed_x, speed_y;
let mySpeed, myAngle;
let windX = 1;
let angle = [];
let drops = [],
  bounces = [];
let image;  
let eachAnger = 0.017453293;
let rafID = 0;

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 30);
  };

export function Rain(opts) {
  // options = opts;
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.zIndex = 1000;
  canvas.style.pointerEvents = "None";
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx = canvas.getContext("2d");
  DPR = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * DPR;
  canvas.height = canvas.clientHeight * DPR;

  speed = opts.speed || [10, 100]; 
  mySpeed = new getBetween(3)
  myAngle = new getBetween(1.5)
  hasBounce = opts.hasBounce == undefined ? true : opts.hasBounce; 

  var wind_max = 270 + Math.atan(canvas.width / canvas.height) / eachAnger;
  var wind_min = 270 - Math.atan(canvas.width / canvas.height) / eachAnger;
  angle[0] = wind_min + 20;
  angle[1] = wind_max - 20;

  if (opts.wind_direction > wind_max) {
    wind_direction = wind_max;
  } else if (opts.wind_direction < wind_min) {
    wind_direction = wind_min;
  } else {
    wind_direction = opts.wind_direction || 270;
  }
  maxNum = opts.maxNum || 1000;
  numLevel = opts.numLevel || 10;
  drop_chance = opts.drop_chance || 0.1; 
  gravity = opts.gravity || 0.163; 

  setStyle();
  window.addEventListener("resize", onWindowResize, false);
  rafID = window.requestAnimFrame(update);
  if (opts.cloud) {
    image = new Image()
    image.onload = init
    image.src = 'https://luckyclover.top/static/cloud.png'
  }

  this.clearRain = ()=>{
    document.body.removeChild(canvas);
    window.removeEventListener("resize", onWindowResize);
    window.cancelAnimationFrame(rafID);
  }
}


function setStyle() {
  ctx.lineWidth = 1.5 * DPR;
  ctx.fillStyle = "rgba(223,223,223,0.6)";
}

function update() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let i = drops.length;
  while (i--) {
    let drop = drops[i];
    drop.update();

    if (drop.pos.y >= canvas.height) {

      if (hasBounce) {
        let n = Math.round(4 + Math.random() * 4);
        while (n--) bounces.push(new Bounce(drop.pos.x, canvas.height));
      }

      drops.splice(i, 1);
    }
    drop.draw();
  }

  if (hasBounce) {
    i = bounces.length;
    while (i--) {
      let bounce = bounces[i];
      bounce.update();
      bounce.draw();
      if (bounce.pos.y > canvas.height) bounces.splice(i, 1);
    }
  }

  let a = angle[0] + myAngle.get() * (angle[1] - angle[0]) / 100
  let s = speed[0] + mySpeed.get() * (speed[1] - speed[0]) / 100
  if (drops.length < maxNum) {
    if (Math.random() < drop_chance) {
        let len = numLevel;
      for (let i = 0; i < len; i++) {
        drops.push(new Drop(a, s));
      }
    }
  }


  rafID = window.requestAnimFrame(update);
}

function onWindowResize() {
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  canvas.width = canvas.clientWidth * DPR;
  canvas.height = canvas.clientHeight * DPR;
  setStyle();
}

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};


Vector.prototype.add = function(v) {
  if (v.x != null && v.y != null) {
    this.x += v.x;
    this.y += v.y;
  } else {
    this.x += v;
    this.y += v;
  }
  return this;
};

Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
};

var Drop = function(a, s) {

  // var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;
  wind_direction = a;
  var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;

  if (edge >= 0) {
    this.pos = new Vector(Math.random() * (canvas.width + edge), 0);
  } else {
    this.pos = new Vector(Math.random() * (canvas.width - edge) + edge, 0);
  }


  this.speed = (s) * DPR;

  this.prev = this.pos;

  wind_anger = wind_direction * eachAnger;

  speed_x = this.speed * Math.cos(wind_anger);
  windX = speed_x
 
  speed_y = -this.speed * Math.sin(wind_anger);

  this.vel = new Vector(speed_x, speed_y);
};


Drop.prototype.update = function() {
  this.prev = this.pos.copy();

  if (gravity) {
    this.vel.y += gravity;
  }
  this.pos.add(this.vel);
  this.setStyle();
};

Drop.prototype.setStyle = function() {
  var color = ctx.createLinearGradient(
    this.prev.x,
    this.prev.y,
    this.pos.x,
    this.pos.y
  );
  color.addColorStop(0, "rgba(0,0,0,0");
  color.addColorStop(0.5, "rgba(223,223,223,0.6)");
  ctx.strokeStyle = color;
};

Drop.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.prev.x, this.prev.y);
  ctx.lineTo(this.pos.x, this.pos.y);
  ctx.stroke();
};

var Bounce = function(x, y) {
  var dist = Math.random() * 7;
  var angle = Math.PI + Math.random() * Math.PI;
  this.pos = new Vector(x, y);
  this.radius = 0.2 + Math.random() * 0.8;
  this.vel = new Vector(Math.cos(angle) * dist, Math.sin(angle) * dist);
};

Bounce.prototype.update = function() {
  this.vel.y += gravity;
  this.vel.x *= 0.95;
  this.vel.y *= 0.95;
  this.pos.add(this.vel);
};

Bounce.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius * DPR, 0, Math.PI * 2);
  ctx.fill();
};

var getBetween = function(s) {
  this.s = s;
  this.value = 50;
};

getBetween.prototype.get = function() {
  let d = 1 + Math.random() * -2;
  d *= this.s;
  this.value += d;
  if (this.value > 100 || this.value < 0) {
    this.value -= 1.1 * d;
  }
  return this.value;
};


// wind
class Cloud {
    constructor(props) {
        this.x = 0
        this.y = 0
        this.xpos = 0
        this.ypos = 0
        this.zpos = 0
        this.scaleX = 1
        this.scaleY = 1
        this.visible = true
        Object.assign(this, props)
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scaleX, this.scaleY)
        ctx.drawImage(this.image, 0, 0, 256, 120)
        ctx.restore()
    }
}


function init() {
  let canvas2 = document.createElement("canvas");
  document.body.appendChild(canvas2);
  canvas2.style.position = "absolute";
  canvas2.style.top = 0;
  canvas2.style.left = 0;
  // canvas2.style.zIndex = 1;
  canvas2.style.pointerEvents = "None";
  canvas2.style.width = window.innerWidth + "px";
  canvas2.style.height = 135 + "px";
  const width = canvas2.width = canvas2.clientWidth * DPR;
  const height = canvas2.height = canvas2.clientHeight * DPR;
  const ctx = canvas2.getContext('2d')
  const clouds = createCloud(24)
  const fl = 1000


  function createCloud(nums) {
      const clouds = []
      while (nums--) {
          clouds.push(new Cloud({
              image,
              xpos: Math.random() * width * 2 - width,
              ypos: Math.random() * height - 2 * height / 3,
              zpos: Math.random() * 400 - 200
          }))
      }
      return clouds
  }

  function translateX(cloud) {
      let x1 = cloud.xpos + windX * 0.02
      if (x1 > width)
        x1 = - width
      else if (x1 < - width)
        x1 = width
      cloud.xpos = x1
  }


  function setPerspective(cloud) {

      if (cloud.zpos > -fl) {
          const scale = fl / (fl + cloud.zpos) 
          cloud.scaleX = cloud.scaleY = scale
          cloud.x = width / 2 + cloud.xpos * scale
          cloud.y = cloud.ypos * scale
          cloud.visible = true
      } else {
          cloud.visible = false
      }
  }


  function move(cloud) {
      translateX(cloud)
      setPerspective(cloud)
  }

  function zsort(a, b) {
      return b.zpos - a.zpos
  }

  function draw(cloud) {
      if (cloud.visible && cloud.x < width) {
          cloud.draw(ctx)
      }
  }

  (function drawFrame() {
      window.requestAnimationFrame(drawFrame)
      ctx.clearRect(0, 0, width, height)
      clouds.sort(zsort)
      clouds.forEach(move)
      clouds.forEach(draw)
  })()
}
