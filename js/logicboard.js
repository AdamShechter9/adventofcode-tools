module.exports = {
  init: function () {
    function nodeConstruct (name, value) {
      this.name = name.toLowerCase();
      this.value = value || undefined;
    }
    function connectionConstruct (type, target, node) {
      this.sources = [];
      this.type = type;
      this.target = target;

      if (node.length > 1) {
        this.sources.push(node[0]);
        this.sources.push(node[1]);
      } else {
        this.sources.push(node[0]);
      }
    }

    function logicboardConstructor () {
      this.nodes = [];
      this.connections = [];

      this.isNode = function (nodeName) {
        if (!nodeName) { return 'error';}
        var foundNode = false;
        var index = 0;
        //console.log("current nodes\n",this.nodes);
        while (!foundNode && (index < this.nodes.length)) {
          if (this.nodes.length > 0) {
            //console.log(this.nodes[index]);
            if (this.nodes[index]['name'] === nodeName) {
              return this.nodes[index];
            }
            index += 1;
          } else {
            return false;
          }
        }
        return foundNode;
      };
      this.add = function (instruction) {
        if (!instruction) {return 'error';}
        var connection = {
          type: '',
          sources: [],
          target: {}
        }

        var instructSplit = instruction.split(' ');
        // Connection types:
        // NOT p -> q
        // lx -> a
        // 14146 -> b
        // af AND ah -> ai
        // 1 AND cx -> cy
        // x OR ai -> aj
        // kk RSHIFT 3 -> km
        // ip LSHIFT 15 -> it
        if (instructSplit[0] === 'NOT') {
          // NOT connection
          connection.type = instructSplit[0];
          var nodeSource = this.isNode(instructSplit[1]);
          var nodeTarget = this.isNode(instructSplit[3])
          if (nodeSource == 'error' || nodeSource === false) {
            nodeSource = new nodeConstruct(instructSplit[1]);
            this.nodes.push(nodeSource);
          }
          connection.sources.push(nodeSource);
          if (nodeTarget == 'error' || nodeTarget === false) {
            nodeTarget = new nodeConstruct(instructSplit[3]);
            this.nodes.push(nodeTarget);
          }
          connection.target = nodeTarget;
        }
        else if (instructSplit[1] === '->') {
          // ASSIGNMENT connection
          //console.log(parseInt(instructSplit[0]));
          //console.log(typeof(parseInt(instructSplit[0])));
          if ((parseInt(instructSplit[0]) >= 0) && (parseInt(instructSplit[0]) <= 65535)) {
            var nodeTarget = this.isNode(instructSplit[2]);
            var valueNew = parseInt(instructSplit[0]);
            console.log("dooood", valueNew, nodeTarget);
            console.log("\n\nadding value\n\n");
            if (nodeTarget == 'error' || nodeTarget === false) {
              if (instructSplit[0] === '0') {
                nodeTarget = new nodeConstruct(instructSplit[2], '0' );
              } else {
                nodeTarget = new nodeConstruct(instructSplit[2],  valueNew);
              }
              this.nodes.push(nodeTarget);
            } else {
              nodeTarget.value = valueNew;
            }
          } else {
            connection.type = instructSplit[1];
            var nodeSource = this.isNode(instructSplit[0]);
            var nodeTarget = this.isNode(instructSplit[2])
            if (nodeSource == 'error' || nodeSource === false) {
              nodeSource = new nodeConstruct(instructSplit[0]);
              this.nodes.push(nodeSource);
            }
            connection.sources.push(nodeSource);
            if (nodeTarget == 'error' || nodeTarget === false) {
              nodeTarget = new nodeConstruct(instructSplit[2]);
              this.nodes.push(nodeTarget);
            }
            connection.target = nodeTarget;
          }
        }
        else if (instructSplit[1] === 'AND') {
          // AND connect
          //console.log(instructSplit);
          //console.log(instructSplit[1]);
          connection.type = instructSplit[1];
          if (parseInt(instructSplit[0]) === 1) {
            var nodeSource = this.isNode(instructSplit[2]);
            var nodeTarget = this.isNode(instructSplit[4])
            if (nodeSource == 'error' || nodeSource === false) {
              nodeSource = new nodeConstruct(instructSplit[2]);
              this.nodes.push(nodeSource);
            }
            connection.sources.push('1');
            connection.sources.push(nodeSource);
            if (nodeTarget == 'error' || nodeTarget === false) {
              nodeTarget = new nodeConstruct(instructSplit[4]);
              this.nodes.push(nodeTarget);
            }
            connection.target = nodeTarget;
          } else {
            var nodeSource1 = this.isNode(instructSplit[0]);
            var nodeSource2 = this.isNode(instructSplit[2]);
            var nodeTarget = this.isNode(instructSplit[4]);
            console.log(nodeSource1,nodeSource2,nodeTarget);
            if (nodeSource1 == 'error' || nodeSource1 === false) {
              nodeSource1 = new nodeConstruct(instructSplit[0]);
              this.nodes.push(nodeSource1);
            }
            connection.sources.push(nodeSource1);
            if (nodeSource2 == 'error' || nodeSource2 === false) {
              nodeSource2 = new nodeConstruct(instructSplit[2]);
              this.nodes.push(nodeSource2);
            }
            connection.sources.push(nodeSource2);
            if (nodeTarget == 'error' || nodeTarget === false) {
              nodeTarget = new nodeConstruct(instructSplit[4]);
              this.nodes.push(nodeTarget);
            }
            connection.target = nodeTarget;
          }

        }
        else if (instructSplit[1] === 'OR') {
          // OR connection
          connection.type = instructSplit[1];
          var nodeSource1 = this.isNode(instructSplit[0]);
          var nodeSource2 = this.isNode(instructSplit[2]);
          var nodeTarget = this.isNode(instructSplit[4])
          if (nodeSource1 == 'error' || nodeSource1 === false) {
            nodeSource1 = new nodeConstruct(instructSplit[0]);
            this.nodes.push(nodeSource1);
          }
          connection.sources.push(nodeSource1);
          if (nodeSource2 == 'error' || nodeSource2 === false) {
            nodeSource2 = new nodeConstruct(instructSplit[2]);
            this.nodes.push(nodeSource2);
          }
          connection.sources.push(nodeSource2);
          if (nodeTarget == 'error' || nodeTarget === false) {
            nodeTarget = new nodeConstruct(instructSplit[4]);
            this.nodes.push(nodeTarget);
          }
          connection.target = nodeTarget;
        }
        else if (instructSplit[1].slice(1) === 'SHIFT') {
          // SHIFT connection
          connection.type = instructSplit[1];
          var nodeSource = this.isNode(instructSplit[0]);
          var nodeTarget = this.isNode(instructSplit[4])
          if (nodeSource == 'error' || nodeSource === false) {
            nodeSource = new nodeConstruct(instructSplit[0]);
            this.nodes.push(nodeSource);
          }
          connection.sources.push(nodeSource);
          connection.sources.push(instructSplit[2]);
          if (nodeTarget == 'error' || nodeTarget === false) {
            nodeTarget = new nodeConstruct(instructSplit[4]);
            this.nodes.push(nodeTarget);
          }
          connection.target = nodeTarget;
        }
        console.log(instruction);
        if (nodeSource) {
          console.log(nodeSource);
          var newConnection = new connectionConstruct(connection.type, connection.target, connection.sources);
          this.connections.push(newConnection);
          console.log(this.connections[this.connections.length-1]);
        } else if (nodeSource1) {
          console.log(nodeSource1,nodeSource2);
          var newConnection = new connectionConstruct(connection.type, connection.target, connection.sources);
          this.connections.push(newConnection);
          console.log(this.connections[this.connections.length-1]);
        }
        console.log(nodeTarget);

      };
      this.compute = function () {
        console.log("\n\nin compute()\n\n");
        var isComputation = true;
        var isSources;

        while (isComputation) {
          isSources = false;
          isComputation = false;

          for (var i = 0; i < this.connections.length; i+=1) {
            isSources = false;
            //console.log(i);
            //console.log('connection', this.connections[i]);
            if (this.connections[i].sources[0].value != undefined) {
              //console.log('got 1',this.connections[i].sources[0].value);

              if (this.connections[i].sources.length === 1) {
                // x -> y
                isSources = true;
              } else if (typeof(this.connections[i].sources[1]) === 'object') {
                // x AND y -> a
                if (this.connections[i].sources[1].value != undefined) {
                  //console.log('got 2',this.connections[i].sources[1].value);
                  isSources = true;
                } else {
                  //console.log("bummer");
                }
              } else if (typeof(this.connections[i].sources[1]) === 'string'){
                // 1 AND y -> b
                //console.log('got 2',this.connections[i].sources[1]);
                isSources = true;
              }
            } else if (this.connections[i].sources[0] == '1') {
              //console.log('got 1',this.connections[i].sources[0]);
              if (this.connections[i].sources[1].value != undefined) {
                //console.log('got 2',this.connections[i].sources[1].value);
                isSources = true;
              } else {
                //console.log("bummer");
              }
            }

            //console.log("pre",this.connections[i]);
            if (isSources && (this.connections[i].target.value === undefined)) {
              console.log("\nwe have sources");
              //console.log(this.connections[i]);
              // Run computation
              if (this.connections[i].type === 'RSHIFT') {
                console.log("RSHIFT");
                //var result = this.connections[i].sources[0].value >> this.connections[i].sources[1];
                var binary = this.connections[i].sources[0].value.toString(2);
                var shiftN = this.connections[i].sources[1];
                console.log("value:", this.connections[i].sources[0].value);
                console.log("binary:", binary, binary.length);
                var difference = (16 - binary.length);
                console.log("difference:", difference);
                for (var iRShift = 0; iRShift < difference; iRShift += 1) {
                  binary = "0" + binary;
                  console.log(binary, iRShift);
                }
                console.log("binary:", binary, binary.length);
                console.log("shift:",shiftN);
                var result = binary.slice(0, 16-shiftN);
                // var result = ~ this.connections[i].sources[0].value;
                console.log("binary:",result, '=', parseInt(result, 2));
                result = parseInt(result, 2);
                this.connections[i].target.value = result;
                isComputation = true;

              } else if (this.connections[i].type === 'LSHIFT') {
                console.log("LSHIFT");
                //var result = this.connections[i].sources[0].value >> this.connections[i].sources[1];
                var binary = this.connections[i].sources[0].value.toString(2);
                var shiftN = this.connections[i].sources[1];
                console.log("value:", this.connections[i].sources[0].value);
                console.log("binary:", binary, binary.length);
                console.log("shift:",shiftN);
                for (var b = 0; b < shiftN; b += 1) {
                  binary = binary + "0";
                  console.log(binary, b);
                }

                console.log("pretrim binary:",binary, binary.length);
                if (binary.length > 16) {
                  var extraBits = binary.length - 16;
                  result = binary.split('');
                  for (var extraOut = 0; extraOut < extraBits; extraOut += 1) {
                    result.shift();
                  }
                  result = result.join('');
                } else {
                  result = binary;
                }

                // var result = ~ this.connections[i].sources[0].value;
                console.log("binary:",result, '=', parseInt(result, 2));
                result = parseInt(result, 2);
                this.connections[i].target.value = result;
                isComputation = true;


              } else if (this.connections[i].type === 'AND') {
                console.log("AND");
                //console.log("1",this.connections[i].sources[0]);
                //console.log("2",this.connections[i].sources[1]);
                if (this.connections[i].sources[0] === '1') {
                  //console.log('binary1:', this.connections[i].sources[0].toString(2));
                  //console.log('binary2:', this.connections[i].sources[1].value.toString(2));
                  var result = 1 & this.connections[i].sources[1].value;
                } else {
                  //console.log('binary1:', this.connections[i].sources[0].value.toString(2));
                  //console.log('binary2:', this.connections[i].sources[1].value.toString(2));
                  var result = this.connections[i].sources[0].value & this.connections[i].sources[1].value;
                };
                console.log(result);
                this.connections[i].target.value = result;
                isComputation = true;

              } else if (this.connections[i].type === 'OR') {
                console.log("OR");
                var result = this.connections[i].sources[0].value | this.connections[i].sources[1].value;
                console.log(result);
                this.connections[i].target.value = result;
                isComputation = true;

              } else if (this.connections[i].type === '->') {
                console.log("->");
                var result = this.connections[i].sources[0].value;
                console.log(result);
                this.connections[i].target.value = result;
                isComputation = true;

              } else if (this.connections[i].type === 'NOT') {
                // it's 32 bits.
                // needs to be 16 bit unsigned
                var binary = this.connections[i].sources[0].value.toString(2);
                console.log("\n\n\n\n\n--------------------------------------------------------------")
                console.log("NOT");
                console.log("value:", this.connections[i].sources[0].value);
                console.log("binary:", binary, binary.length);
                var difference = (16 - binary.length);
                console.log("difference", difference);
                for (var h = 0; h < difference; h += 1) {
                  binary = "0" + binary;
                  console.log(binary, h);
                }
                console.log("binary:", binary);
                var result = '';
                for (b = 0; b < 16; b += 1) {
                  if (binary[b] === '0') {
                    result += '1';
                  } else {
                    result += '0';
                  }
                }
                // var result = ~ this.connections[i].sources[0].value;
                console.log("binary:",result, '=', parseInt(result, 2));
                result = parseInt(result, 2);
                this.connections[i].target.value = result;
                isComputation = true;
              }
              console.log("post",this.connections[i]);
            }
          }
        }
      }
      this.allValues = function () {
        console.log("\n\nprinting all values");
        //console.log(this.nodes);
        for (var i = 0; i < this.nodes.length; i+=1){
          //console.log(connection i);
          if (this.nodes[i].value != undefined) {
            console.log("name:",this.nodes[i].name,"index:",i,"value:",this.nodes[i].value);
          }
        }
      }
    };

    var myLogicBoard = new logicboardConstructor();

    return myLogicBoard;
  }
}
