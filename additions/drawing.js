function draw() {
    const lineLenght = 0;
    const margin = { top: 0, right: 320, bottom: 0, left: 30 };
    const fullWidth = 1300;
    const fullHeight = 700;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    const tree = d3.tree()
        .separation((a, b) => (a.parent === b.parent ? 1 : 1))
        .size([height, width]);
        //.nodeSize([30, 30]);

    const svg = d3.select("body")
        .append("svg")
        .attr("width", fullWidth)
        .attr("height", fullHeight);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const elbow = (d, i) => `M${d.source.y},${d.source.x}H${d.target.y},V${d.target.x}${d.target.children ? '' : 'h' + lineLenght}`;
    d3.json("1.json", (err, json) => {
        if (err) throw err;
        console.log(json);
        counting(json);
        console.log(json);

        const nodes = d3.hierarchy(json, (d) => d.rules);
        console.log(nodes);
        const treeNodes = tree(nodes);
    
        const link = g.selectAll(".link")
            .data(treeNodes.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", elbow);

        
        const node = g.selectAll(".node")
            .data(treeNodes.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .append("foreignObject")
            .attr("class", d => {
                if (d.data.condition) { return "cond" }
                else { return "dat" }
            })
            .attr("width", d => { if (d.data.condition == "OR") { return "40" } })
            .attr("x", d => { if (d.data.condition == "OR") { return "-20" } })
            //.attr("value", d => { return logOperations(numbers[d.data.id], d.data.value, d.data.operator) })
            .append("xhtml:div");

        node.append("text")
            .attr("x", d => { if (d.data.condition) { return 0; } else { return 10; } })
            .text(d => {
                if (d.data.condition) { return d.data.condition + "Value: " + d.data.count; }
                else { return d.data.field + "Value " + d.data.count;/*+ "    value: " + numbers[d.data.id - 1];*/ }
            });
        /*node.append('circle')
            .attr("visibility", d => {if (d.data.condition) {return "visible"} else { return "hidden"}})
            .attr("r", 20)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "3")*/
        /*node.append('rect')
            .attr("visibility", d => {if (d.data.condition) {return "hidden"} else { return "visible"}})
            .attr('height', 20)
            .attr('width', 50)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "1")
            */

        /*node.append('circle')
            .attr("visibility", d => {if (d.data.condition) {return "visible"} else { return "hidden"}})
            .attr("r", 5)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "3")*/

        /*node.append('text')
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
            .text(d => `${d.data.location}`)*/
    });
}
draw();