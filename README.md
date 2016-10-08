# adventofcode-tools
Tools I've created to help solve adventofcodes puzzles.  
http://adventofcode.com/
Logicboard helps with algorithm puzzle for day 7
Matrixgraph helps with day 3.


-------------------------------------------------------------
logicboard.js

var logicBoard = require('./logicboard.js');

var myBoard = logicBoard.init();


// running an instruction

myBoard.add(instruction);


myBoard.compute();

myBoard.allValues();

console.log('a', myBoard.isNode('a'));



Instructions can be seen here:
http://adventofcode.com/2015/day/7/input

Connection types:

NOT p -> q

lx -> a

14146 -> b

af AND ah -> ai

1 AND cx -> cy

x OR ai -> aj

kk RSHIFT 3 -> km

ip LSHIFT 15 -> it

-------------------------------------------------------------
matrixGraph.js
var matrixGraph = require('./matrixGraph.js');
var myInput = String(input);
var myInput1 = "^v^v^v^v^v";

var myMatrix1 = matrixGraph.init();
		for(var i=0;i<myInput.length;i+=1) {
			//console.log(myInput.charAt(i));
			//console.log(myMatrix);
			if (i % 2 === 0) {
				var currChar1 = myInput.charAt(i);
				if (currChar1 === '^') {
					console.log('up');
					myMatrix1.up();
				} else if (currChar1 === '>') {
					console.log('right');
					myMatrix1.right();
				} else if (currChar1 === 'v') {
					console.log('down');
					myMatrix1.down();
				} else if (currChar1 ===  '<') {
					console.log('left');
					myMatrix1.left();
				}
				//console.log("move1",myMatrix1.center);
			} else {
				var currChar2 = myInput.charAt(i);
				if (currChar2 === '^') {
					console.log('up2');
					myMatrix1.up2();
				} else if (currChar2 === '>') {
					console.log('right2');
					myMatrix1.right2();
				} else if (currChar2 === 'v') {
					console.log('down2');
					myMatrix1.down2();
				} else if (currChar2 ===  '<') {
					console.log('left2');
					myMatrix1.left2();
				}	
				//console.log("move2",myMatrix1.secondary);			
			}
		}
		var myCount1 = myMatrix1.count();
		console.log('Total count:', myCount1, myMatrix1.matrixRecords.length);
		console.log("max record:", myMatrix1.maxSearch());
