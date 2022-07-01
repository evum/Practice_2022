function traverse(o) {
    for (i in o) {
        if (!!o[i] && typeof (o[i]) == "object") {
            if (!Array.isArray(o[i])) {
                if (o[i].condition) {
                    console.log(i, o[i].condition);
                    if (check(o)) {

                    }
                }
                else {
                    console.log(i, o[i].field);
                    o[i].count = logOperations(numbers[o[i].id], o[i].value, o[i].operator);
                    console.log(o[i].count);
                }
            }
            traverse(o[i]);
        }
    }
}

function check(o) {
    for (i in o) {
        if (!!o[i] && typeof (o[i]) == "object") {
            return false;
        }
    }
    return true;
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