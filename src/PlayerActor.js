/**
 * PlayerActor object extends the Phaser.Sprite object and represents the player's character
 */
Phaser.Plugin.PNCAdventure.PlayerActor = function (game, actorDefinition) {
	Phaser.Plugin.PNCAdventure.Actor.call(this, game, actorDefinition);
	console.debug('PlayerActor initialised');
	this.initSignalListeners();
};

Phaser.Plugin.PNCAdventure.PlayerActor.prototype = Object.create(Phaser.Plugin.PNCAdventure.Actor.prototype);
Phaser.Plugin.PNCAdventure.PlayerActor.prototype.constructor = Phaser.Plugin.PNCAdventure.PlayerActor;

Phaser.Plugin.PNCAdventure.PlayerActor.prototype.initSignalListeners = function () {
	 this.game.pncPlugin.signals.sceneTappedSignal.add(function (pointer, navmesh) {
	 	console.debug('Movement signal received');
	 	if (!navmesh) { return; }

	 	if (this.walkTween && this.walkTween.isRunning) {
	 		this.walkTween.stop();
	 	}

	 	this.walkTween = this.game.add.tween(this);

	 	var path = navmesh.findPath();
	 	console.log(path);

	 	var pointer;
	 	for (var i = 0; i < path.length; i++) {
	 		pointer = path[i];
	 		var distance = Phaser.Math.distance(path[i-1] != undefined ? path[i-1].x : this.x, path[i-1] != undefined ? path[i-1].y : this.y, pointer.x, pointer.y);
	 		var tween = this.walkTween.to({x: pointer.x, y: pointer.y}, distance * 4.5);
	 		tween.onStart.add(function(sprite, tween, point) {
	 			if (this.x > point.x) {
	 				this.scale.setTo(-1, 1);
	 			} else {
	 				this.scale.setTo(1, 1);
	 			}
	 		}, this, 0, pointer);
	 	}

	 	this.walkTween.onStart.add(function () {
	 		this.animations.play('walk', null, true);
	 	}, this);

	 	this.walkTween.onComplete.add(function () {
	 		this.animations.play('idle');
	 	}, this);

	 	this.walkTween.start();
	 	
	 }, this);
};