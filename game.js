var background;
var mainMenu;
var obstacles;
var ufo;
var floatingMan;
var loader;
var mirrors;
var humans;
var humanClusters;
var humans2;

var ammo=4;
var humanCount=0;

var ammoText;
var humansText;
var gameOverText;
var winText;
var mainMenuText;

var game = new Phaser.Game(1000, 640, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render  });
var mirrorLines=new Array();
var laserLines=new Array();
var lines=new Array();
var finished=false;
var started=false;
var beamActive=false;
var reflectionCount=30;
var beamLength=3000;
var pendingRotations = new Array();


function preload () {

	game.load.image('background', 'assets/street01.jpg');
	game.load.image('floatingMan', 'assets/kidnapped.png');
	game.load.image('mainMenu', 'assets/mainmenu.png');
	game.load.image('house1', 'assets/building1.png');
	game.load.image('house2', 'assets/building2.jpg');
	game.load.image('ufo', 'assets/ufo.png');
	game.load.image('mirror', 'assets/mirror.png');
	game.load.image('human', 'assets/human.png');
	game.load.image('tree', 'assets/tree.png');

}

function create () {
	
	background = game.add.sprite(0, 0, 'background');

	obstacles = game.add.group();
	mirrors = game.add.group();
	humanClusters = game.add.group();
	
	var o=obstacles.create(180,80,'house2');
	o.angle=90;
	o=obstacles.create(180,210,'house2');
	o=obstacles.create(180,380,'house2');
	
	o=obstacles.create(880,140,'house2');
	o=obstacles.create(880,310,'house2');
	
	o=obstacles.create(350,210,'house2');
	o=obstacles.create(340,380,'house1');
	o=obstacles.create(400,350,'tree');
	o=obstacles.create(400,390,'tree');
	
	o=obstacles.create(540,380,'house2');
	o=obstacles.create(650,380,'house2');
	o=obstacles.create(650,580,'house2');
	o=obstacles.create(540,210,'house2');
	
	obstacles.forEach(function(item) {
		item.scale.x*=0.4;
		item.scale.y*=0.4;
		item.anchor.setTo(0.5, 0.5);
	}, this);
	
	createMirror({x:650,y:300}, mirrors);
	createMirror({x:120,y:500}, mirrors);
	createMirror({x:850,y:460}, mirrors);
	
	humans = game.add.group();
	humans2 = game.add.group();
	humans3 = game.add.group();
	
	createHumanCluster({x:55,y:55}, 10,humans);
	createHumanCluster({x:350,y:560}, 10,humans2);
	createHumanCluster({x:250,y:260}, 10,humans3);
	var tween = game.add.tween(humans2).to( { x: humans2.x+150 }, 3000, Phaser.Easing.Linear.None, true, 0,-1, true);
	

	ufo = game.add.sprite(650,40,'ufo');
	ufo.anchor.setTo(0.5, 0.5);
	ufo.scale.x=0.2;
	ufo.scale.y=0.2;
	var tween2 = game.add.tween(ufo).to( { y: ufo.y+10 }, 3000, Phaser.Easing.Linear.None, true, 0,-1, true);
	
	humansText = game.add.text(860, 50, "Humans: "+humanCount, {
        font: "16px Arial",
        fill: "#ff0044",
        align: "center"
    });

    humansText.anchor.setTo(0.5, 0.5);
	
	ammoText = game.add.text(860, 65, "Ammo: "+ammo, {
        font: "16px Arial",
        fill: "#ff0044",
        align: "center"
    });

    ammoText.anchor.setTo(0.5, 0.5);
	
	gameOverText = game.add.text(game.world.centerX, game.world.centerY, "Game Over - out of ammo", {
        font: "36px Arial",
        fill: "#ff0000",
        align: "center"
    });
	
	gameOverText.anchor.setTo(0.5, 0.5);
	gameOverText.visible=false;
	winText = game.add.text(game.world.centerX, game.world.centerY, "Congratulations!", {
        font: "36px Arial",
        fill: "#00ff00",
        align: "center"
    });
	
	winText.anchor.setTo(0.5, 0.5);
	winText.visible=false;
	
	shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    shoot.onDown.add(shootBeam, this);
	
	
	
	mainMenu = game.add.sprite(0, 0, 'mainMenu');
	floatingMan = game.add.sprite(game.world.centerX, game.world.centerY+100,'floatingMan');
	floatingMan.anchor.setTo(0.5, 0.5);
	
	floatingMan.scale.x=1.2;
	floatingMan.scale.y=1.2;
	
	var tween3 = game.add.tween(floatingMan).to( { y: floatingMan.y+20 }, 2000, Phaser.Easing.Linear.None, true, 0,-1, true);
	
	
	mainMenuText = game.add.text(game.world.centerX, game.world.centerY+200, "Click to start", {
        font: "36px Arial",
        fill: "#ffffff",
        align: "center"
    });
	mainMenuText.anchor.setTo(0.5, 0.5);
}

function shootBeam(){
	if(beamActive){
		return;
	}
	if(ammo>0){
		ammo--;
	
	}
	beamActive=true;
	setTimeout(function(){beamActive=false;},1000);
}

function createMirror(position, group)
{
	mirror = group.create(position.x,position.y, 'mirror');
	mirror.anchor.setTo(0.5, 0.5);
	mirror.angle=180;
	mirror.scale.x=.25;
	mirror.scale.y=.25;
}

function removeHuman(human)
{
	human.kill();
	if(humanCount>0){
		humanCount--;
	}
} 



function destroyHumans (ray) {
   // var distanceToWall = ray.length;
  //  var closestIntersection = false;

    // For each of the walls...
    this.humanClusters.forEach(function(humanCluster) {
		humanCluster.forEachAlive(function(wall) {
        // Create an array of lines that represent the four edges of each wall
        var lines = [
            new Phaser.Line(humanCluster.x+wall.x-(wall.width/2), humanCluster.y+wall.y-(wall.height/2), humanCluster.x+wall.x +( wall.width/2), humanCluster.y+wall.y - (wall.height/2)),
			
            new Phaser.Line(humanCluster.x+wall.x+(wall.width/2), humanCluster.y+wall.y-(wall.height/2), humanCluster.x+wall.x+(wall.width/2), humanCluster.y+wall.y + (wall.height/2)),
			
            new Phaser.Line(humanCluster.x+wall.x+(wall.width/2), humanCluster.y+wall.y + (wall.height/2),
                humanCluster.x+wall.x-(wall.width/2), humanCluster.y+wall.y + (wall.height/2)),
				
            new Phaser.Line(humanCluster.x+wall.x-(wall.width/2), humanCluster.y+wall.y + (wall.height/2),
                humanCluster.x+wall.x-(wall.width/2), humanCluster.y+wall.y-(wall.height/2))
        ];

        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
        for(var i = 0; i < lines.length; i++) {
					//game.debug.geom(lines[i],'#ff0000');
            var intersect = Phaser.Line.intersects(ray, lines[i]);
            if (intersect) {
                // Find the closest intersection
              //  distance =
             //       this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
             //   if (distance < distanceToWall) {
                //    distanceToWall = distance;
               //     closestIntersection = intersect;
					if(wall.alive){
						removeHuman(wall);
					}
                //}
            }
        }
		}, this);
    }, this);

    return false;
};

function getWallIntersection (ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    

    return closestIntersection;
};

function getReflectionIntersection (ray, excludedMirror) {
	 if(typeof(excludedMirror)==='undefined') {excludedMirror = false;}
    var distanceToWall = Number.POSITIVE_INFINITY;
    var distanceToMirror = Number.POSITIVE_INFINITY;
    var closestIntersection = false;
    var closestReflection = false;
    var angle = false;
	var closestLine=false;
	var distance= distanceToWall;
	var distanceM= distanceToMirror;
	var mirror=false;
    
	// For each of the walls...
    this.obstacles.forEach(function(wall) {
        // Create an array of lines that represent the four edges of each wall
        var lines = [
            new Phaser.Line(wall.x-(wall.width/2), wall.y-(wall.height/2), wall.x +( wall.width/2), wall.y - (wall.height/2)),
			
            new Phaser.Line(wall.x+(wall.width/2), wall.y-(wall.height/2), wall.x+(wall.width/2), wall.y + (wall.height/2)),
			
            new Phaser.Line(wall.x+(wall.width/2), wall.y + (wall.height/2),
                wall.x-(wall.width/2), wall.y + (wall.height/2)),
				
            new Phaser.Line(wall.x-(wall.width/2), wall.y + (wall.height/2),
                wall.x-(wall.width/2), wall.y-(wall.height/2))
        ];

        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
        for(var i = 0; i < lines.length; i++) {
				//	game.debug.geom(lines[i],'#ff0000');
            var intersect = Phaser.Line.intersects(ray, lines[i]);
            if (intersect) {
				
						
	//	game.debug.geom(tempLine2,'#ff0000');
                // Find the closest intersection
                distance =
                    game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                if (distance < distanceToWall) {
					
                    distanceToWall = distance;
                    closestIntersection = intersect;
                }
            }
        }
    }, this);
	
	
    this.mirrors.forEach(function(wall) {
        if(excludedMirror==wall){
			return;
		}
		var tempLine=  new Phaser.Line(wall.x,wall.y,wall.x,wall.y);
		var tempLine2=  new Phaser.Line(wall.x,wall.y,wall.x,wall.y);
		tempLine.fromAngle(wall.x,wall.y, wall.rotation , wall.width/2);
		tempLine2.fromAngle(wall.x,wall.y, (wall.rotation )-Math.PI, wall.width/2);
		
		var linesM=[
            tempLine,tempLine2];


        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
		for(var i=0;i<2;i++){
            var intersectM = Phaser.Line.intersects(ray, linesM[i]);
            if (intersectM) {
				
				
                // Find the closest intersection
                distanceM =
                    game.math.distance(ray.start.x, ray.start.y, intersectM.x, intersectM.y);
                if (distanceM < distanceToMirror) {
					
                    distanceToMirror = distanceM;
                    closestReflection = intersectM;
					closestLine = linesM[i];
					mirror=wall;
                }
            }
        }
    }, this);
	
	if(distanceToMirror<distanceToWall)
	{
		closestIntersection=closestReflection;
		if(closestLine!==false)
		{
			angle=ray.reflect(closestLine);
			
		}
		
		if(closestReflection!==false){
			reflectsPoints.push(closestReflection);
		}
	}
	else
	{
		if(closestIntersection!==false){
			intersectsPoints.push(closestIntersection);
		}
	}
	
	
    return {'intersect': closestIntersection, 'angle':angle,'mirror':mirror};
};


function rotateMirror(sprite, pointer)
{
	var targetAngle = ((360 / (2 * Math.PI)) * game.math.angleBetween(
          sprite.x, sprite.y,
          pointer.x, pointer.y)) +90;
   if(targetAngle < 0)
	targetAngle += 360;

	pendingRotations.push({'sprite':sprite,'angle':targetAngle});
}

function createHumanCluster(position, count,group)
{
	for(var i=0;i<count;i++)
	{
		var human = group.create(position.x+game.rnd.integerInRange(-30,30),position.y+game.rnd.integerInRange(-30,30),'human');
		human.anchor.setTo(0.5, 0.5);
		human.scale.x=.1;
		human.scale.y=.1;
		var tween = game.add.tween(human).to( { x: human.x+game.rnd.integerInRange(-20,20),y: human.y+game.rnd.integerInRange(-20,20) }, 1000, Phaser.Easing.Linear.None, true, 0,-1, true);
	}
	humanCount+=count;
	humanClusters.add(group);
	
}


function update() {
	
	if(!started)
	{
		if(game.input.activePointer.isDown)
		{
			mainMenu.kill();
			floatingMan.kill();
			mainMenuText.visible=false;
			started=true;
		}
		return;
	}
	
	if(finished){
		return;
	}
	if(beamActive){
	
	
		for(var i=-20;i<20;i++){
			reflectionCount=30;
			computeLasersRecursive({'x':ufo.x+5, 'y':ufo.y+35}, (Math.PI/2)+(i*(Math.PI/(2*720))));
		}
	}
	
	if(beamActive){
		return;
	}
	if(game.input.activePointer.isDown)
	{
		//rotate mirrors
		mirrors.forEach(function(item) {
		if(game.math.distance(item.x,item.y,game.input.activePointer.x,game.input.activePointer.y)<80)
		{
			rotateMirror(item, game.input.activePointer)
		}
	
		}, this);
		
		
	}
	
	
	if(ammo<=0&&humanCount>0){
		finished=true;
		gameOverText.visible=true;
	}
	if(humanCount<=0){
		finished=true;
		winText.visible=true;
	}
	
	ammoText.setText("Ammo: "+ammo);
	humansText.setText("Humans: "+humanCount);
	lines=new Array();
	for(var j=0;j<pendingRotations.length;j++)
	{
		pendingRotations[j].sprite.angle=pendingRotations[j].angle;
		
	}
	pendingRotations=new Array();
	
	
	
}


function renderLasers()
{
	for(var i=0;i<lines.length;i++)
	{
		game.context.strokeStyle = 'rgb(0,255,0)';
		game.context.lineWidth=3;
		game.context.beginPath();
		game.context.moveTo(lines[i].x1, lines[i].y1);
		game.context.lineTo(lines[i].x2, lines[i].y2);
		game.context.stroke();
	}
	for(var j=0;j<intersectsPoints.length;j++){
		game.debug.geom(new Phaser.Circle(intersectsPoints[j].x, intersectsPoints[j].y,5),'#ff0000');
	}
	for(var j=0;j<reflectsPoints.length;j++){
		game.debug.geom(new Phaser.Circle(reflectsPoints[j].x, reflectsPoints[j].y,5),'#0000ff');
	}
	intersectsPoints=new Array();
	reflectsPoints=new Array();
}


function computeLasersRecursive(start, angle, excludedMirror)
{
	 if(typeof(excludedMirror)==='undefined') {excludedMirror = false;}
	reflectionCount--;
	if(reflectionCount<=0){
		return;
	}
	tempray= new Phaser.Line(0,0,1,1);
	ray = tempray.fromAngle(start.x, start.y, angle, beamLength) ;
	
	
	var reflectIntersect = getReflectionIntersection(ray,excludedMirror);
	
	if(reflectIntersect.angle!==false)
	{
		lines.push({'x1':start.x, 'y1':start.y, 'x2':reflectIntersect.intersect.x, 'y2':reflectIntersect.intersect.y});
		destroyHumans(new Phaser.Line(start.x, start.y, reflectIntersect.intersect.x, reflectIntersect.intersect.y));
		computeLasersRecursive(reflectIntersect.intersect, reflectIntersect.angle,reflectIntersect.mirror);		
		return;
	}
	else
	{
		
		if(reflectIntersect.intersect!==false){
			lines.push({'x1':start.x, 'y1':start.y, 'x2':reflectIntersect.intersect.x, 'y2':reflectIntersect.intersect.y});
			destroyHumans(new Phaser.Line(start.x, start.y, reflectIntersect.intersect.x, reflectIntersect.intersect.y));
		}
		else{
			lines.push({'x1':start.x, 'y1':start.y, 'x2':ray.end.x, 'y2':ray.end.y});
			destroyHumans(ray);			
		}
		return;
	}
	return;
}

function render(){
	if(!started){ 
		return;
	}
	if(beamActive){
		renderLasers();
	}
}
 var reflectsPoints=new Array();
 var intersectsPoints=new Array();

