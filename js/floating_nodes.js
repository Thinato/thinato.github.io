let nodes = []
let vel = 10 
let red = 0
let red_adder = 1
let timer = 0
let drag = -1

function setup() {
    var canvas = createCanvas(windowWidth * 0.95, windowHeight);
    canvas.parent('floating_nodes_canvas')
    canvas.position(0,0)
    canvas.style('z-index', '-1')
    canvas.style('width', '100%')
    for (let i = 0; i < 20; i++){
        nodes[i] = {
            'x': mouseX,
            'y': mouseY,
            'velX': (Math.random() - 0.5) * 4,
            'velY': (Math.random() - 0.5) * 4,
        };
    }
  }
  
function draw() {
  noStroke();
  fill(0, 80);
  rect(0, 0, width, height);
  red += red_adder;
  if (red >= 255){
    red = 255
    red_adder *= -1
  } else if (red <= 0){
    red = 0
    red_adder *= -1
  }
  noFill()
  stroke(255,0,0)
//   circle(mouseX, mouseY, 200)
  for (let i = 0; i < nodes.length; i++){
    nodes[i].x += nodes[i].velX;
    nodes[i].y += nodes[i].velY;
    dist = Math.hypot(nodes[i].x - mouseX, nodes[i].y - mouseY)
    if (dist > 200){
        nodes[i].x = mouseX
        nodes[i].y = mouseY
    }
    for (let j = 0; j < nodes.length; j++) {
        dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
        if ( i != j && dist < 100){
            
            stroke(red, 255, 255, 255 - (dist * 255 / 100))
            line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
        }
    }
    // dist = Math.hypot(nodes[i].x - mouseX, nodes[i].y - mouseY)
    
    // fill(180-(dist * 180 / 200), 50, 0, 255-(dist * 255 / 200))
    // noStroke()
    // circle(nodes[i].x, nodes[i].y, 3-(dist * 3 / 500))
  }
}
