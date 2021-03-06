/**
 * Program main file.
 * Draw tree, add tooltips.
 */

import count from './count.js';
import tooltip from './tooltip.js';
import geometry from './geometry.js';

const { d3 } = window;
const Console = console;

let curScale = 1;
const duration = 5;
let alertSettings;
const jsonFile = 'data/cond.json';
let globalNodes;
const screen = {
  height: 700,
  width: 1300,
};

const treeDimensions = {
  width: 0,
  height: 0,
};
const x = {
  max: 0,
  min: 0,
};
const y = {
  max: 0,
  min: 0,
};

const tree = d3.tree()
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.25))
  .nodeSize([85, 79]);
const svg = d3.select('body')
  .append('svg')
  .attr('class', 'svg');
const gLink = svg.append('g')
  .attr('class', 'link');
const gNode = svg.append('g')
  .attr('class', 'node');
const transition = svg.transition().duration(duration);
const diagonal = d3.linkVertical().x((d) => d.x).y((d) => d.y);

d3.json('settings/alertSettings.json', (err, json) => {
  if (err) throw err;
  alertSettings = json;
});

/**
 * Draw static help display
 * @param {*} d - object, which data should be printed
 */
function bigHelperAdd(d) {
  d3.select('body')
    .append('foreignObject')
    .attr('class', 'bigHelper')
    .attr('id', d.id)
    .append('xhtml:body')
    .attr('class', 'bigHelperBody')
    .html(`Название: ${d.data.field} <br>
     Описание: ${d.data.description} <br> 
     Оператор: ${d.data.operator} <br>
     Контроль: ${d.data.value} <br>
     Результат: ${d.data.count} <br>
     Значение: ${d.data.number} <br>
     Тип значения: ${d.data.out}`);
  d3.select('body').select('.bigHelper')
    .append('img')
    .attr('src', 'icons/close.png')
    .on('click', () => d3.selectAll('.bigHelper').remove());
}

/**
 * Manage static help display
 * @param {*} d - object, which data should be printed
 */
function helpDisplay(d) {
  if (document.getElementById(d.id) !== null) {
    document.getElementById(d.id).remove();
  } else if (document.querySelectorAll('.bigHelper') !== null) {
    document.querySelectorAll('.bigHelper').forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
    bigHelperAdd(d);
  } else {
    bigHelperAdd(d);
  }
}

/**
 * Object to define collapse flag position
 */
const collapse = {
  x: (d) => {
    if (d.data.condition) return -5;
    return 0;
  },
  y: (d) => {
    switch (d.data.condition) {
      case 'AND':
        return -5;
      case 'OR':
        return -4;
      case 'NOT':
        return 20;
      case 'ANY':
        return 1;
      default:
        return 0;
    }
  },
};

/**
 * Add to nodes usefull information
 * @param {*} node - node, to which information added
 */
function nodeAdditions(node) {
  /* Drawing logic operators nodes */
  node.append('path')
    .attr('d', geometry.distribut)
    .attr('fill', 'white')
    .attr('class', (d) => {
      if (d.data.condition && d.data.count === '1') { return 'nodePath on'; }
      if (d.data.condition) { return 'nodePath off'; }
      return '';
    });

  /* Text on the logic nodes */
  node.append('text')
    .text((d) => {
      if (d.data.condition) { return d.data.condition; }
      return '';
    })
    .attr('x', (d) => { if (d.data.condition === 'OR') { return -9; } return -13; })
    .attr('y', (d) => {
      switch (d.data.condition) {
        case 'OR':
          return -5;
        case 'ANY':
          return -10;
        case 'NOT':
          return 15;
        default:
          return -13;
      }
    })
    .attr('class', 'condText');
  node.append('text')
    .text((d) => {
      if (d.data.condition === 'ANY') {
        let counterTrue = 0;
        let counter = 0;
        d.data.rules.forEach((item) => {
          if (item.count === '1') counterTrue += 1;
          counter += 1;
        });
        return `(${counterTrue} из ${counter})`;
      }
      return '';
    })
    .attr('class', 'anyValue')
    .attr('x', -19);

  /* Containers for all nodes, except logic  */
  const foreignObject = node.append('foreignObject')
    .attr('class', (d) => {
      if (d.data.field) { return 'dat'; }
      if (d.data.result) { return 'result'; }
      if (d.data.comment) { return 'com'; }
      return '';
    })
    .attr('width', (d) => {
      if (d.data.comment && d.parent.children !== null && d.parent.children.length > 1) return '84px';
      return '150px';
    })
    .attr('x', (d) => {
      if (d.data.comment && d.parent.children !== null && d.parent.children.length > 1) return '-42px';
      return '-75px';
    })
    .attr('style', (d) => {
      if (d.data.field && d.data.out === 'state') {
        const alertSet = alertSettings.state_info[d.data.alert];
        let borderColor;
        if (alertSet.color === 'white') borderColor = 'lightGrey';
        else borderColor = alertSet.color;
        return `border:1px solid ${borderColor}; `
          + `background-color:${alertSet.color}; `
          + `color:${alertSet.textColor}`;
      }
      if (d.data.field) {
        return 'border: 2px solid black; background-color: white';
      }
      return '';
    });

  /* Drawing div containers for all nodes, except logic */
  const divs = foreignObject.append('xhtml:div')
    .attr('class', (d) => {
      if (d.data.field) { return 'datDiv'; }
      if (d.data.result) { return 'resultDiv'; }
      if (d.data.comment) { return 'comDiv'; }
      return 'condDiv';
    })
    .attr('data-tooltip', tooltip.tooltipText);
  divs.append('text')
    .attr('data-tooltip', tooltip.tooltipText)
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
      return '';
    });

  /* Drawing additional section on sensors and results nodes */
  foreignObject.append('xhtml:div')
    .attr('data-tooltip', tooltip.tooltipText)
    .attr('class', (d) => { if (d.data.result) { return 'levelDiv'; } return 'descDiv'; })
    .append('text')
    .attr('data-tooltip', tooltip.tooltipText)
    .text((d) => {
      if (d.data.description && d.data.out === 'value') { return `value: ${d.data.number}\n${d.data.description}`; }
      if (d.data.description && d.data.out === 'state') { return `state: ${d.data.number}\n${d.data.description}`; }
      if (d.data.level) { return d.data.level; }
      return '';
    })
    .attr('class', (d) => {
      if (d.data.field) { return 'additionDatText'; }
      if (d.data.result) { return 'additionResText'; }
      return '';
    });

  /* Drawing node`s circle */
  node.append('circle')
    .attr('r', (d) => { if (d.data.field) { return 5; } return 0; })
    .attr('fill', (d) => { if (d.data.count === '1') { return 'red'; } return 'white'; })
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('class', 'circle');

  /* Add collapse flag to all uncollapsed nodes */
  node.append('foreignObject')
    .attr('class', (d) => { if (d.data.condition) return 'col'; return ''; })
    .attr('x', collapse.x)
    .attr('y', collapse.y)
    .attr('id', (d) => { if (d.data.condition) return d.id; return -1; })
    .append('xhtml:div')
    .attr('class', (d) => { if (d.children === null) return 'plus'; return 'minus'; });
}

/**
 * Function to set up general settings
 */
function settings() {
  globalNodes.eachBefore((node) => {
    if (node.y > y.max) y.max = node.y;
    if (node.x < x.min) x.min = node.x;
    if (node.x > x.max) x.max = node.x;
  });
  treeDimensions.height = y.max + 150;
  treeDimensions.width = Math.abs(x.min) + x.max + 100;
  svg.attr('width', treeDimensions.width);
  svg.attr('height', treeDimensions.height);
  gNode.attr('transform', `translate(${Math.abs(x.min) + 50}, ${60})`);
  gLink.attr('transform', `translate(${Math.abs(x.min) + 50}, ${60})`);
}

/**
 * Function to add collapse flag to collapsed/uncollapsed node
 * @param {*} node - which node was collapsed
 * @param {*} id - id of node
 */
function collapseAdd(node, id) {
  node.append('foreignObject')
    .attr('class', (d) => { if (d.data.condition) return 'col'; return ''; })
    .attr('x', collapse.x)
    .attr('y', collapse.y)
    .attr('id', id)
    .attr('name', (d) => {
      if (d.id !== id) return 'bad';
      return 'good';
    })
    .append('xhtml:div')
    .attr('class', (d) => { if (d.children === null) return 'plus'; return 'minus'; });
}

/**
 * General function for tree building
 * @param {*} source - data to draw tree
 */
function treeBuilding(source) {
  const nodes = globalNodes.descendants().reverse();
  const links = globalNodes.links();
  tree(globalNodes);
  settings();
  const node = gNode.selectAll('g')
    .data(nodes, (d) => d.id);
  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', `translate(${source.x},${source.y})`)
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .on('click', (d) => {
      const curD = d;
      if (curD.data.field) {
        helpDisplay(d);
      }
      if (curD.data.comment || curD.data.result || curD.data.field) {
        return;
      }
      if (curD.children === null) {
        curD.children = curD.tempChildren.slice();
      } else {
        curD.children = null;
      }

      const element = document.getElementById(curD.id);
      if (element !== null) {
        element.parentNode.removeChild(element);
      }

      collapseAdd(nodeEnter, curD.id);
      let elems = document.getElementsByName('bad');
      while (elems.length !== 0) {
        elems = document.getElementsByName('bad');
        elems.forEach((elem) => {
          elem.remove();
        });
      }
      treeBuilding(curD);
    });

  nodeAdditions(nodeEnter);

  const link = gLink.selectAll('path')
    .data(links, (d) => d.target.id);
  const linkEnter = link.enter().append('path')
    .attr('d', () => {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .attr('class', (d) => {
      if (d.target.data.count === '1' || (d.target.data.comment && d.target.children[0].data.count === '1')) return 'linkOn';
      return 'linkOff';
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

/**
 * Iteration function to realize nodes hiding
 * @param {*} node - node, which we check
 */
function hidingChildren(node) {
  const curNode = node;
  if (curNode.children) {
    curNode.children.forEach((child, index) => {
      if (child.data.count === '0') {
        curNode.children[index] = null;
      }
      if (child.data.comment !== undefined && child.children[0].data.count === '0') {
        curNode.children[index] = null;
      }
    });
  }
  if (curNode.children) {
    curNode.children = curNode.children.filter((element) => element !== null);
    if (curNode.children.length === 0) {
      curNode.children = null;
    }
  }
  if (curNode.children !== null && curNode.children !== undefined) {
    curNode.children.forEach((child) => {
      hidingChildren(child);
    });
  }
}

/**
 * Function to hide unactivated nodes
 */
function hiding() {
  hidingChildren(globalNodes);
  treeBuilding(globalNodes);
}

/**
 * Function to zoom page to screen size
 */

function zooming() {
  document.querySelector('.zoom').querySelector('img').remove();
  if (curScale !== 1) {
    curScale *= 1 / curScale;
    tooltip.setScale(curScale);
    document.querySelector('.svg').style.zoom = curScale;
    curScale = 1;
    d3.select('body').select('.zoom').append('img')
      .attr('src', 'icons/minimize.png');
  } else if (treeDimensions.height > treeDimensions.width) {
    curScale = screen.height / treeDimensions.height;
    tooltip.setScale(curScale);
    document.querySelector('.svg').style.zoom = curScale;
    d3.select('body').select('.zoom').append('img')
      .attr('src', 'icons/maximize.png');
  } else {
    curScale = screen.width / treeDimensions.width;
    tooltip.setScale(curScale);
    document.querySelector('.svg').style.zoom = curScale;
    d3.select('body').select('.zoom').append('img')
      .attr('src', 'icons/maximize.png');
  }
}

function deepEqual(children, tempChildren) {
  if (children === undefined || tempChildren === undefined) return true;
  if (children === null) return false;
  for (let i = 0; i < tempChildren.length; i += 1) {
    if (children[i] !== tempChildren[i]) return false;
  }
  return true;
}

function showingChildren(node) {
  const curNode = node;
  if (!deepEqual(curNode.children, curNode.tempChildren)) {
    curNode.children = null;
    document.getElementById(curNode.id).setAttribute('name', 'bad');
    const machineEvent = new Event('click', { bubbles: true });
    document.getElementById(curNode.id).dispatchEvent(machineEvent);
  }
  if (curNode.children) {
    curNode.children.forEach((child) => showingChildren(child));
  }
}

function showing() {
  showingChildren(globalNodes);
  document.querySelectorAll('.plus').forEach((flag) => flag.remove());
  treeBuilding(globalNodes);
}

/**
 * Function to start tree drawing
 */
function draw() {
  d3.select('body').append('div')
    .attr('class', 'zoom')
    .on('click', zooming)
    .append('img')
    .attr('src', 'icons/minimize.png');
  d3.select('body').append('div')
    .attr('class', 'hide')
    .on('click', hiding)
    .append('body')
    .html('Hide unactive');
  d3.select('body').append('div')
    .attr('class', 'show')
    .on('click', showing)
    .append('body')
    .html('Show all');
  d3.json(jsonFile, (err, json) => {
    if (err) {
      throw err;
    }
    count.counting(json);
    const nodes = d3.hierarchy(json, (d) => d.rules);
    globalNodes = nodes;
    globalNodes.descendants().forEach((d, i) => {
      const curD = d;
      curD.id = i;
      if (curD.children !== undefined) {
        curD.tempChildren = curD.children.slice();
      }
    });
    treeBuilding(globalNodes);
  });
}

draw();
