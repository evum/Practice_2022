// eslint-disable-next-line import/extensions
import count from './count.js';

const Console = console;

const jsonFile = 'data/cond.json';

const y = {
  min: 0,
  max: 0,
};
const x = {
  min: 0,
  max: 0,
};

// eslint-disable-next-line no-undef
const tree = d3.tree()
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.5))
  .nodeSize([85, 80]);

// eslint-disable-next-line no-undef
const svg = d3.select('body')
  .append('svg')
  .attr('class', 'svg');

const elbow = (d) => {
  if (!d.target.hide) { return `M${d.source.y},${d.source.x},L${d.target.y},${d.target.x}`; }
  return '';
};

function findMax(nodes) {
  const curNodes = nodes;
  const temp = curNodes.x;
  curNodes.x = curNodes.y;
  curNodes.y = temp;
  if (curNodes.children === undefined) {
    if (curNodes.x > x.max) {
      x.max = curNodes.x;
    }
    if (curNodes.y > y.max) {
      y.max = curNodes.y;
    }
    if (curNodes.y < y.min) {
      y.min = curNodes.y;
    }
    curNodes.parent.children.forEach((child) => {
      if (child.data.condition) {
        curNodes.x -= 40;
        curNodes.y -= 10;
      }
    });
  } else {
    curNodes.children.forEach((item) => {
      findMax(item);
    });
  }
}

function redraw(nodes) {
}

function click(d) {
  const curD = d;
  Console.log('click ', d);
  if (d.children) {
    curD.tempChildren = d.children;
    curD.children = null;
  } else {
    curD.children = curD.tempChildren;
    curD.tempChildren = null;
  }
  redraw(d);
}

function treeBuilding(nodes) {
  const treeNodes = tree(nodes);
  findMax(nodes);
  const height = x.max + 100;
  const width = Math.abs(y.min) + y.max + 100;
  svg.attr('width', width);
  svg.attr('height', height);
  // svg.attr('width', findMax(nodes));
  const g = svg.append('g')
    .attr('transform', `translate(${Math.abs(y.min) + 60},${30})`);
  const link = g.selectAll('.link');

  link.data(treeNodes.links())
    .enter().append('path')
    .attr('class', 'link')
    .attr('stroke', 'red')
    .attr('d', elbow);

  const node = g.selectAll('.node')
    .data(treeNodes.descendants())
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`);

  /* Общий круг узла */
  node.append('circle')
    .attr('r', 5)
    .attr('fill', (d) => { if (d.data.count === 1) { return 'red'; } return 'white'; })
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
  /* Все узлы */
  node.append('foreignObject')
    .attr('class', (d) => {
      if (d.data.condition && Number(d.data.count) === 1) { return 'cond on'; }
      if (d.data.condition) { return 'cond off'; }
      return 'dat';
    })
    .append('xhtml:div')
    .attr('class', (d) => { if (d.data.field) { return 'datDiv'; } return 'condDiv'; })
    .append('text')
    .text((d) => {
      if (d.data.condition) { return d.data.condition; }
      return d.data.field;
    })
    .attr('class', (d) => { if (d.data.field) { return 'datText'; } return 'condText'; })
    .append('text')
    .text((d) => { if (d.data.description) { return `\n${d.data.description}`; } return ''; })
    .attr('class', (d) => { if (d.data.field) { return 'additionText'; } return ''; });
  node.selectAll('foreignObject').on('click', click);
}

function draw() {
  // eslint-disable-next-line no-undef
  d3.json(jsonFile, (err, json) => {
    if (err) throw err;
    count.counting(json);
    // eslint-disable-next-line no-undef
    const nodes = d3.hierarchy(json, (d) => d.rules);
    treeBuilding(nodes);
  });
}

draw();
