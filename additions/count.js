function logOperations(value, operator, control = 0) {
  let flag;
  let counter;
  const numberValue = Number(value);
  const numberControl = Number(control);
  switch (operator) {
    case 'AND':
      flag = 1;
      value.forEach((item) => { if (item === 0) flag = 0; });
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
    case '<':
      if (value < control) { return 1; } return 0;
    case '>':
      if (numberValue > numberControl) { return 1; } return 0;
    case '==':
      if (numberValue === numberControl) { return 1; } return 0;
    case 'in':
      flag = 0;
      Array.from(control).forEach((item) => { if (numberValue === Number(item)) { flag = 1; } });
      return flag;
    default:
      return -1;
  }
}

function counting(node) {
  const curNode = node;
  if (curNode.rules == null) {
    curNode.count = logOperations(curNode.number, curNode.operator, curNode.value);
    return;
  }
  curNode.rules.forEach((item) => {
    counting(item);
  });
  const mas = [];
  curNode.rules.forEach((item) => {
    mas.push(Number(item.count));
  });
  if (curNode.value !== undefined) {
    curNode.count = logOperations(mas, curNode.condition, curNode.value);
  } else {
    curNode.count = logOperations(mas, curNode.condition);
  }
}

export default {
  logOperations, counting,
};
