// eslint-disable-next-line import/extensions
import count from './count.js';
// eslint-disable-next-line import/extensions
import tooltipText from './tooltip.js';

const Console = console;

const jsonFile = 'data/cond.json';
let globalNodes;
const x = {
  max: 0,
  min: 0,
};
const y = {
  max: 0,
  min: 0,
};
// eslint-disable-next-line no-undef
const tree = d3.tree()
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.5))
  .nodeSize([85, 80]);

// eslint-disable-next-line no-undef
const svg = d3.select('body')
  .append('svg')
  .attr('class', 'svg');

const gLink = svg.append('g')
  .attr('class', 'link');

const gNode = svg.append('g')
  .attr('class', 'node');
// eslint-disable-next-line no-undef
const diagonal = d3.linkVertical().x((d) => d.x).y((d) => d.y);

function bigHelperAdd(d) {
  // eslint-disable-next-line no-undef
  d3.select('body').select('svg').select('.node')
    .append('foreignObject')
    .attr('class', 'bigHelper')
    .attr('id', d.data.id)
    .append('xhtml:body')
    .html(`Название: ${d.data.field} <br>
     Описание: ${d.data.description} <br> 
     Оператор: ${d.data.operator} <br>
     Значение: ${d.data.value} <br>
     Результат: ${d.data.count} <br>`);
}

function helpDisplay(d) {
  if (document.getElementById(d.data.id) !== null) {
    document.getElementById(d.data.id).remove();
  } else if (document.querySelectorAll('.bigHelper') !== null) {
    document.querySelectorAll('.bigHelper').forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
    bigHelperAdd(d);
  } else {
    bigHelperAdd(d);
  }
}

function nodeMove(node) {
  const curNode = node;
  if (curNode.children !== undefined && curNode.children !== null) {
    curNode.children.forEach((item) => {
      nodeMove(item);
    });
  }
  if (curNode.data.field) {
    curNode.parent.children.forEach((child) => {
      if (child.data.condition) {
        curNode.x -= 10;
        curNode.y -= 20;
      }
    });
  }
}

function nodeAdditions(node) {
  /* Общий круг узла */
  node.append('circle')
    .attr('r', 5)
    .attr('fill', (d) => { if (d.data.count === 1) { return 'red'; } return 'white'; })
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  /* Все узлы */
  const foreignObject = node.append('foreignObject')
    .attr('class', (d) => {
      if (d.data.condition && Number(d.data.count) === 1) { return 'cond on'; }
      if (d.data.condition) { return 'cond off'; }
      return 'dat';
    });
  const divs = foreignObject.append('xhtml:div')
    .attr('data-tooltip', tooltipText)
    .attr('class', (d) => { if (d.data.field) { return 'datDiv'; } return 'condDiv'; });
  divs.append('text')
    .attr('data-tooltip', tooltipText)
    .text((d) => {
      if (d.data.condition) { return d.data.condition; }
      return d.data.field;
    })
    .attr('class', (d) => { if (d.data.field) { return 'datText'; } return 'condText'; })
    .append('text')
    .text((d) => { if (d.data.description) { return `\n${d.data.description}`; } return ''; })
    .attr('class', (d) => { if (d.data.field) { return 'additionText'; } return ''; });

  foreignObject.append('xhtml:div')
    .attr('data-tooltip', tooltipText)
    .attr('class', 'helper')
    .on('click', helpDisplay)
    .append('text')
    .text((d) => { if (d.data.field) { return '?'; } return ''; });
}

function settings() {
  globalNodes.eachBefore((node) => {
    if (node.y > y.max) y.max = node.y;
    if (node.x < x.min) x.min = node.x;
    if (node.x > x.max) x.max = node.x;
  });
  const height = y.max + 100;
  const width = Math.abs(x.min) + x.max + 100;
  svg.attr('width', width);
  svg.attr('height', height);
  gNode.attr('transform', `translate(${Math.abs(x.min) + 60},${30})`);
  gLink.attr('transform', `translate(${Math.abs(x.min) + 60},${30})`);
  /* left = globalNodes;
  right = globalNodes;
  width = right.x - left.x + margin.left + margin.right;
  height = yMax + margin.top + margin.bottom + 100;
  */
}

function treeBuilding(source) {
  const nodes = globalNodes.descendants().reverse();
  const links = globalNodes.links();
  tree(globalNodes);
  settings();
  nodeMove(globalNodes);
  const node = gNode.selectAll('g')
    .data(nodes, (d) => d.id);
  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', `translate(${source.x},${source.y})`)
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .on('click', (d) => {
      const curD = d;
      curD.children = d.children ? null : curD.tempChildren;
      treeBuilding(d);
    });

  nodeAdditions(nodeEnter);

  const link = gLink.selectAll('path')
    .data(links, (d) => d.target.id);

  const linkEnter = link.enter().append('path')
    .attr('d', () => {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    });

  node.merge(nodeEnter)
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .attr('fill-opacity', 1)
    .attr('stroke-opacity', 1);
  node.exit().remove()
    .attr('transform', `translate(${source.y},${source.x})`)
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0);

  link.merge(linkEnter)
    .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().remove()
    .attr('d', () => {
      const o = { x: source.y, y: source.x };
      return diagonal({ source: o, target: o });
    });

  // Stash the old positions for transition.
  globalNodes.eachBefore((d) => {
    const curD = d;
    curD.x0 = d.x;
    curD.y0 = d.y;
  });
}

function draw() {
  // eslint-disable-next-line no-undef
  d3.json(jsonFile, (err, json) => {
    if (err) throw err;
    count.counting(json);
    // eslint-disable-next-line no-undef
    const nodes = d3.hierarchy(json, (d) => d.rules);
    globalNodes = nodes;
    globalNodes.descendants().forEach((d, i) => {
      const curD = d;
      curD.id = i;
      curD.tempChildren = curD.children;
    });
    treeBuilding(nodes);
  });
}

draw();
