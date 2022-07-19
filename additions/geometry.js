function or() {
  return `M${-20},${20}Q${0},${10} ${20},${20}L${0},${-20}Z`;
}

function and() {
  return `M${-20},${30}L${20},${30},L${20},${0}Q${0},${-20},${-20},${0}Z`;
}

function not() {
  return `M${-25},${10}C${-25},${30},${25},${30},${25},${10}C${25},${-8},${-25},${-8},${-25},${10}`;
}

function any() {
  return `M${-35},${10}C${-35},${30},${35},${30},${35},${10}C${35},${-8},${-35},${-8},${-35},${10}`;
}

function collapseFlagDraw(d) {
  if (d.children === null && d.data.condition === 'OR') return `M${0},${20}L${0},${30}M${-5},${25}L${5},${25}`;
  if (d.children === null) return `M${0},${35}L${0},${45}M${-5},${40}L${5},${40}`;
  /* if (d.children !== null && d.data.condition === 'OR') return `M${-5},${-7}L${5},${-7}`;
  if (d.children !== null && d.data.condition) return `M${-5},${20}L${5},${20}`; */
  return '';
}

function distribut(d) {
  if (d.data.condition === 'AND') return and();
  if (d.data.condition === 'OR') return or();
  if (d.data.condition === 'NOT') return not();
  if (d.data.condition === 'ANY') return any();
  return '';
}

export default {
  distribut, and, or, not, any, collapseFlagDraw,
};
