let nBoards;
let size;
let min;
let max;
let incr;
let nonprimeNums;
let usedFacts;
let sharedFacts;
let remainFacts;
let draws;
let drawInd;

let factors = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
let primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];

function genBoards() {
	// read input
	nBoards = parseInt(document.getElementById("nBoards").value);
	size = parseInt(document.getElementById("size").value);
	min = 11;
	max = 50;
	incr = 9;
	nonprimeNums = [...Array(max + 1).keys()].filter(x => (!primes.includes(x) || x<min)).slice(min);
	usedFacts = [...factors];
	usedFacts.fill(false);

	// generate shared numbers (half of the board)
	let allFacts = shuffleNums(factors);
	sharedFacts = allFacts.slice(0, Math.floor(size*size*0.5));
	remainFacts = allFacts.slice(Math.floor(size*size*0.5), Math.min(max-min+1,Math.floor(size*size*1.5)));

	// reset draw number
	let drawNum = document.getElementById("drawNum");
	let factsNum = document.getElementById("factsNum");

	drawNum.innerHTML = "";
	factsNum.setAttribute("placeholder", "")

	// check if there's enough numbers for bingo board
	if(factors.length < size*size) {
		alert("Board size too large for given number range.\nIncrease the number range or decrease board size.");
	} else if((max - min + 1) < 2*incr) {
		alert("Increment too large for given number range.\nIncrease the number range or decrease increment.");
	} else {
		// get div with boards
		let boards = document.getElementById("boards");

		// clear previous boards
		boards.innerHTML = "";

		// fill with boards
		for(let i = 0; i < nBoards; i++) {
			boards.appendChild(newBoard(i));
		}
	}

	let usableNums = [...nonprimeNums];
	usableNums.fill(false);

	let shufNums = shuffleNums(nonprimeNums);

	for(let i = 1; i < usedFacts.length; i++) {
		if(usedFacts[i]) {
			let multCount = 0;
			fact = factors[i];
			for(let j = 0; j < usableNums.length; j++) {
				fact = factors[i];
				if(Math.floor(shufNums[j] / fact) * fact == shufNums[j] && multCount < 1) {
					usableNums[j] = true;
					multCount += 1;
				}
			}
		}
	}

	let nums = [];
	for(let i = 0; i < usableNums.length; i++) {
		if(usableNums[i]) {
			nums.push(shufNums[i]);
		}
	}

	// prepare draw numbers
	draws = shuffleNums(nums);
	drawInd = null;
}

function draw() {
	// get number elements
	let drawNum = document.getElementById("drawNum");
	let factsNum = document.getElementById("factsNum");

	// increase the draw index if possible
	if(drawInd == null) {
		drawInd = 0;
		drawNum.innerHTML = draws[drawInd];
		factsNum.value = "";
		factsNum.setAttribute("placeholder", "What are factors of " + draws[drawInd] + "?")
	} else if(drawInd < draws.length - 1) {
		drawInd += 1;
		drawNum.innerHTML = draws[drawInd];
		factsNum.value = "";
		factsNum.setAttribute("placeholder", "What are factors of " + draws[drawInd] + "?")
	} else {
		alert("Out of numbers.");
	}
}

function back() {
	// get number elements
	let drawNum = document.getElementById("drawNum");
	let factsNum = document.getElementById("factsNum");

	// decrease the draw index if possible
	if(drawInd == 0 || drawInd == null) {
		alert("Can't go back.")
	} else {
		drawInd -= 1;
		drawNum.innerHTML = draws[drawInd];
		factsNum.value = "";
		factsNum.setAttribute("placeholder", "What are factors of " + draws[drawInd] + "?")
	}
}

function newBoard(nBoard) {
	// create div with board
	let board = document.createElement("DIV");
	board.setAttribute("class", "block")

	// add text box for student's name
	let name = document.createElement("INPUT");
	let namewidth = 0;
	name.className = "name";
	if(max < 100) {
		name.style.width = (size*56+2) + "px";
	} else {
		name.style.width = (size*62+2) + "px";
	}
	name.setAttribute("type", "text");
	name.setAttribute("placeholder", "Player " + (nBoard + 1))
	board.appendChild(name);

	// shuffle number range, enforcing that sharedFacts is included
	let facts = shuffleNums(sharedFacts.concat(shuffleNums(remainFacts).slice(0,size*size - Math.floor(size*size*0.5))));

	// start a <table> node
	let tab = document.createElement("TABLE");

	// assemble rows of the table
	for(let i=0; i < size; i++) {
		let row = document.createElement("TR");

		// fill row with numbers
		for(let j=0; j < size; j++) {
			// pick a number from the shuffled list in order
			let fact = facts[i*size + j]
			usedFacts[fact - 2] = true;

			// fill row with number
			let cell = document.createElement("TH");
			cell.className = "cell";
			cell.setAttribute("id", "cell" + nBoard.toString() + i.toString() + j.toString())
			cell.addEventListener("click", function() { toggle(nBoard, i, j) } );
			cell.appendChild(document.createTextNode(fact));
			row.appendChild(cell);
		}

		// fill table with row
		tab.appendChild(row);
	}

	// add table to div with boards
	board.appendChild(tab);

	return board;
}

function toggle(nBoard, i, j) {
	// find the cell that was clicked
	let cell = document.getElementById("cell" + nBoard.toString() + i.toString() + j.toString());

	// toggle cell color
	if(cell.style.backgroundColor == "") {
		cell.style.backgroundColor = "DimGray";
	} else {
		cell.style.backgroundColor = "";
	}
}

function shuffleNums(nums) {
	// shuffle array
	let currInd = nums.length;
	let randInd;
	let temp;

	while(currInd != 0) {
		// pick a random index to switch with the current index
		randInd = Math.floor(Math.random() * currInd);
		currInd -= 1;
		temp = nums[currInd];
		nums[currInd] = nums[randInd];
		nums[randInd] = temp;
	}

	return nums;
}