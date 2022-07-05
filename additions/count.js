const numbers = [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const Console = console;
function logOperations(value, operator, control = 0) {
  let flag;
  switch (operator) {
    case 'AND':
      flag = 1;
      value.forEach(function(item) {
        if (!item) flag = 0;
      });
      return flag;

    case 'OR':
      flag = 0;
      value.forEach(function(item) {
        if (item) flag = 1;
      });
      return flag;

    case 'NOT':
      if (value == 1) return 0;
      return 1;
    case '<':
      if (value < control) { return 1; } return 0;
    case '>':
      if (value > control) { return 1; } return 0;
    case '==':
      if (value === control) { return 1; } return 0;
    case 'in':
      for (let i = 0; i < Object.keys(value); i += 1) {
        if (value === control[i]) {
          return 1;
        }
      }
      return 0;
    default:
      return -1;
  }
}

function counting(node) {
  const curNode = node;
  if (curNode.rules == null) {
    curNode.count = logOperations(numbers[curNode.id], curNode.operator, curNode.value);
    Console.log('Dat ', curNode.field, 'count ', curNode.count);
    return;
  }
  curNode.rules.forEach(function(item, i, arr) {
    counting(item);
  });
  const mas = [];
  curNode.rules.forEach(function(item, i, arr) {
    mas.push(Number(item.count));
  });
  
  curNode.count = logOperations(mas, curNode.condition);
  Console.log('Name ', curNode.condition, 'count ', curNode.count);
}

export default {
  numbers, logOperations, counting,
};
