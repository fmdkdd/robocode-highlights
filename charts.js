function robotBarChart(tsvData, robot, options, tiers) {
	options = options || {};
	var barWidth = options.barWidth || 400;
	var leftMargin = options.leftMargin || 150;
	var rightMargin = options.rightMargin || 20;

	var barHeight = options.barHeight || 500;
	var topMargin = options.topMargin || 40;
	var bottomMargin = options.bottomMargin || 20;

	var width = leftMargin + barWidth + rightMargin;
	var height = topMargin + barHeight + bottomMargin;

	var relativeInterspace = options.relativeInterspace || .2;

	var svg = d3.select("body").append("svg")
		.attr("class", "chart")
		.attr("width", width)
		.attr("height", height);

	d3.select('body').on('keydown', function() {
		// 't' key
		if (d3.event.which == 84) {
			var bars = d3.selectAll('g.bar');
			bars.call(toggleVisibility);
		}
	});

	function toggleVisibility(bar) {
		var scoreMax = bar.select('.inline.scores');
		var robotScores = bar.select('g');
		var visible = scoreMax.attr("visibility") == "visible" || scoreMax.attr("visibility") == null;
		if (visible) {
			scoreMax.attr("visibility", "hidden");
			robotScores.attr("visibility", "visible");
		} else {
			scoreMax.attr("visibility", "visible");
			robotScores.attr("visibility", "hidden");
		}
	}

	d3.tsv(tsvData, function(error, data) {
		var namedData = [];

		for (var previousName = "", i = 0; i < data.length; ++i) {
			namedData[i] = Object.create(data[i]);
			if (namedData[i].Nom === "")
				namedData[i].Nom = previousName;
			else
				previousName = namedData[i].Nom;
		}

		var xValue = function(d) { return d[robot]; };
		var deviation = function(d) { return d[robot + ' dev.']; };
		var yValue = function(d) { return d.Nom; };
		var namedRows = function(d) { return !!d.Nom; };

		var x = d3.scale.linear()
			.domain([0, 100])
			.range([0, barWidth]);

		var y = d3.scale.ordinal()
			.domain(data.filter(namedRows).map(yValue))
			.rangeRoundBands([topMargin, topMargin + barHeight], relativeInterspace);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (leftMargin - 5) + ",0)")
			.call(yAxis);

		tiers.domain().forEach(function(score) {
			svg.append("line")
				.attr("class", tiers(score))
				.attr("x1", x(score) + leftMargin)
				.attr("x2", x(score) + leftMargin)
				.attr("y1", topMargin)
				.attr("y2", topMargin + barHeight);

			svg.append("text")
				.attr("class", "tiers")
				.attr("x", x(score) + leftMargin)
				.attr("y", topMargin + barHeight)
				.attr("dy", 10)
				.attr("text-anchor", "middle")
				.text(score);
		});

		data.filter(namedRows).forEach(function(row, i) {
			var score = Math.max.apply(this,
												namedData.filter(function(d) { return row.Nom === d.Nom; })
												.map(function(d) {
													return Math.min(100, (parseFloat(xValue(d)) + parseFloat(deviation(d)))) || 0;
												}));
												// .map(function(d) { return parseFloat(d) || 0; }));

			score = score.toPrecision(4);

			var g = svg.append("g")
				.attr("class", "bar");

			var barMax = g.append("rect")
				.attr("class", tiers(score))
				.attr("x", leftMargin)
				.attr("width", x(score))
				.attr("y", y(yValue(row)))
				.attr("height", y.rangeBand());

			var scoreMax = g.append("text")
				.attr("class", "inline scores")
				.attr("x", leftMargin + Math.max(20, x(score) - 2))
				.attr("y", y(yValue(row)))
				.attr("dy", y.rangeBand() / 2)
				.attr("dominant-baseline", "middle")
				.attr("text-anchor", "end")
				.text(score);

			var robotScores = g.append("g")
				.attr("visibility", "hidden");

			namedData
				.filter(function(d) { return row.Nom === d.Nom; })
				.forEach(function(row, i, array) {
					var score = xValue(row);

					robotScores.append("rect")
						.attr("class", tiers(score))
						.attr("x", leftMargin)
						.attr("width", x(score))
						.attr("y", y(yValue(row)) + y.rangeBand() / array.length * i)
						.attr("height", y.rangeBand() / array.length);

					var scoreX = leftMargin + Math.max(20, x(score) - 2);

					robotScores.append("text")
						.attr("class", "robot scores")
						.attr("x", scoreX)
						.attr("y", y(yValue(row)) + y.rangeBand() / array.length * i)
						.attr("dy", y.rangeBand() / array.length / 2)
						.attr("dominant-baseline", "middle")
						.attr("text-anchor", "end")
						.text(score);

					robotScores.append("text")
						.attr("class", "robot names")
						.attr("x", scoreX + 5)
						.attr("y", y(yValue(row)) + y.rangeBand() / array.length * i)
						.attr("dy", y.rangeBand() / array.length / 2)
						.attr("dominant-baseline", "middle")
						.text(row.Robot);


				});

			g.on("mouseover", function() {
				scoreMax.attr("visibility", "hidden");
				robotScores.attr("visibility", "visible");
			});

			g.on("mouseleave", function() {
				scoreMax.attr("visibility", "visible");
				robotScores.attr("visibility", "hidden");
			});

		});

		svg.append("text")
			.attr("class", "chart title")
			.attr("x", leftMargin + barWidth / 2)
			.attr("y", topMargin / 2)
			.attr("text-anchor", "middle")
			.text(robot);
	});

	return svg;
}


function medals(tsvData, robots, options) {
	options = options || {};
	var barWidth = options.barWidth || 300;
	var leftMargin = options.leftMargin || 150;
	var rightMargin = options.rightMargin || 20;

	var barHeight = options.barHeight || 400;
	var topMargin = options.topMargin || 40;
	var bottomMargin = options.bottomMargin || 20;

	var width = leftMargin + barWidth + rightMargin;
	var height = topMargin + barHeight + bottomMargin;

	var medalHeight = options.medalHeight || 30;
	var medalWidth = options.medalWidth || 40;

	var svg = d3.select("body").append("svg")
		.attr("class", "medals")
		.attr("width", width)
		.attr("height", height);

	d3.tsv(tsvData, function(error, data) {
		var namedData = Object.create(data);

		for (var previousName = "", i = 0; i < namedData.length; ++i) {
			if (namedData[i].Nom === "")
				namedData[i].Nom = previousName;
			else
				previousName = namedData[i].Nom;
		}

		var yValue = function(d) { return d.Nom; }

		var namedRows = function(d) { return !!d.Nom; }

		var x = d3.scale.ordinal()
			.domain(["SittingDuck", "Fire", "RamFire", "Walls", "SuperWalls", "Tourney 1", "Tourney 2"])
			.rangeRoundBands([leftMargin, leftMargin + barWidth]);

		var y = d3.scale.ordinal()
			.domain(data.map(yValue))
			.rangeRoundBands([topMargin, topMargin + barHeight]);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + leftMargin + ",0)")
			.call(yAxis);

		data.filter(namedRows).forEach(function(row) {
			var g = svg.append("g")
				.attr("class", "row");

			robots.forEach(function(robot) {
				var score = Math.max.apply(this,
													namedData.filter(function(d) { return row.Nom === d.Nom; })
													.map(function(d) {
														var dev = robot.name + ' dev.';
														if (d[dev])
															return Math.min(100, (parseFloat(d[robot.name]) + parseFloat(d[robot.name + ' dev.']))) || 0;
														else
															return parseFloat(d[robot.name]) || 0;
													}));
													// .map(function(d) { return d[robot.name]; })
													// .map(function(d) { return parseFloat(d) || 0; }));

				var medal = robot.tiers(score);
				if (medal)
					d3.xml(medal, "image/svg+xml", function(xml) {
						var importedNode = document.importNode(xml.documentElement, true);
						g.node().appendChild(importedNode);
						d3.select(importedNode)
							.attr("score", score)
							.attr("height", medalHeight)
							.attr("width", medalWidth)
							.attr("x", x(robot.name) + 10)
							.attr("y", y(yValue(row)) + 10);
					});
			});

		});

		svg.append("text")
			.attr("class", "chart title")
			.attr("x", leftMargin)
			.attr("y", topMargin / 2)
			.attr("text-anchor", "middle")
			.text("Medals");
	});
}

function tourney(bots, options) {
	options = options || {};
	var medalHeight = options.medalHeight || 30;
	var medalWidth = options.medalWidth || 40;

	var barWidth = options.barWidth || 400;
	var leftMargin = options.leftMargin || 150;
	var rightMargin = options.rightMargin || medalWidth + 10;

	var barHeight = options.barHeight || 400;
	var topMargin = options.topMargin || 40;
	var bottomMargin = options.bottomMargin || 0;

	var width = leftMargin + barWidth + rightMargin;
	var height = topMargin + barHeight + bottomMargin;

	var title = options.title || "Tourney";

	var goldMedal = options.goldMedal || "images/trophy-gold.svg";
	var silverMedal = options.goldMedal || "images/trophy-silver.svg";
	var bronzeMedal = options.goldMedal || "images/trophy-bronze.svg";

	var svg = d3.select("body").append("svg")
		.attr("class", "tourney")
		.attr("width", width)
		.attr("height", height);

	var y = d3.scale.ordinal()
		.domain(bots)
		.rangeRoundBands([topMargin, topMargin + barHeight]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + leftMargin + ",0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "chart title")
		.attr("x", leftMargin)
		.attr("y", topMargin / 2)
		.attr("text-anchor", "middle")
		.text(title);

	var treeHeight = Math.log(bots.length) / Math.LN2;

	var xStep = barWidth / treeHeight / 2;
	var yStep = barHeight / bots.length / 2;

	var curX = leftMargin;
	var curY = topMargin + yStep;

	bots.forEach(function(bot) {
		svg.append("path")
			.attr("d", "M" + curX + "," + curY + "H" + (curX + xStep))
			.attr("class", "winner");
		curY += yStep * 2;
	});

	curX += xStep;
	curY = topMargin + yStep;

	return {
		battle: function(a, b, winner) {
			function lines(bot) {
				var center = bot === a ? yStep : -yStep;

				if (winner === bot) {
					var points = [[curX, curY],
									  [curX + xStep, curY + center]];
					var lineGen = d3.svg.line().interpolate("step-before");
				} else {
					var points = [[curX, curY],
									  [curX, curY + center]];
					var lineGen = d3.svg.line();
				}

				var line = svg.append("path").attr("d", lineGen(points));

				if (winner === bot) {
					line.attr("class", "winner");
				}

			}

			lines(a);

			curY += yStep * 2;

			lines(b);

			curY += yStep * 2;

			return this;
		},

		riggedBattle: function(a, b, winner) {
			function lines(bot) {
				var center = bot === a ? yStep : -yStep;

				if (winner === bot) {
					var points = [[curX, curY],
									  [curX + xStep, curY + center]];
					var lineGen = d3.svg.line().interpolate("step-before");
				} else {
					var points = [[curX, curY],
									  [curX, curY + center]];
					var lineGen = d3.svg.line();
				}

				var line = svg.append("path").attr("d", lineGen(points));

				if (winner === bot) {
					line.attr("class", "rigged winner");
				}

			}

			lines(a);

			curY += yStep * 2;

			lines(b);

			curY += yStep * 2;

			return this;
		},

		winnerMedal: function(a, b, winner, medal) {
			d3.xml(medal, "image/svg+xml", function(xml) {
				var importedNode = document.importNode(xml.documentElement, true);
				svg.node().appendChild(importedNode);
				d3.select(importedNode)
					.attr("height", medalHeight)
					.attr("width", medalWidth)
					.attr("x", curX + xStep + 10)
					.attr("y", curY - yStep * 3 - medalHeight / 2);
			});

			return this;
		},

		runnerUpMedal: function(a, b, winner, medal) {
			var ySilver = winner === b ? -yStep * 2 : 0;

			d3.xml(medal, "image/svg+xml", function(xml) {
				var importedNode = document.importNode(xml.documentElement, true);
				svg.node().appendChild(importedNode);
				d3.select(importedNode)
					.attr("height", medalHeight)
					.attr("width", medalWidth)
					.attr("x", curX + 10)
					.attr("y", curY - yStep * 2 + ySilver - medalHeight / 2);
			});

			return this;
		},

		finale: function(a, b, winner, medal1, medal2) {
			this.battle(a, b, winner);

			this.winnerMedal(a, b, winner, goldMedal);
			this.runnerUpMedal(a, b, winner, silverMedal);

			return this;
		},

		smallFinale: function(a, b, winner) {
			this.battle(a, b, winner);

			this.winnerMedal(a, b, winner, bronzeMedal);
		},

		next: function() {
			yStep *= 2;
			curY = topMargin + yStep;
			curX += xStep;

			return this;
		},
	};

}
