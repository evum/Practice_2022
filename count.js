var numbers = [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];


function logOperations(value, control = 0, operator) {
    switch (operator) {
        case "AND":
            return value && control;
            break;
        case "OR":
            return value || control;
            break;
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