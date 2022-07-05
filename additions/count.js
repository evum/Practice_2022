var numbers = [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];


function logOperations(value, control = 0, operator) {
    switch (operator) {
        case "AND":
            for (i in value) {
                if (!value[i]) {
                    return 0;
                    break;
                }
            }
        case "OR":
            for (i in value) {
                if (value[i]) {
                    return 1;
                    break;
                }
            }
        case "NOT":
            return !value;
            break;
        case "<":
            if (value < control) { return 1 } else { return 0 };
            break;
        case ">":
            if (value > control) { return 1 } else { return 0 };
            break;
        case "==":
            if (value == control) { return 1 } else { return 0 };
            break;
        case "in":
            for (con in control) {
                if (value == control[con]) {
                    return 1;
                }
            }
            return 0;
            break;
    }
}

function counting(node) {
    if (node == null) return;
    for (i in node.rules) {
        counting(node.rules[i]);
    }
    if (node.condition) {
        var mas = [];
        for (i in node.rules) {
            mas.push(Number(node.rules[i].count));
        }
        node.count = logOperations(mas, 0, node.condition);
        console.log("Name ", node.condition, "count ", node.count);
    }
    else {
        node.count = logOperations(numbers[node.id], node.value, node.operator);
        console.log("Dat ", node.field, "count ", node.count);
    }
    return node.count;

}
