// eslint-disable-next-line import/extensions
import count from './count.js';
// eslint-disable-next-line import/extensions
import tooltipText from './tooltip.js';
// eslint-disable-next-line import/extensions
import geometry from './geometry.js';

const Console = console;
const duration = 5;

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
  .nodeSize([85, 78]);

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
const transition = svg.transition().duration(duration);

function bigHelperAdd(d) {
  // eslint-disable-next-line no-undef
  d3.select('body')
    .append('foreignObject')
    .attr('class', 'bigHelper')
    .attr('id', d.data.id)
    .append('xhtml:body')
    .attr('class', 'bigHelperBody')
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
    .attr('r', (d) => { if (d.data.field) { return 5; } return 0; })
    .attr('fill', (d) => { if (d.data.count === 1) { return 'red'; } return 'white'; })
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  /* Отрисовка узлов логических операторов */
  node.append('path')
    .attr('d', geometry.distribut)
    .attr('class', (d) => {
      if (d.data.condition && Number(d.data.count) === 1) { return 'nodePath on'; }
      if (d.data.condition) { return 'nodePath off'; }
      return '';
    });
  /* Текст на узлах логических операторов */
  node.append('text')
    .text((d) => {
      if (d.data.condition) { return d.data.condition; }
      return '';
    })
    .attr('x', (d) => { if (d.data.condition === 'OR') { return -8; } return -13; })
    .attr('y', (d) => { if (d.data.condition === 'OR') { return 10; } return 13; })
    .attr('class', 'condText');
  /* Конейнеры для всех узлов, кроме логических  */
  const foreignObject = node.append('foreignObject')
    .attr('class', (d) => {
      if (d.data.field) { return 'dat'; }
      if (d.data.result) { return 'result'; }
      if (d.data.comment) { return 'com'; }
      return '';
    });
  /* Отрисовка текста + div для всех узлов, кроме логических */
  const divs = foreignObject.append('xhtml:div')
    .attr('data-tooltip', tooltipText)
    .attr('class', (d) => {
      if (d.data.field) { return 'datDiv'; }
      if (d.data.result) { return 'resultDiv'; }
      if (d.data.comment) { return 'comDiv'; }
      return 'condDiv';
    });
  divs.append('text')
    .attr('data-tooltip', tooltipText)
    .text((d) => {
      if (d.data.condition) { return d.data.condition; }
      if (d.data.result) { return d.data.result; }
      if (d.data.comment) { return d.data.comment; }
      return d.data.field;
    })
    .attr('class', (d) => {
      if (d.data.field) { return 'datText'; }
      if (d.data.result) { return 'resultText'; }
      if (d.data.comment) { return 'comText'; }
      return 'condText';
    });
  /* Отрисовка дополниельной секции текста на начальных узлах и датчиков */
  foreignObject.append('xhtml:div')
    .attr('class', (d) => { if (d.data.result) { return 'levelDiv'; } return 'descDiv'; })
    .append('text')
    .text((d) => {
      if (d.data.description) { return `\n${d.data.description}`; }
      if (d.data.level) { return d.data.level; }
      return '';
    })
    .attr('class', (d) => {
      if (d.data.field) { return 'additionDatText'; }
      if (d.data.result) { return 'additionResText'; }
      return '';
    });
  /* Добавление подсказки - знака вопроса на узлах датчиков */
  foreignObject.append('xhtml:div')
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
  const height = y.max + 150;
  const width = Math.abs(x.min) + x.max + 100;
  svg.attr('width', width);
  svg.attr('height', height);
  gNode.attr('transform', `translate(${Math.abs(x.min) + 50},${60})`);
  gLink.attr('transform', `translate(${Math.abs(x.min) + 50},${60})`);
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
      if (curD.comment) {
        return;
      }
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

  node.merge(nodeEnter).transition(transition)
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .attr('fill-opacity', 1)
    .attr('stroke-opacity', 1);
  node.exit().remove()
    .attr('transform', `translate(${source.y},${source.x})`)
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0);

  link.merge(linkEnter).transition(transition)
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
