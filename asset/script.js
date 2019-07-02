//


const BOX_SIZE = 500;
const BOX_WIRE_THICKNESS = 5;
const TEXT_SIZE = 80;
const TEXT_WIRE_THICKNESS = 5;
const BALL_SIZE = 80;
const BALL_WIRE_THICKNESS = 30;
const BALL_COUNT = 15;

const BOX_WIRE_COLOR = "hsl(0, 0%, 20%)";
const TEXT_WIRE_COLOR = "hsl(0, 0%, 20%)";
const BALL_SATURATION = "50%";
const BALL_LIGHTNESS = "60%";

const BOX_ROTATE_SPEED = 0.004;
const BALL_MOVE_SPEED = 0.01;
const BALL_ROTATE_SPEED = 0.02;

const HUE_RANGE = 60;
const MUTATE_POSSIBILITY = 0.02;

const BOX_ELEMENT = document.querySelector(".box");
const BALL_ELEMENT = document.querySelector(".ball");

const BALLS = [];
const BOX_ROOT = new Zdog.Anchor({});
const BALL_ROOT = new Zdog.Anchor({});

function init() {
  Zfont.init(Zdog);
}

function createBox() {
  let font = new Zdog.Font({
    src: "https://cdn.jsdelivr.net/gh/jaames/zfont/demo/fredokaone.ttf"
  });
  let box = new Zdog.Anchor({
    addTo: BOX_ROOT
  });
  let text = new Zdog.Text({
    addTo: box,
    stroke: TEXT_WIRE_THICKNESS,
    fontSize: TEXT_SIZE,
    font: font,
    value: "OMOCHI",
    textAlign: "center",
    textBaseline: "middle",
    color: TEXT_WIRE_COLOR,
    fill: false
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

function createRoot() {
  let rotatePos = objectMap({x: 0, y: 0, z: 0}, (value) => Math.random() * Zdog.TAU);
  let rotateVel = objectMap({vx: 0, vy: 0, vz: 0}, (value) => Math.random() * BOX_ROTATE_SPEED * 2 - BOX_ROTATE_SPEED);
  BOX_ROOT.rotate.x = rotatePos.x;
  BOX_ROOT.rotate.y = rotatePos.y;
  BOX_ROOT.rotate.z = rotatePos.z;
  BOX_ROOT.rotate.vx = rotateVel.vx;
  BOX_ROOT.rotate.vy = rotateVel.vy;
  BOX_ROOT.rotate.vz = rotateVel.vz;
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
      color: "hsl(" + Math.round(hue) + ", " + BALL_SATURATION + ", " + BALL_LIGHTNESS + ")"
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
    let translateVel = objectMap({vx: 0, vy: 0, vz: 0}, (value) => Math.random() * BALL_MOVE_SPEED * 2 - BALL_MOVE_SPEED);
    let rotatePos = objectMap({x: 0, y: 0, z: 0}, (value) => Math.random() * Zdog.TAU);
    let rotateVel = objectMap({vx: 0, vy: 0, vz: 0}, (value) => Math.random() * BALL_ROTATE_SPEED * 2 - BALL_ROTATE_SPEED);
    let translate = Object.assign(translatePos, translateVel);
    let rotate = Object.assign(rotatePos, rotateVel);
    let hue = Math.random() * HUE_RANGE + baseHue;
    if (Math.random() < MUTATE_POSSIBILITY) {
      hue += 180;
    }
    let ball = go(translate, rotate, hue % 360);
    BALLS.push(ball);
  }
}

function create() {
  createBox();
  createRoot();
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
    root.rotate.x += BOX_ROOT.rotate.vx;
    root.rotate.y += BOX_ROOT.rotate.vy;
    root.rotate.z += BOX_ROOT.rotate.vz;
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

init();
create();
animate();