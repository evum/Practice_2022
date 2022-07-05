const numbers = [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const Console = console;
function logOperations(value, operator, control = 0) {
  switch (operator) {
    case 'AND':
      for (let i = 0; i < Object.keys(value); i += 1) {
        if (!value[i]) return 0;
      }
      return 1;

    case 'OR':
      for (let i = 0; i < Object.keys(value); i += 1) {
        if (value[i]) return 1;
      }
      return 0;

    case 'NOT':
      return !value;
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

export function counting(node) {
  if (node == null) return;
  for (let i = 0; i < Object.keys(node.rules); i += 1) {
    counting(node.rules[i]);
  }
  if (node.condition) {
    const mas = [];
    for (let i = 0; i < Object.keys(node.rules); i += 1) {
      mas.push(Number(node.rules[i].count));
    }
    node.count = logOperations(mas, 0, node.condition);
    Console.log('Name ', node.condition, 'count ', node.count);
  } else {
    node.count = logOperations(numbers[node.id], node.value, node.operator);
    Console.log('Dat ', node.field, 'count ', node.count);
  }
  return node.count;
}
