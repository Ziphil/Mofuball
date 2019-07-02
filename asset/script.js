//


const BOX_SIZE = 500;
const BOX_WIRE_THICKNESS = 5;
const BALL_SIZE = 80;
const BALL_WIRE_THICKNESS = 30;
const BALL_COUNT = 15;

const BOX_WIRE_COLOR = "#555555";

const BOX_ROTATE_SPEED = {x: -0.003, y: 0.002, z: 0.001};
const BALL_ROTATE_SPEED = {x: 0.003, y: -0.002, z: -0.001};

const BOX_ELEMENT = document.querySelector(".box");
const BALL_ELEMENT = document.querySelector(".ball");

const BALLS = [];
const BOX_ROOT = new Zdog.Anchor({});
const BALL_ROOT = new Zdog.Anchor({});

function createBox() {
  let box = new Zdog.Anchor({
    addTo: BOX_ROOT
  });
  let go = (start, end) => {
    let scaledStart = objectMap(start, (value) => value * BOX_SIZE / 2);
    let scaledEnd = objectMap(end, (value) => value * BOX_SIZE / 2);
    let wire = new Zdog.Shape({
      addTo: box,
      stroke: BOX_WIRE_THICKNESS,
      path: [scaledStart, scaledEnd],
      color: BOX_WIRE_COLOR,
    });
    return wire;
  }
  go({x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1});
  go({x: -1, y: 1, z: 1}, {x: 1, y: 1, z: 1});
  go({x: -1, y: -1, z: 1}, {x: -1, y: 1, z: 1});
  go({x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1});
  go({x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1});
  go({x: -1, y: 1, z: -1}, {x: 1, y: 1, z: -1});
  go({x: -1, y: -1, z: -1}, {x: -1, y: 1, z: -1});
  go({x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1});
  go({x: -1, y: -1, z: 1}, {x: -1, y: -1, z: -1});
  go({x: -1, y: 1, z: 1}, {x: -1, y: 1, z: -1});
  go({x: 1, y: -1, z: 1}, {x: 1, y: -1, z: -1});
  go({x: 1, y: 1, z: 1}, {x: 1, y: 1, z: -1});
}

function createBalls() {
  let go = (translate, rotate, hue) => {
    let scaledTranslate = objectMap(translate, (value) => value * BOX_SIZE / 2);
    let ball = new Zdog.Ellipse({
      addTo: BALL_ROOT,
      diameter: BALL_SIZE,
      stroke: BALL_WIRE_THICKNESS,
      translate: scaledTranslate,
      rotate: rotate,
      color: "hsl(" + Math.round(hue) + ", 60%, 50%)"
    });
    ball.translate.vx = scaledTranslate.vx;
    ball.translate.vy = scaledTranslate.vy;
    ball.translate.vz = scaledTranslate.vz;
    ball.rotate.vx = rotate.vx;
    ball.rotate.vy = rotate.vy;
    ball.rotate.vz = rotate.vz;
    return ball;
  }
  let baseHue = Math.random() * 360;
  for (let i = 0 ; i < BALL_COUNT ; i ++) {
    let translatePos = objectMap({x: 0, y: 0, z: 0}, (value) => Math.random() * 2 - 1);
    let translateVel = objectMap({vx: 0, vy: 0, vz: 0}, (value) => Math.random() * 0.02 - 0.01);
    let rotatePos = objectMap({x: 0, y: 0, z: 0}, (value) => Math.random() * Zdog.TAU);
    let rotateVel = objectMap({vx: 0, vy: 0, vz: 0}, (value) => Math.random() * 0.04 - 0.02);
    let translate = Object.assign(translatePos, translateVel);
    let rotate = Object.assign(rotatePos, rotateVel);
    let hue = Math.random() * 60 + baseHue;
    if (Math.random() < 0.05) {
      hue += 180;
    }
    let ball = go(translate, rotate, hue % 360);
    BALLS.push(ball);
  }
}

function create() {
  createBox();
  createBalls();
}

function renderRoot(root, element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  root.renderGraphSvg(element);
}

function render() {
  renderRoot(BOX_ROOT, BOX_ELEMENT);
  renderRoot(BALL_ROOT, BALL_ELEMENT);
}

function updateBox() {
  for (let root of [BOX_ROOT, BALL_ROOT]) {
    root.rotate.x += BOX_ROTATE_SPEED.x;
    root.rotate.y += BOX_ROTATE_SPEED.y;
    root.rotate.z += BOX_ROTATE_SPEED.z;
    root.updateGraph();
  }
}

function updateBalls() {
  for (let ball of BALLS) {
    let limit = BOX_SIZE / 2 - BALL_SIZE / 2;
    let translate = ball.translate;
    let rotate = ball.rotate;
    translate.x += translate.vx;
    translate.y += translate.vy;
    translate.z += translate.vz;
    rotate.x += rotate.vx;
    rotate.y += rotate.vy;
    rotate.z += rotate.vz;
    if (translate.x >= limit) {
      translate.x = limit;
      translate.vx = -translate.vx;
    }
    if (translate.x <= -limit) {
      translate.x = -limit;
      translate.vx = -translate.vx;
    }
    if (translate.y >= limit) {
      translate.y = limit;
      translate.vy = -translate.vy;
    }
    if (translate.y <= -limit) {
      translate.y = -limit;
      translate.vy = -translate.vy;
    }
    if (translate.z >= limit) {
      translate.z = limit;
      translate.vz = -translate.vz;
    }
    if (translate.z <= -limit) {
      translate.z = -limit;
      translate.vz = -translate.vz;
    }
    ball.updateGraph();
  }
}

function update() {
  updateBox();
  updateBalls();
}

function animate() {
  update();
  render();
  requestAnimationFrame(animate);
}

function objectMap(object, operation) {
  let newObject = Object.keys(object).reduce((result, key) => {
    result[key] = operation(object[key]);
    return result;
  }, {});
  return newObject;
}

create();
animate();