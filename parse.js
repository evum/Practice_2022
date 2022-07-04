/*function counting(data) {
    for (i in data) {
        if (data[i].field) {
            result = data[i].born;
            console.log(result);
            return result;
        }
        else if (typeof(result) != "undefined") {
            result =    ;
            data[i].count = result;
            return result;
        }
        else {
            counting(data[i]);
        }
    }
    return data;
}*/

































/*
function traverse(o) {
    if (o !== null && typeof o == "object") {
        Object.entries(o).forEach(([key, value]) => {
            if (value.field) {
                value.count = logOperations(numbers[value.id], value.value, value.operator);
            }
            else if (value.condition && check(value)) {
                value.count = 1;
            }
            // key is either an array index or object key
            traverse(value);
        });
    }
    /*
    for (i in o) {
        if (!!o[i] && typeof (o[i]) == "object") {
            if (o[i].condition) {
                o[i].count = 1;
                if (check(o)) {
                    o[i].count = 1;
                    console.log(o[i].condition)
                }
            }
            else if (o[i].field) {
                o[i].count = logOperations(numbers[o[i].id], o[i].value, o[i].operator);
            }
            traverse(o[i]);
        }
    }*/
/*    return o;
}



function check(o) {
    var i = 0;
    Object.entries(o).forEach(([key, value]) => {
        if (!value.count) {
            i++;
        }
    })
    if (i > 0) {
        return false;
    }
    else { return true };
}

function counting(data) {
    var i = 0;
    while (i < 5) {
        data = traverse(data);
        i += 1;
    }
    console.log(data);
    data.count = 1;
    return data;
}

/*
function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
	var data = JSON.parse(reader.result);
    console.log(data);
	//draw(heroes);
	//console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}
*/