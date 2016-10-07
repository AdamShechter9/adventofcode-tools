# adventofcode-tools
Tools I've created to help solve adventofcodes puzzles.  
http://adventofcode.com/
-------------------------------------------------------------

logicboard.js
var logicBoard = require('./logicboard.js');
var myBoard = logicBoard.init();

// running an instruction
myBoard.add(instruction);

myBoard.compute();
myBoard.allValues();
console.log('a', myBoard.isNode('a'));

Connection types:
NOT p -> q
lx -> a
14146 -> b
af AND ah -> ai
1 AND cx -> cy
x OR ai -> aj
kk RSHIFT 3 -> km
ip LSHIFT 15 -> it
