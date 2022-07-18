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
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.25))
  .nodeSize([85, 79]);

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
     Контроль: ${d.data.value} <br>
     Результат: ${d.data.count} <br>
     Значение: ${d.data.number} <br>
     Тип значения: ${d.data.out}`);
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

function borderColoring(d) {
  if (d.data.field) {
    switch (d.data.alert) {
      case '0':
        return '1px solid blue';
      case '1':
        return '1px solid green';
      case '2':
        return '1px solid yellow';
      case '3':
        return '1px solid red';
      case '4':
        return '1px solid darkRed';
      case '5':
        return '1px solid Gainsboro';
      case '6':
        return '1px solid black';
      case '7':
        return '1px solid LightGray';
      default:
        return '1px solid white';
    }
  }
  return '';
}

function backColoring(d) {
  if (d.data.field) {
    switch (d.data.alert) {
      case '0':
        return 'LightSkyBlue';
      case '1':
        return 'LightGreen';
      case '2':
        return 'Gold';
      case '3':
        return 'DarkRed';
      case '4':
        return 'Red';
      case '5':
        return 'DarkGray';
      case '6':
        return 'black';
      case '7':
        return 'white';
      default:
        return 'white';
    }
  }
  return '';
}

function textColoring(d) {
  if (d.data.alert === '6' || d.data.alert === '3') return 'LightGrey';
  return 'black';
}

function nodeAdditions(node) {
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
      if (d.data.condition) { return d.data.condition; }
      return '';
    })
    .attr('x', (d) => { if (d.data.condition === 'OR') { return -8; } return -13; })
    .attr('y', (d) => {
      if (d.data.condition === 'OR' || d.data.condition === 'ANY') return 10;
      return 13;
    })
    .attr('class', 'condText');
  node.append('text')
    .text((d) => { if (d.data.condition === 'ANY') { return `(${d.data.value})`; } return ''; })
    .attr('class', 'anyValue')
    .attr('y', 20)
    .attr('x', -7);
  /* Конейнеры для всех узлов, кроме логических  */
  const foreignObject = node.append('foreignObject')
    .attr('class', (d) => {
      if (d.data.field) { return 'dat'; }
      if (d.data.result) { return 'result'; }
      if (d.data.comment) { return 'com'; }
      return '';
    })
    .attr('style', (d) => `border:${borderColoring(d)}; background-color:${backColoring(d)}; color:${textColoring(d)}`);
  /* Отрисовка текста + div для всех узлов, кроме логических */
  const divs = foreignObject.append('xhtml:div')
    .attr('class', (d) => {
      if (d.data.field) { return 'datDiv'; }
      if (d.data.result) { return 'resultDiv'; }
      if (d.data.comment) { return 'comDiv'; }
      return 'condDiv';
    })
    .attr('data-tooltip', tooltipText)
    .on('click', (d) => { if (d.data.field) return helpDisplay; return ''; });
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
    .attr('data-tooltip', tooltipText)
    .attr('class', (d) => { if (d.data.result) { return 'levelDiv'; } return 'descDiv'; })
    .on('click', helpDisplay)
    .append('text')
    .attr('data-tooltip', tooltipText)
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
  /* Общий круг узла */
  node.append('circle')
    .attr('r', (d) => { if (d.data.field) { return 5; } return 0; })
    .attr('fill', (d) => { if (d.data.count === 1) { return 'red'; } return 'white'; })
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('class', 'circle');
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
    })
    .attr('style', (d) => {
      if (d.target.data.count === 1 || (d.target.data.comment && d.target.children[0].data.count === 1)) return 'stroke:red';
      return 'stroke:#ccc';
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

  link.exit().remove()
    .attr('d', () => {
      const o = { x: source.y, y: source.x };
      return diagonal({ source: o, target: o });
    });

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
