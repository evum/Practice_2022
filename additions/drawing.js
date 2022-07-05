/* eslint-disable no-undef */
import count from './count.js';

const Console = console;

function draw() {
  const lineLenght = 0;
  const margin = {
    top: 0, right: 320, bottom: 0, left: 30,
  };
  const fullWidth = 1300;
  const fullHeight = 700;
  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  const tree = d3.tree()
    .separation((a, b) => (a.parent === b.parent ? 1 : 1))
    .size([height, width]);
    // .nodeSize([30, 30]);

  const svg = d3.select('body')
    .append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  function drawing(context) {
    context.moveTo(10, 10); // move current point to ⟨10,10⟩
    context.lineTo(100, 10); // draw straight line to ⟨100,10⟩
    context.arcTo(150, 150, 300, 10, 40); // draw an arc, the turtle ends up at ⟨194.4,108.5⟩
    context.lineTo(300, 10); // draw straight line to ⟨300,10⟩
    // etc.
    return context;
  }
  const elbow = (d) => `M${d.source.y},${d.source.x}H${d.target.y},V${d.target.x}${d.target.children ? '' : `h${lineLenght}`}`;
  // const elbow = (d, i) =>
  // `M${d.source.y},${d.source.x}H${d.target.y},V${d.target.x}${d.target.children ? '' : 'h' +
  // lineLenght}`;
  d3.json('data/cond.json', (err, json) => {
    if (err) throw err;
    Console.log(json);
    count.counting(json);
    Console.log(json);

    const nodes = d3.hierarchy(json, (d) => d.rules);
    Console.log(nodes);
    const treeNodes = tree(nodes);
    const link = g.selectAll('.link')
      .data(treeNodes.links())
      .enter().append('path')
      .attr('class', 'link');
      // .attr("d", elbow);
    drawing(link);
    const node = g.selectAll('.node')
      .data(treeNodes.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .append('foreignObject')
      .attr('class', (d) => {
        if (d.data.condition) { return 'cond'; } return 'dat';
      })
      .attr('width', (d) => { if (d.data.condition === 'OR') { return '40'; } return 0; })
      .attr('x', (d) => { if (d.data.condition === 'OR') { return '-20'; } return 0; })
      // .attr("value", d =>
      // { return logOperations(numbers[d.data.id], d.data.value, d.data.operator) })
      .append('xhtml:div');

    node.append('text')
      .attr('x', (d) => { if (d.data.condition) { return 0; } return 10; })
      .text((d) => {
        if (d.data.condition) { return `${d.data.condition}Value: ${d.data.count}`; }
        return `${d.data.field}Value ${d.data.count}`;/* + "    value: " + numbers[d.data.id - 1]; */
      });
    /* node.append('circle')
        .attr("visibility", d => {if (d.data.condition) {return "visible"} else { return "hidden"}})
        .attr("r", 20)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "3") */
    /* node.append('rect')
        .attr("visibility", d => {if (d.data.condition) {return "hidden"} else { return "visible"}})
        .attr('height', 20)
        .attr('width', 50)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1")
        */

    /* node.append('circle')
        .attr("visibility", d => {if (d.data.condition) {return "visible"} else { return "hidden"}})
        .attr("r", 5)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "3") */

    /* node.append('text')
        .attr('x', 8)
        .attr('y', 8)
        .attr('dy', '.71em')
        .attr('class', 'about lifespan')
        .text(d => `${d.data.born} - ${d.data.died}`)

    node.append('text')
        .attr('class', 'about location')
        .attr('x', 8)
        .attr('y', 8)
        .attr('dy', '1.86em')
        .text(d => `${d.data.location}`) */
  });
}
draw();
