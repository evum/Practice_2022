function or() {
  return `M${-20},${20}Q${0},${10} ${20},${20}L${0},${-20}Z`;
}

function and() {
  return `M${-20},${30}L${20},${30},L${20},${0}Q${0},${-20},${-20},${0}Z`;
}

function not() {
  return `M${-25},${7}C${-25},${30},${25},${30},${25},${7}C${25},${-11},${-25},${-11},${-25},${7}`;
}

function distribut(d) {
  if (d.data.condition === 'AND') return and();
  if (d.data.condition === 'OR') return or();
  if (d.data.condition === 'NOT') return not();
  return '';
}

export default {
  distribut, and, or, not,
};
