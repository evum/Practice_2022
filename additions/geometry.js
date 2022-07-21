/**
 * Function to generate "or" path
 * @returns path
 */
function or() {
  return `M${-20},${10}Q${0},${-10} ${20},${10}L${0},${-40}Z`;
}

/**
 * Function to generate "and" path
 * @returns path
 */
function and() {
  return `M${-20},${0}L${20},${0},L${20},${-30}Q${0},${-50},${-20},${-30}Z`;
}

/**
 * Function to generate "not" path
 * @returns path
 */
function not() {
  return `M${-25},${10}C${-25},${30},${25},${30},${25},${10}C${25},${-8},${-25},${-8},${-25},${10}`;
}

/**
 * Function to generate "any" path
 * @returns path
 */
function any() {
  return `M${-35},${-10}C${-35},${10},${35},${10},${35},${-10}C${35},${-28},${-35},${-28},${-35},${-10}`;
}

/**
 * Function to distribut pathes
 * @param {*} d - node
 * @returns path for this node
 */
function distribut(d) {
  if (d.data.condition === 'AND') return and();
  if (d.data.condition === 'OR') return or();
  if (d.data.condition === 'NOT') return not();
  if (d.data.condition === 'ANY') return any();
  return '';
}

export default {
  distribut, and, or, not, any,
};
