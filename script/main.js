"use strict"; //to prevent the weird error

//size of the cube
var wall_size = 8;
var birdeyeview = false;
var canvas, engine, camera, mainScene;

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

            var createScene = function () {

            //create scene
			var scene = new BABYLON.Scene(engine);
			//enable gravity
			var gravity = new BABYLON.Vector3 (0, 9.8, 0);
			scene.enablePhysics(gravity);
			scene.collisionsEnabled = true;

            //create camera
			camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,5,0), scene);
			camera.MinZ = 1;
			camera.checkCollision = true;
			camera.applyGravity = true;
			camera.ellipsoid = new BABYLON.Vector3(1,1,1);

			// create light
			var light = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 8, 0), scene);
			// light.diffuse = new BABYLON.Color3(0.5,0.2,0.1);
			light.intensity = 0.8;

        	var width, height, circleX, circleY;

        // Create a maze and render it
        function init()
        {
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
        var maze = createHuntsMaze(width, height, circleX, circleY);

    var wallMat = new BABYLON.StandardMaterial("wallMat", scene);
	wallMat.emissiveTexture = new BABYLON.Texture("textures/GlazedBricks_diffuse.jpg", scene);
	wallMat.bumpTexture = new BABYLON.Texture("textures/GlazedBricks_reflection.jpg", scene);
	wallMat.specularTexture = new BABYLON.Texture("textures/GlazedBricks_normal.jpg", scene);


        var wall = BABYLON.Mesh.CreateBox("wall", 2, scene);

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
             }
            
          }
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
            var ground = BABYLON.Mesh.CreateGround("ground", width, 6, 2, scene);

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

    window.onload = function () {
    canvas = document.getElementById("renderCanvas");

    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        mainScene = createScene();
        // Enable keyboard/mouse controls on the scene (FPS like mode)
        mainScene.activeCamera.attachControl(canvas);

        engine.runRenderLoop(function () {
            mainScene.render();
        });
    }
};

// function createMaze(username){
// 	//dynamically change the size of the ground and walls
// 	var mCount = 33;

// 	//create scene
// 	var scene = new BABYLON.Scene(engine);
// 	//enable gravity
// 	var gravity = new BABYLON.Vector3 (0, 9.8, 0);
// 	scene.enablePhysics(gravity);
// 	scene.collisionsEnabled = true;

// 	//create camera
// 	camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,5,0), scene);
// 	camera.MinZ = 1;
// 	camera.checkCollision = true;
// 	camera.applyGravity = true;
// 	camera.ellipsoid = new BABYLON.Vector3(1,1,1);

// 	//create Material for Ground
// 	var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
// 	groundMat.emmissiveTexture = new BABYLON.Texture("textures/groundEmmissive.jpg", scene);
// 	groundMat.emmissiveTexture.uScale = mCount;
// 	groundMat.emmissiveTexture.vScale = mCount;
// 	groundMat.bumpTexture = new BABYLON.Texture("textures/groundBump.jpg", scene);
// 	groundMat.bumpTexture.uScale = mCount;
// 	groundMat.bumpTexture.vScale = mCount;
// 	groundMat.specularTexture = new BABYLON.Texture("textures/groundSpecular.jpg", scene);
// 	groundMat.specularTexture.uScale = mCount;
// 	groundMat.specularTexture.vScale = mCount;


// 	//create Ground
// 	var ground = new BABYLON.Mesh.CreateGround("ground", (mCount+2) * wall_size,
// 														(mCount+2) * wall_size, 1, scene, false);
// 	ground.material = groundMat;
// 	ground.checkCollisions = true;

// 	// https://doc.babylonjs.com/how_to/skybox
// 	var skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
// 	var skyBoxMat = new BABYLON.StandardMaterial("skyBox", scene);
// 	skyBoxMat.backFaceCulling = false;
// 	skyBoxMat.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
// 	skyBoxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
// 	skyBoxMat.diffuseColor = new BABYLON.Color3(0,0,0);
// 	skyBoxMat.specularColor = new BABYLON.Color3(0,0,0);
// 	skyBox.material = skyBoxMat;



// 	// create light
// 	var light = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 8, 0), scene);
// 	// light.diffuse = new BABYLON.Color3(0.5,0.2,0.1);
// 	light.intensity = 0.8;

//     // var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
//     // light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
//     // light0.intensity = 0.2;

//     // var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
//     // light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
//     // light1.intensity = 0.2;

//     // create Wall
//     // https://doc.babylonjs.com/how_to/multi_materials
// 	var row = 15;
// 	var col = 20;

// 	var wallMat = new BABYLON.StandardMaterial("wallMat", scene);
// 	wallMat.emissiveTexture = new BABYLON.Texture("textures/GlazedBricks_diffuse.jpg", scene);
// 	wallMat.bumpTexture = new BABYLON.Texture("textures/GlazedBricks_reflection.jpg", scene);
// 	wallMat.specularTexture = new BABYLON.Texture("textures/GlazedBricks_normal.jpg", scene);

// 	var wallRoofMat = new BABYLON.StandardMaterial("wallRoofMat", scene);
// 	wallRoofMat.emissiveColor = new BABYLON.Color3(0, 0.1, 0.0);

// 	var wallMultiMat = new BABYLON.MultiMaterial("wallMultiMat", scene);
// 	wallMultiMat.subMaterials.push(wallRoofMat);
// 	wallMultiMat.subMaterials.push(wallMat);



// 	var mainCube = BABYLON.Mesh.CreateBox("mainCube", wall_size, scene);
// 	mainCube.subMeshes = [];
// 	mainCube.subMeshes.push(new BABYLON.SubMesh(0, 0, 4, 0, 6, mainCube));
// 	mainCube.subMeshes.push(new BABYLON.SubMesh(1, 4, 20, 6, 30, mainCube));
// 	mainCube.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
// 	mainCube.material = wallMultiMat;
// 	mainCube.checkCollisions = true;
// 	mainCube.position = new BABYLON.Vector3(wall_size / 2 + (row - (mCount / 2)) * wall_size, wall_size / 2,
//                                         wall_size / 2 + (col - (mCount / 2)) * wall_size);


//     return scene;
// };

//     window.onload = function () {
//     canvas = document.getElementById("canvas");

//     if (!BABYLON.Engine.isSupported()) {
//         window.alert('Browser not supported');
//     } else {
//         engine = new BABYLON.Engine(canvas, true);

//         window.addEventListener("resize", function () {
//             engine.resize();
//         });

//         mainScene = createMaze("user1");
//         // Enable keyboard/mouse controls on the scene (FPS like mode)
//         mainScene.activeCamera.attachControl(canvas);

//         engine.runRenderLoop(function () {
//             mainScene.render();
//         });
//     }
// };