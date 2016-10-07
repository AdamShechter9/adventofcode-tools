module.exports = {
	init: function () {
		function nodeConstructor (value, x, y, upNode, rightNode, downNode, leftNode) {
			this.value = value;
			this.x = x || 0;
			this.y = y || 0;
			this.up = upNode||null;
			this.right = rightNode||null;
			this.down = downNode||null;
			this.left = leftNode||null;
		};

		function matrixConstructor () {
			this.center = new nodeConstructor(1);
			this.secondary = this.center;
			this.zeroPoint = this.center;
			this.matrixRecords = [{x:0, y:0}];

			this.contains = function (targetx, targety) {
				//Don't use.  slow computation
				for (var i = 0; i < this.matrixRecords.length; i += 1) {
					if (this.matrixRecords[i].x === targetx) {
						if (this.matrixRecords[i].y === targety) {
							return true;
						}
					}
				}
				return false;
			}
			this.locateCoord = function (targetx,targety, node, visitHash) {
				// returns node if found
				// returns null if coord is empty
				var matrixRunner = node || this.zeroPoint;
				var visitHash = visitHash || [];
				//console.log('searching for x',targetx,'y',targety, 'node',matrixRunner.x,matrixRunner.y);
				var beenHere = false;
				if (node === null) {
					return ;
				}
				if (matrixRunner.x === targetx && matrixRunner.y === targety) {
					//console.log("foundNode", targetx,targety);
					return matrixRunner;
				}
				for (var i = 0; i < visitHash.length; i += 1) {
					if (visitHash[i].x === matrixRunner.x) {
						if (visitHash[i].y === matrixRunner.y) {
							beenHere = true;
						}
					}
				}
				if (!beenHere) {
					visitHash.push({x:matrixRunner.x, y:matrixRunner.y});
				} else {
					return;
				}
				//console.log(visitHash);
				//console.log(status);

				return this.locateCoord(targetx,targety,matrixRunner.up,visitHash) || 
					this.locateCoord(targetx,targety,matrixRunner.right,visitHash) ||
					this.locateCoord(targetx,targety,matrixRunner.down,visitHash)  ||
					this.locateCoord(targetx,targety,matrixRunner.left,visitHash);
			}
			this.maxSearch = function (node, visitHash, maxRecord) {
				//return maximum number and location
				var matrixRunner = node || this.zeroPoint;
				var visitHash = visitHash || [];
				var maxRecord = maxRecord || {max: this.zeroPoint.value, x:0,y:0};

				var beenHere = false;
				if (node === null) {
					return
				}
				if (matrixRunner.value > maxRecord.max) {
					maxRecord.max = matrixRunner.value;
					maxRecord.x = matrixRunner.x;
					maxRecord.y = matrixRunner.y;
				}
				for (var i = 0; i < visitHash.length; i += 1) {
					if (visitHash[i].x === matrixRunner.x) {
						if (visitHash[i].y === matrixRunner.y) {
							beenHere = true;
							break;
						}
					}
				}
				if (!beenHere) {
					visitHash.push({x:matrixRunner.x, y:matrixRunner.y});
				} else {
					return;
				}
				if (matrixRunner.up) {
					this.maxSearch(matrixRunner.up, visitHash, maxRecord);
				} 
				if (matrixRunner.right) {
					this.maxSearch(matrixRunner.right, visitHash, maxRecord);
				}
				if (matrixRunner.down) {
					this.maxSearch(matrixRunner.down, visitHash, maxRecord);
				}
				if (matrixRunner.left) {
					this.maxSearch(matrixRunner.left, visitHash, maxRecord);
				}
				return maxRecord;
			}
			this.count = function (node, visitHash, count) {
				if (node === null) {
					return
				}
				var matrixRunner = node || this.zeroPoint;
				var visitHash = visitHash || [];
				//console.log("in Count algorithm", matrixRunner.x,matrixRunner.y);
				var beenHere = false;
				
				for (var i = 0; i < visitHash.length; i += 1) {
					if (visitHash[i].x === matrixRunner.x) {
						if (visitHash[i].y === matrixRunner.y) {
							beenHere = true;
							break;
						}
					}
				}
				if (!beenHere) {
					visitHash.push({x:matrixRunner.x, y:matrixRunner.y});
				} else {
					return;
				}
				//console.log(visitHash);
				this.count(matrixRunner.up, visitHash, count);
				this.count(matrixRunner.right, visitHash, count);
				this.count(matrixRunner.down, visitHash, count);
				this.count(matrixRunner.left, visitHash, count);
				//console.log(visitHash);
				//console.log("records\n", this.matrixRecords);
				return visitHash.length;
			}

			this.up = function () 
			{
				if (!this.center.up) {
					this.center.up = this.locateCoord(this.center.x, this.center.y+1);
				} 
				if (!this.center.right) {
					this.center.right = this.locateCoord(this.center.x+1, this.center.y);
				}
				if (!this.center.down) {
					this.center.down = this.locateCoord(this.center.x, this.center.y-1);
				}
				if (!this.center.left) {
					this.center.left = this.locateCoord(this.center.x-1, this.center.y);
				}
				
				if (!this.center.up) {
					var newX = this.center.x;
					var newY = this.center.y+1;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						//downNode = this.center;
						downNode = this.locateCoord(newX, newY-1),
						leftNode = this.locateCoord(newX-1,newY);
					//console.log(upNode, rightNode, downNode, leftNode);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.center.up = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.center = this.center.up;
				this.center.value += 1;
				//console.log('x:',this.center.x,'y:',this.center.y);
			}
			this.up2 = function () {
				if (!this.secondary.up) {
					this.secondary.up = this.locateCoord(this.secondary.x, this.secondary.y+1);
				} 
				if (!this.secondary.right) {
					this.secondary.right = this.locateCoord(this.secondary.x+1, this.secondary.y);
				}
				if (!this.secondary.down) {
					this.secondary.down = this.locateCoord(this.secondary.x, this.secondary.y-1);
				}
				if (!this.secondary.left) {
					this.secondary.left = this.locateCoord(this.secondary.x-1, this.secondary.y);
				}
				

				if (!this.secondary.up) {
					var newX = this.secondary.x;
					var newY = this.secondary.y+1;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX, newY-1),
						leftNode = this.locateCoord(newX-1,newY);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.secondary.up = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.secondary = this.secondary.up;
				this.secondary.value += 1;
				//console.log('x:',this.secondary.x,'y:',this.secondary.y);
			}
			this.right = function () {
				if (!this.center.up) {
					this.center.up = this.locateCoord(this.center.x, this.center.y+1);
				} 
				if (!this.center.right) {
					this.center.right = this.locateCoord(this.center.x+1, this.center.y);
				}
				if (!this.center.down) {
					this.center.down = this.locateCoord(this.center.x, this.center.y-1);
				}
				if (!this.center.left) {
					this.center.left = this.locateCoord(this.center.x-1, this.center.y);
				}

				if (!this.center.right) {
					var newX = this.center.x+1;
					var newY = this.center.y;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1),
						leftNode = this.locateCoord(newX-1, newY);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.center.right = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.center = this.center.right;
				this.center.value += 1;
				//console.log('x:',this.center.x,'y:',this.center.y);			
			}
			this.right2 = function () {
				if (!this.secondary.up) {
					this.secondary.up = this.locateCoord(this.secondary.x, this.secondary.y+1);
				} 
				if (!this.secondary.right) {
					this.secondary.right = this.locateCoord(this.secondary.x+1, this.secondary.y);
				}
				if (!this.secondary.down) {
					this.secondary.down = this.locateCoord(this.secondary.x, this.secondary.y-1);
				}
				if (!this.secondary.left) {
					this.secondary.left = this.locateCoord(this.secondary.x-1, this.secondary.y);
				}

				if (!this.secondary.right) {
					var newX = this.secondary.x+1;
					var newY = this.secondary.y;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1),
						leftNode = this.locateCoord(newX-1, newY);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.secondary.right = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.secondary = this.secondary.right;
				this.secondary.value += 1;
				//console.log('x:',this.secondary.x,'y:',this.secondary.y);			
			}
			this.down = function () {
				if (!this.center.up) {
					this.center.up = this.locateCoord(this.center.x, this.center.y+1);
				} 
				if (!this.center.right) {
					this.center.right = this.locateCoord(this.center.x+1, this.center.y);
				}
				if (!this.center.down) {
					this.center.down = this.locateCoord(this.center.x, this.center.y-1);
				}
				if (!this.center.left) {
					this.center.left = this.locateCoord(this.center.x-1, this.center.y);
				}

				if (!this.center.down) {
					var newX = this.center.x;
					var newY = this.center.y-1;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1)
						leftNode = this.locateCoord(newX-1,newY);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.center.down = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.center = this.center.down;
				this.center.value += 1;
				//console.log('x:',this.center.x,'y:',this.center.y);	
			}
			this.down2 = function () {
				if (!this.secondary.up) {
					this.secondary.up = this.locateCoord(this.secondary.x, this.secondary.y+1);
				} 
				if (!this.secondary.right) {
					this.secondary.right = this.locateCoord(this.secondary.x+1, this.secondary.y);
				}
				if (!this.secondary.down) {
					this.secondary.down = this.locateCoord(this.secondary.x, this.secondary.y-1);
				}
				if (!this.secondary.left) {
					this.secondary.left = this.locateCoord(this.secondary.x-1, this.secondary.y);
				}

				if (!this.secondary.down) {
					var newX = this.secondary.x;
					var newY = this.secondary.y-1;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1),
						leftNode = this.locateCoord(newX-1,newY);
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.secondary.down = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.secondary = this.secondary.down;
				this.secondary.value += 1;
				//console.log('x:',this.secondary.x,'y:',this.secondary.y);	
			}
			this.left = function () {
				if (!this.center.up) {
					this.center.up = this.locateCoord(this.center.x, this.center.y+1);
				} 
				if (!this.center.right) {
					this.center.right = this.locateCoord(this.center.x+1, this.center.y);
				}
				if (!this.center.down) {
					this.center.down = this.locateCoord(this.center.x, this.center.y-1);
				}
				if (!this.center.left) {
					this.center.left = this.locateCoord(this.center.x-1, this.center.y);
				}

				if (!this.center.left) {
					var newX = this.center.x-1;
					var newY = this.center.y;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1),
						leftNode = this.locateCoord(newX-1, newY)
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.center.left = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.center = this.center.left;
				this.center.value += 1;
				//console.log('x:',this.center.x,'y:',this.center.y);	
			}
			this.left2 = function () {
				if (!this.secondary.up) {
					this.secondary.up = this.locateCoord(this.secondary.x, this.secondary.y+1);
				} 
				if (!this.secondary.right) {
					this.secondary.right = this.locateCoord(this.secondary.x+1, this.secondary.y);
				}
				if (!this.secondary.down) {
					this.secondary.down = this.locateCoord(this.secondary.x, this.secondary.y-1);
				}
				if (!this.secondary.left) {
					this.secondary.left = this.locateCoord(this.secondary.x-1, this.secondary.y);
				}

				if (!this.secondary.left) {
					var newX = this.secondary.x-1;
					var newY = this.secondary.y;
					//console.log("newnode",newX,newY);
					var upNode = this.locateCoord(newX,newY+1),
						rightNode = this.locateCoord(newX+1,newY),
						downNode = this.locateCoord(newX,newY-1),
						leftNode = this.locateCoord(newX-1, newY)
					var newNode = new nodeConstructor(
						0,
						newX,
						newY, 
						upNode,
						rightNode,
						downNode,
						leftNode
					);
					this.secondary.left = newNode;
					this.matrixRecords.push({x:newX,y:newY});
				}
				this.secondary = this.secondary.left;
				this.secondary.value += 1;
				//console.log('x:',this.secondary.x,'y:',this.secondary.y);	
			}
		}

		var myMatrix = new matrixConstructor();

		return myMatrix;
	}
}
	
