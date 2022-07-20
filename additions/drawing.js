// eslint-disable-next-line import/extensions
import count from './count.js';
// eslint-disable-next-line import/extensions
import tooltipText from './tooltip.js';
// eslint-disable-next-line import/extensions
import geometry from './geometry.js';

const Console = console;

const duration = 5;
let alertSettings;
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

// eslint-disable-next-line no-undef
d3.json('settings/alertSettings.json', (err, json) => {
  if (err) throw err;
  alertSettings = json;
  Console.log(alertSettings.state_info);
});
Console.log(alertSettings);


function bigHelperAdd(d) {
  // eslint-disable-next-line no-undef
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
}

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

const collapse = {
  x: (d) => {
    if (d.data.condition) return -5;
    return 0;
  },
  y: (d) => {
    if (d.data.condition === 'AND') return -5;
    if (d.data.condition === 'OR') return -4;
    if (d.data.condition === 'NOT') return 20;
    if (d.data.condition === 'ANY') return 1;
    return 0;
  },
};

function nodeAdditions(node) {
  /* Отрисовка узлов логических операторов */
  node.append('path')
    .attr('d', geometry.distribut)
    .attr('fill', 'white')
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
    .attr('x', (d) => { if (d.data.condition === 'OR') { return -9; } return -13; })
    .attr('y', (d) => {
      if (d.data.condition === 'OR') return -5;
      if (d.data.condition === 'ANY') return -10;
      if (d.data.condition === 'NOT') return 15;
      return -13;
    })
    .attr('class', 'condText');
  node.append('text')
    .text((d) => {
      if (d.data.condition === 'ANY') {
        let counterTrue = 0;
        let counter = 0;
        d.data.rules.forEach((item) => {
          if (item.count === 1) counterTrue += 1;
          counter += 1;
        });
        return `(${counterTrue} из ${counter})`;
      }
      return '';
    })
    .attr('class', 'anyValue')
    .attr('x', -19);

  /* Контейнеры для всех узлов, кроме логических  */
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
      if (d.data.field) {
        return `border:${alertSettings.state_info[d.data.alert].color}; background-color:${alertSettings.state_info[d.data.alert].color}; color:${alertSettings.state_info[d.data.alert].textColor}`;
      }
      return '';
    });

  /* Отрисовка текста + div для всех узлов, кроме логических */
  const divs = foreignObject.append('xhtml:div')
    .attr('class', (d) => {
      if (d.data.field) { return 'datDiv'; }
      if (d.data.result) { return 'resultDiv'; }
      if (d.data.comment) { return 'comDiv'; }
      return 'condDiv';
    })
    .attr('data-tooltip', tooltipText);
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
      return '';
    });

  /* Отрисовка дополниельной секции текста на начальных узлах и датчиках */
  foreignObject.append('xhtml:div')
    .attr('data-tooltip', tooltipText)
    .attr('class', (d) => { if (d.data.result) { return 'levelDiv'; } return 'descDiv'; })
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

  /* Проход по всем развёрнутым узлам */
  node.append('foreignObject')
    .attr('class', (d) => { if (d.data.condition) return 'col'; return ''; })
    .attr('x', collapse.x)
    .attr('y', collapse.y)
    .attr('id', (d) => { if (d.data.condition) return d.id; return -1; })
    .append('xhtml:div')
    .attr('class', (d) => { if (d.children === null) return 'plus'; return 'mines'; });
  /* .append('text')
    .attr('class', 'collapseFlag')
    .text((d) => {
      if (d.children === null) return '+';
      if (d.data.condition) return '-';
      return '';
    })
    .attr('x', 0)
    .attr('y', -12); */
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

function collapseAdd(node, id) {
  node.append('foreignObject')
    .attr('class', (d) => { if (d.data.condition) return 'col'; return ''; })
    .attr('x', collapse.x)
    .attr('y', collapse.y)
    .attr('id', (d) => {
      if (d.id !== id) return -1;
      return id;
    })
    .append('xhtml:div')
    .attr('class', (d) => { if (d.children === null) return 'plus'; return 'mines'; });
}

function treeBuilding(source) {
  const nodes = globalNodes.descendants().reverse();
  const links = globalNodes.links();
  tree(globalNodes);
  settings();
  // nodeMove(globalNodes);
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
      curD.children = d.children ? null : curD.tempChildren;

      const element = document.getElementById(`${curD.id}`);
      element.parentNode.removeChild(element);

      collapseAdd(nodeEnter, curD.id);

      let notEnough = true;
      while (notEnough) {
        const elem = document.getElementById('-1');
        if (elem === null) {
          notEnough = false;
          break;
        }
        elem.remove();
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
