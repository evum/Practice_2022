function or() {
  return `M${-20},${20}Q${0},${10} ${20},${20}L${0},${-20}Z`;
}

function and() {
  return `M${-20},${30}L${20},${30},L${20},${0}Q${0},${-20},${-20},${0}Z`;
}

function distribut(d) {
  if (d.data.condition === 'AND') return and();
  if (d.data.condition === 'OR') return or();
  return '';
}

export default { distribut, and, or };
