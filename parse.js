async function populate() {

      const requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
      const request = new Request(requestURL);

      const response = await fetch(request);
      const superHeroesText = await response.text();

      const superHeroes = JSON.parse(superHeroesText);
	  console.log(superHeroes);
	  console.log(superHeroes.members);
	}
populate();



function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(typeof(reader.result));
	//console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}
function print(result) {
		for (var i = 0; i < jsonData.squadName.length; i++) {
		var counter = jsonData.squadName[i];
		console.log(homeTown);
	}
}