let img
function preload() {
  pixelDensity(1);
  img = loadImage('pup.jpeg');
}
async function setup() {
  createCanvas(256, 256);
  image(img, 0, 0, width, height);
  loadPixels();
  const quadtree = d3.quadtree();
  for(let i = 0; i < width; i++){
    for(let j = 0; j < height; j++){
      quadtree.add([i,j, get(i, j)])
    }
  }//
  bfs(quadtree)
}

async function bfs(tree){
  const queue = []
  queue.push([tree.root(), tree._x0, tree._y0, tree._x1, tree._y1])
  while(el = queue.shift()){
    const [node, x0, y0, x1, y1] = el
    setImage(node, x0, y0, x1, y1)
    //next five lines adapted from shorturl.at/pCFOZ
    if(node.length){
      const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2
      queue.push([node[0], x0, y0, xm, ym])
      queue.push([node[1], xm, y0, x1, ym])
      queue.push([node[2], x0, ym, xm, y1])
      queue.push([node[3], xm, ym, x1, y1])
    }
    await sleep(100)
  }
}

function setImage(node, x0, y0, x1, y1) {
  if(!node.length) {
    set(x1, y1, node.data[2])
    updatePixels()
    return
  }
  const avg = getAverage(node)
  for(let i = x0; i < x1; i++){
    for(let j = y0; j < y1; j++){
      set(i, j, avg)
    }
  }
  updatePixels()
}

function getAverage(node) {
  if(!node.length){
    return node.data[2]
  } else{
    const upper_left = getAverage(node[0])
    const upper_right = getAverage(node[1])
    const lower_left = getAverage(node[2])
    const lower_right = getAverage(node[3])
    return [parseInt((upper_left[0]+upper_right[0]+lower_left[0]+lower_right[0])/4),
           parseInt((upper_left[1]+upper_right[1]+lower_left[1]+lower_right[1])/4),
           parseInt((upper_left[2]+upper_right[2]+lower_left[2]+lower_right[2])/4),
           parseInt((upper_left[3]+upper_right[3]+lower_left[3]+lower_right[3])/4)]
  }
}

function sleep(ms){
  return new Promise(res=>setTimeout(res, ms))
}