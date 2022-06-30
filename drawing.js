/*function draw(){
	var width = 700;
	var height = 700;
	// 1 Выберите ширину и высоту области рисования svg, установленной на странице, добавьте элемент g, чтобы установить положение
	var svg = d3.select('body')
		.append('svg')
		.attr('width',width)
		.attr('height',height)
		.append('g')
		.attr('transform','translate(50,0)');
	// 2 Создание макета дерева и установка размера
	var tree = d3.layout.tree()
		.size([width,height-200])

	// Генератор трех диагоналей
	var diagonal = d3.svg.diagonal()
		.projection(d=>[d.y,d.x])
	// 4 запроса данных
	d3.json("data.json", function(error, root) {
	// 1 Получить массив узлов и массив соединений
		var nodes = tree.nodes (root); // Получить всю информацию об узлах
		var links = tree.links (nodes); // Получить коллекцию информации о подключении узла
	
	// 2 Создаем соединение
		var link = svg.selectAll('.link')
			.data(links)
			.enter()
			.append('path')
			.attr('class','link')
			.attr('d',diagonal)

	// 3 Сгенерировать узел
		var node = svg.selectAll('.node')
			.data(nodes)
			.enter()
			.append('g')
			.attr('class','node')
			.attr('transform',function(d){
				return "translate(" + d.y + "," + d.x + ")";
		});

	// 4 Добавляем круг к узлу, чтобы задать радиус 
		node.append('circle')
			.attr('r',4.5);


	// 5 Добавляем текст в узел, устанавливаем позицию стиля текста
		node.append("text")
			.attr ("dx", function (d) {return d.children? -15: 15;}) // Определить смещение оси x для отображения текста
			.attr ("dy", 10) // определяем смещение оси y для отображения текста
			.style ("text-anchor", function (d) {return d.children? "end": "start";}) // Отображение выравнивания текста
			.attr('class','text')
			.text(function(d) { return d.name; });
	});
}





//draw();*/