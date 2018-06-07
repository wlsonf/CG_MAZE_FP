"use strict"; //to prevent the weird error

//size of the cube
var birdeyeview = false;
var canvas, engine, camera, mainScene;
var gameOver = false;
var light2 = 0;
var username;
var timeText;
var old_time = new Date();

function createHuntsMaze(w, h, cx, cy){
	// With and height not set? stop
    if (!w || !h)
    	return [];
        
    // Store all the visited areas
    var visited = [];
        
	//Build the array
    var map = [];
        
    // Creates the 2nd dimension of the array
    for (var i = 0; i < w; i++)
    map[i] = [];
        
    // Offset if the array doesn't fit our needs.
    var offX = 1 - (cx % 2);
    var offY = 1 - (cy % 2);
        
    // Init the map and the visited array
    for (var i = 0; i < w; i++){
        for (var j = 0; j < h; j++){
            map[i][j] = false;
            visited[i + j * w] = false;
        }
    }
          
          	// Fill each 2nd cell with a true (those are the rooms)
          for (var i = 0; i < w - offX; i++){
          	for (var j = 0; j < h - offY; j++){
              if (i % 2 == 1 && j % 2 == 1 && i < w - (1 + offX) && j < h - (1 + offY))
                map[i + offX][j + offY] = true;
              else
                map[i + offX][j + offY] = false;
            }
          }
        
        	// Set the start point of the visit
          var todo = [{ x: 1 + offX, y: 1 + offY }];
          var done = [];
        
          visited[todo[0].x + todo[0].y * w] = true;
          var maxSteps = Math.round(w * h / 3);
        
        	// While we have something to visit
          while (todo.length > 0 && maxSteps > 0){
            maxSteps--;
            // Pick a random item from the todo
            var s = Math.floor(Math.random() * todo.length);
            var c = todo[s];
            done[done.length] = c;
            todo.splice(s, 1);
        
        		// Check if we can go to a room left (2 cells left)
            if (c.x > 1 + offX && visited[(c.x - 2) + c.y * w] == false)
            {
              todo[todo.length] = { x: c.x - 2, y: c.y };
              visited[(c.x - 2) + c.y * w] = true;
              // Open the wall to left
              map[(c.x) - 1][c.y] = true;
            }
        		// Check if we can go to a room up (2 cells up)
            if (c.y > 1 + offY && visited[(c.x) + (c.y - 2) * w] == false)
            {
              todo[todo.length] = { x: c.x, y: c.y - 2 };
              visited[(c.x) + (c.y - 2) * w] = true;
              // Open the wall to up
              map[c.x][(c.y) - 1] = true;
            }
        		// Check if we can go to a room right (2 cells right)
            if (c.x + 2 < w - 1 && visited[(c.x + 2) + c.y * w] == false)
            {
              todo[todo.length] = { x: c.x + 2, y: c.y };
              visited[(c.x + 2) + c.y * w] = true;
              // Open the wall to right
              map[(c.x) + 1][c.y] = true;
            }
        		// Check if we can go to a room right (2 cells down)
            if (c.y + 2 < h - 1 && visited[(c.x) + (c.y + 2) * w] == false)
            {
              todo[todo.length] = { x: c.x, y: c.y + 2 };
              visited[(c.x) + (c.y + 2) * w] = true;
              // Open the wall to bottom
              map[c.x][(c.y) + 1] = true;
            }
          }
        
          return map;
          }
                	var width, height, circleX, circleY;
		var wall_size = 2;

          var option = '1';
        	if (option = '1'){
        		width = height = 30;
        		circleX = circleY = 0;

        	}
        	else if (option = '2'){
        		width = height = 40;
        		circleX = circleY = 65;
        	}
        	else if (option = '3'){
        		width = height = 50;
        		circleX = circleY = 65;
        	}
        	else{
        		width = height = 50;
        		circleX = circleY = 0;
        	}
        	

            var createScene = function (username) {
            // console.log(username);
            //create scene


			var scene = new BABYLON.Scene(engine);
			//enable gravity
			var gravity = new BABYLON.Vector3 (0, -9.8, 0);
			scene.enablePhysics(gravity);
			scene.collisionsEnabled = true;


			// freeCamera.position = new BABYLON.Vector3(x1, 5, y1);

            //create camera
			camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,5,0), scene);
			// camera.MinZ = 1;
			camera.ellipsoid = new BABYLON.Vector3(1,1,1);
			camera.position = new BABYLON.Vector3(width/2 + 3, wall_size/2 - 1, height/2 + 3);
			camera.checkCollisions = true;
    		camera.applyGravity = true;
    		camera._needMoveForGravity = true;
    		camera.speed = 3;
    		camera.inertia = 0.5;
    		camera.ellipsoid = new BABYLON.Vector3(2.5, 1, 2.5);
    		// console.log("camera.ellipsoid: ", camera.ellipsoid);
    		// camera.setTarget(BABYLON.Vector3.Zero());
    		// camera.attachControl(canvas);
    		// Setup some variables for arrow keys.
	// camera.turnLeft = false;
	// camera.turnRight = false;
	// camera.turnUp = false;
	// camera.turnDown = false;
    		


			// create light
			var light = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 100, 0), scene);
			// light.diffuse = new BABYLON.Color3(0.5,0.2,0.1);
			light.intensity = 0.5;
			//			 new SpotLight(name: string, position: Vector3, 													direction: Vector3, angle: number, exponent: number, scene: Scene): SpotLight
			//START LIGHT INDICATOR
			var light1 = new BABYLON.SpotLight("light1", new BABYLON.Vector3(width/2 + 5.5, 10 , width/2 + 5.5), new BABYLON.Vector3(0, -1, 0), 0.75, 0, scene);
			// light2.range = 300;
			//FINISH LIGHT INDICATOR
			light2 = new BABYLON.SpotLight("light2", new BABYLON.Vector3(width*10 - 20, 10 , width*10 - 20), new BABYLON.Vector3(0, -1, 0), 0.75, 0, scene);
			light2.diffuse = new BABYLON.Color3(1, 0, 0);

			// light4.radius = 100;

			// var light4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(camera.position.x, 0, camera.position.z), scene);
			// light4.range = 10;
			// var light4 = new BABYLON.PointlLight("DirectionalLight", new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z), scene);


	


			//Distance between the camera and the target




			// var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(width/2 + 3, wall_size/2 - 1 , width/2 + 3), scene);
   //  		light1.diffuse = new BABYLON.Color3(1, 1, 1);
   //  		light1.intensity = 0;
    		// light1.range = 150;



        // Create a maze and render it
        function init()
        {

			// light4.range = 25;

        			
        	
        var maze = createHuntsMaze(width, height, circleX, circleY);

    var wallMat = new BABYLON.StandardMaterial("wallMat", scene);
	wallMat.emissiveTexture = new BABYLON.Texture("textures/GlazedBricks_diffuse.jpg", scene);
	wallMat.bumpTexture = new BABYLON.Texture("textures/GlazedBricks_reflection.jpg", scene);
	wallMat.specularTexture = new BABYLON.Texture("textures/GlazedBricks_normal.jpg", scene);


        var wall = BABYLON.Mesh.CreateBox("wall", wall_size, scene);
    	wall.checkCollisions = true;


        wall.material = wallMat;


          for(var x=0;x < width;x++)
          {
          	for(var y=0;y < height;y++)
            {
        	
            	if(maze[x][y] === true)
            		continue;
            // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
            var instance = wall.createInstance('');
        
            // Move the sphere upward 1/2 its height
            instance.position.x = x*10;
            instance.position.z = y*10;
            instance.scaling.z = 5
            instance.scaling.y = 2
            instance.scaling.x = 5
    		instance.checkCollisions = true;

             }
            
          }

		wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, friction: 0.2, restitution: 0.8}, scene);

         
        }
        
        init();


        
                      //create Material for Ground
	var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
	groundMat.emmissiveTexture = new BABYLON.Texture("textures/groundEmmissive.jpg", scene);
	groundMat.emmissiveTexture.uScale = width;
	groundMat.emmissiveTexture.vScale = height;
	groundMat.bumpTexture = new BABYLON.Texture("textures/groundBump.jpg", scene);
	groundMat.bumpTexture.uScale = width;
	groundMat.bumpTexture.vScale = height;
	groundMat.specularTexture = new BABYLON.Texture("textures/groundSpecular.jpg", scene);
	groundMat.specularTexture.uScale = width;
	groundMat.specularTexture.vScale = height;
        
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground", width*wall_size, width*wall_size, width, scene);
    ground.position.x = 145;
    ground.position.y = -2;
    ground.position.z = 145;
    ground.scaling.z = 5;
	ground.scaling.y = 2;
	ground.scaling.x = 5;
	// ground.setVisible = false;


		ground.material = groundMat;
	ground.checkCollisions = true;



	// https://doc.babylonjs.com/how_to/skybox
	var skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyBoxMat = new BABYLON.StandardMaterial("skyBox", scene);
	skyBoxMat.backFaceCulling = false;
	skyBoxMat.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
	skyBoxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyBoxMat.diffuseColor = new BABYLON.Color3(0,0,0);
	skyBoxMat.specularColor = new BABYLON.Color3(0,0,0);
	skyBox.material = skyBoxMat;




	var animateCameraPositionAndRotation = function (camera, fromPosition, toPosition,
                                                 fromRotation, toRotation) {

    var animCamPosition = new BABYLON.Animation("animCam", "position", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysPosition = [];
    keysPosition.push({
        frame: 0,
        value: fromPosition
    });
    keysPosition.push({
        frame: 100,
        value: toPosition
    });

    animCamPosition.setKeys(keysPosition);

    var animCamRotation = new BABYLON.Animation("animCam", "rotation", 30,
                              BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysRotation = [];
    keysRotation.push({
        frame: 0,
        value: fromRotation
    });
    keysRotation.push({
        frame: 100,
        value: toRotation
    });

    animCamRotation.setKeys(keysRotation);
    camera.animations.push(animCamPosition);
    camera.animations.push(animCamRotation);

    scene.beginAnimation(camera, 0, 100, false);
};
			// 260 < z || z < 300
            

var camPositionMaze = 0;
var camRotationMaze = 0;
var light3;
var locked = false;

	window.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) {
    	if(locked){
        		return;
        	}
        locked = true;
        if (!birdeyeview) {
        	light3 = new BABYLON.SpotLight("light3", new BABYLON.Vector3(camera.position.x, 5, camera.position.z), new BABYLON.Vector3(0, -1, 0), 0.75, 0, scene);
			light3.diffuse = new BABYLON.Color3(0, 1, 0);
        	light3.setEnabled(true);        	
            birdeyeview = true;
            // Saving current position & rotation in the maze
            camPositionMaze = camera.position;
            camRotationMaze = camera.rotation;
            // console.log(camera.position);
            // console.log(camera.rotation);
            // gameOver=true;
            // console.log(camera.position.z);
            // console.log(light2.position.z);
            // console.log(light2.position.z+20);
            // console.log(light2.position.z-20);




            animateCameraPositionAndRotation(camera, camera.position,
                new BABYLON.Vector3(width*5, 500, height*5),
                camera.rotation,
                new BABYLON.Vector3(1.4912565104551518, -1.5709696842019767,camera.rotation.z));

            // console.log(birdeyeview);
        }
        else {
            // console.log(birdeyeview);
        	light3.setEnabled(false);            
        	birdeyeview = false;
            // console.log(camPositionMaze);
            // console.log(camera.camRotationMaze);
            animateCameraPositionAndRotation(camera, camera.position,
                camPositionMaze, camera.rotation, camRotationMaze);
        }
        setTimeout( function(){locked = false;},4500)
        camera.applyGravity = !birdeyeview;
    }
}, false);
        
            return scene;



        
        };
        
        // var scene = createScene();

        // engine.runRenderLoop(function () {
        //     if (scene) {
        //         scene.render();
        //     }
        // });

        // // Resize
        // window.addEventListener("resize", function () {
        //     engine.resize();
        // });

// document.addEventListener('DOMContentLoader', function() {
    window.onload = function () {

    canvas = document.getElementById("renderCanvas");

// $(function () {
//   $( "#dialog-form" ).dialog({
//     autoOpen: false,
//   });
// }


   	$("#dialog-form").dialog({
        autoOpen: true,
        height: 400,
        width: 800,
        modal: true,
        buttons: {
            "Let's Go": function () {
            //Creating scene
            mainScene = createScene($("#name").val());
            username = document.getElementById("name").value;

            // console.log($("#name").val());
            // console.log(username);
            // console.log(#name);

            // mainScene.activeCamera.attachControl(canvas);
        mainScene.activeCamera = camera;
        mainScene.activeCamera.attachControl(canvas);
    	mainScene.activeCamera.keysUp.push(87);	// W
    	mainScene.activeCamera.keysLeft.push(65); // A 
    	mainScene.activeCamera.keysDown.push(83); // S 
    	mainScene.activeCamera.keysRight.push(68); // D

    	startGame();
    	flagGenerator();
    	// timeSpent();


                canvas.className = "offScreen onScreen";
                $(this).dialog("close");
            }
        }
    });


    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        // Enable keyboard/mouse controls on the scene (FPS like mode)
        // engine.isPointerLock = true;        



    	}
	};



function flagGenerator(){
    console.log(light2.position);
	
	var flag = new BABYLON.SceneLoader.ImportMesh("", "", "models/objFlag.babylon", mainScene, function(newMeshes){
    flag = newMeshes[0];
    // flag.scaling = 10;
    flag.position=light2.position;
    console.log(flag.position);
    console.log(light2.position);
    console.log("cia");
});
}

function startGame(){



		engine.runRenderLoop(function () {
			// console.log(camera.position);

			// var light4 = new BABYLON.SpotLight("light4", new BABYLON.Vector3(width/2 + 5, 10 , width/2 + 5), new BABYLON.Vector3(0, -1, 0), 0.75, 0, mainScene);

// flagGenerator();
        	mainScene.render();
        	// console.log("selow");

        	if (gameOver == true){
        		console.log("GameOver");
    			// engine.stopRenderLoop();   
    			endGame();   		
        	}

        	if (!gameOver && light2.position.z -2 < camera.position.z && camera.position.z < light2.position.z+2 &&  light2.position.x-2  < camera.position.x && camera.position.x -2 < light2.position.x+2){
			// console.log("faking logic fail");
			gameOver = true;
		}


    		// engine.stopRenderLoop();


        });
}

function endGame(){

	engine.stopRenderLoop();
    // canvas = document.getElementById("renderCanvas");

	// var idk = document.getElementById("gameEnd");
	// idk.style.display = "block";
	// $("#gameEnd").html("Congratulation" + "#name");
;
var new_time = new Date();

	var seconds_passed = new_time - old_time;

        window.alert('Thanks for Playing ' + username + ', Your Time is: ' + seconds_passed/1000);
0
        // startGame();
        location.reload();
}

