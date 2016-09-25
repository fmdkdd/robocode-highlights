(function(){

	// Bar charts

	var options = {
		barHeight: 1100,
		rightMargin: 130,
		relativeInterspace: .1,
	};

	robotBarChart("data.tsv", "SittingDuck", options,
					  d3.scale.threshold()
					  .domain([50, 90, 95, 100])
					  .range(["fail", "passing", "bronze", "silver", "gold"]));

	var rankings = d3.scale.threshold()
		.domain([50, 60, 75, 90])
		.range(["fail", "passing", "bronze", "silver", "gold"]);

	["Fire", "RamFire", "Walls", "SuperWalls"].forEach(function(bot) {
		robotBarChart("data.tsv", bot, options, rankings);
	});

	// Medals

	function medalData(bot, domain) {
		return {
			name: bot,
			tiers: d3.scale.threshold()
				.domain(domain || [50, 60, 75, 90])
				.range([null]
						 .concat(["", "-bronze", "-silver", "-gold"]
									.map(function(str) {
										return "images/" + bot.toLowerCase() + str + ".svg";
									})))}}

	medals("data.tsv", [ medalData("SittingDuck", [50, 90, 95, 100]) ]
			 .concat(["Fire", "RamFire", "Walls", "SuperWalls"]
						.map(function(bot) { return medalData(bot); }))
			 .concat([{
				 name: "Tourney 1",
				 tiers: d3.scale.threshold()
				 .domain([1, 2, 3, 4])
				 .range([null, "images/trophy.svg",
							"images/trophy-bronze.svg",
							"images/trophy-silver.svg",
							"images/trophy-gold.svg"
						  ])
			 }])
			 .concat([{
				 name: "Tourney 2",
				 tiers: d3.scale.threshold()
				 .domain([1, 2, 3, 4])
				 .range([null, "images/trophy.svg",
							"images/trophy-bronze.svg",
							"images/trophy-silver.svg",
							"images/trophy-gold.svg"
						  ])
			 }]),
			 { barHeight: 1000 });

	// Tourney

	var bots = [
		"B.Anguille 2.0",
		"A.Bis 1.0",

		"J.Yanikator 2.0",
		"R.Nami 3.0",

		"I.Okteril 0.8",
		"H.Banzai 1.0",

		"K.Strider 1.0",
		"M.RAT5 1.0"
	];

	tourney(bots)
		.battle(5, 6, 5)
		.battle(1, 2, 2)
		.battle(3, 4, 4)
		.battle(7, 8, 7)
		.next()
		.battle(5, 2, 5)
		.battle(4, 7, 4)
		.next()
		.finale(5, 4, 5);

	tourney(["R.Nami 3.0", "K.Strider 1.0"],
			  {title: "Third place playoff", barWidth: 100, barHeight: 100})
		.smallFinale(4, 7, 4);

	// Tourney 2

	var bots = [
		"A.Bis 1.3",
		"B.Anguille 4.0",

		"C.Gravity 3.9",
		"badock.Janus 1.337",

		"M.RAT5ter 1.0",
		"fmdkdd.Keell 1.0",

		"D.Ploppy 2.0",
		"P.RP 1.0"
	];

	tourney(bots, {title: "Second tourney"})
		.battle(2, 4, 4)
		.battle(5, 1, 1)
		.battle(7, 6, 6)
		.battle(3, 8, 8)
		.next()
		.riggedBattle(4, 1, 4)
		.battle(6, 8, 8)
		.next()
		.finale(4, 8, 4);

	var losersBracket = [
		"A.Bis 1.3",
		"C.Gravity 3.9",

		"M.RAT5ter 1.0",
		"D.Ploppy 2.0",
	];

	tourney(losersBracket, {title: "Losers bracket", barWidth: 200, barHeight: 200})
		.battle(2, 5, 2)
		.battle(7, 3, 7)
		.next()
		.smallFinale(2, 7, 7)

}());
