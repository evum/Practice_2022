/**
 * File for counting results of logic operations
 */

/**
 * Function to count result of logic operations
 * @param {*} value - number to commpare
 * @param {*} operator - logic operator
 * @param {*} control  - control number
 * @returns operation result
 */
function logOperations(value, operator, control = 0) {
  let flag;
  let counter;
  const numberValue = Number(value);
  const numberControl = Number(control);
  switch (operator) {
    case 'AND':
      flag = 0;
      if (value.indexOf(0) === -1) flag = 1;
      return flag;

    case 'OR':
      flag = 0;
      value.forEach((item) => { if (item === 1) flag = 1; });
      return flag;
    case 'NOT':
      if (numberValue === 1) return 0;
      return 1;
    case 'ANY':
      counter = 0;
      flag = 0;
      Array.from(value).forEach((valueNum) => {
        if (valueNum) {
          counter += 1;
        }
      });
      if (counter >= numberControl) flag = 1;
      return flag;
    default:
      return -1;
  }
}

/**
 * Manage logic operations
 * @param {*} node - data to count
 * @returns result of operation
 */
function counting(node) {
  const curNode = node;
  if (curNode.rules === undefined || curNode.rules === null) {
    return;
  }
  curNode.rules.forEach((item) => {
    counting(item);
  });
  const mas = [];
  curNode.rules.forEach((item) => {
    if (item.comment) mas.push(Number(item.rules[0].count));
    else mas.push(Number(item.count));
  });
  if (curNode.value !== undefined) {
    curNode.count = String(logOperations(mas, curNode.condition, curNode.value));
  } else {
    curNode.count = String(logOperations(mas, curNode.condition));
  }
}

export default {
  logOperations, counting,
};
