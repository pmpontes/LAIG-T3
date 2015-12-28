/**
 * Player
 * @constructor
 */
function Player(scene, id, level){
	this.intLevel = 0;
	switch(level){
		case "Random":
			this.intLevel = 0;
			break;
		case "Attack":
			this.intLevel = 1;
			break;
		case "Defense":
			this.intLevel = 2;
			break;
	}

	this.scene = scene;
	this.human = (level == undefined);
	this.level = level;
	this.playerId = id;
	this.pieces = [];
};

Player.prototype = Object.create(CGFobject.prototype);

Player.prototype.constructor=Player;

Player.prototype.addPiece = function (piece) {
	this.pieces.push(piece);
};

Player.prototype.removePiece = function (piece) {
	for(var i=0; i<this.pieces.length; i++)
		if(this.pieces[i]==piece){
			this.pieces.splice(i,1);
			break;
		}
};

Player.prototype.clone = function () {
	var newPlayer = new Player(this.scene, this.playerId, this.level);
	newPlayer.setPieces(this.initialPieceSet);
	return newPlayer;
};

Player.prototype.setPieces = function (pieces) {
	this.pieces = pieces.slice();
	this.initialPieceSet = pieces.slice();

	var line = 0;
	var column = 0;

	// calculate initial position for each piece
	for(var i = 0; i<this.pieces.length; i++) {
		if(i % 4 == 0){
			line+=2;
			column = 0;
		}

		var matrx = mat4.create();
		mat4.identity(matrx);

		if(this.playerId=='player1'){
			if(i>15)
				mat4.translate(matrx, matrx, vec3.fromValues(10 + line, 0.5, 3 + 2/3.0 -column));
			else mat4.translate(matrx, matrx, vec3.fromValues(10 + line, 0.5, 9 -column));
			mat4.rotateY(matrx, matrx, -Math.PI/2);
		}else if(this.playerId=='player2'){
			mat4.translate(matrx, matrx, vec3.fromValues(-line, 0.5, 9 -column));
			mat4.rotateY(matrx, matrx, Math.PI/2);
		}

		this.scene.pieces[this.pieces[i]].setInitialPosition(matrx);
		column+=2 + 2/3.0;
	}
};

Player.prototype.getPieces = function (format) {
	if(format){
		var string = "[";

		for(var m=0; m<this.pieces.length; m++){
			string += "[" + this.pieces[m][0] + "," + this.pieces[m][1] + "]";
			if(m+1 < this.pieces.length)
				string += ",";
		}

		string += "]";
		return string;
	}else return this.pieces;
};

Player.prototype.makeMove = function () {
	if(this.human)
		return false;

	// TODO get valid play from PROLOG
	return true;
};

Player.prototype.showDominoes = function (){
	this.scene.pushMatrix();
	for(var i=0; i<this.pieces.length; i++){
		if(this.scene.pickMode){
			if(this.scene.turn == this.playerId && this.scene.state!='REVIEW_GAME'){
				this.scene.pieces[this.pieces[i]].setSelectable();
				this.scene.pieces[this.pieces[i]].display();
			}
		}else this.scene.pieces[this.pieces[i]].display();
	}
	this.scene.popMatrix();
};
