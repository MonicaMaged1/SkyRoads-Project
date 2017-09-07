document.addEventListener("DOMContentLoaded", startGame, false);

var canvas;
var engine;
var activeScene;
var prevScene;
var isWPressed = false;
var isSPressed = false;
var isDPressed = false;
var isAPressed = false;
var isFPressed = false;
var isIPressed = false;
var isKPressed = false;
var isLPressed = false;
var isJPressed = false;
var isOPressed = false;
var multi = false;
var whatGravity = false;
var isDrunk = false;
var box;
var particleSystem;
var roadMat;
var levels = [];
var camera;
var Game = {};
Game.scene = [];
Game.ind = 0;

Game.createHomeScene = function (){
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    whatGravity = false;
    isDrunk = false;
    //Levels list
    var angle = 0;
    for(var i = 1; i <= 9; i++) {
        levels[i] = new BABYLON.Mesh.CreateSphere("lvl" + i, 30, 1.5, activeScene);
        levels[i].position = new BABYLON.Vector3(10 * Math.cos(angle), 1,10 * Math.sin(angle));
        angle -= 2 * Math.PI / 9;
        var lvlMat = new BABYLON.StandardMaterial("lvlMat", activeScene);
        lvlMat.diffuseTexture = new BABYLON.Texture("images/"+i+".jpg", activeScene);
        levels[i].material = lvlMat;
    }
    loadFawzya();
    setEnvironment("home");
    createGround(100,100,0,0,0,0,0,0);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        // applysskMovements();
        levels.forEach(function(element) {
                    if (box.intersectsMesh(element, false)) {
                        GroundsNum = 0; ObsNum = 0;
                        multi = false;
                        fCrashed = false;
                        sCrashed = false;
                        switch(element.name) {
                            case 'lvl1' :
                                Game.createLevel1();
                                break;
                            case 'lvl2' :
                                Game.createLevel2();
                                break;
                            case 'lvl3' :
                                Game.createLevel3();
                                break;
                            case 'lvl4' :
                                Game.createLevel4();
                                break;
                            case 'lvl5' :
                                Game.createLevel5();
                                break;
                            case 'lvl6' :
                                Game.createLevel6();
                                break;
                            case 'lvl7' :
                                Game.createLevel7();
                                break;
                            case 'lvl8' :
                                Game.createLevel8();
                                break;
                            case 'lvl9' :
                                Game.createLevel9();
                                break;
                            default :
                                break;
                        }
                        Game.ind+= 1;
                    }
        });
    }
    return scene;
}

var fCrashed = false;
var sCrashed = false;
// function GameOver(winGround,yFall = 0.07){
//         if(multi){
//             for(var i = 0 ; i < ObsNum ; i++) {
//                 if (box.intersectsMesh(Obstacles[i], false)) {
//                     Explosion(box);
//                     fCrashed = true;
//                     break;
//                 }
//                 if (box2.intersectsMesh(Obstacles[i], false)) {
//                     Explosion(box2);
//                     sCrashed = true;
//                     break;
//                 }
//             }
//             if (box.position.y < yFall) {
//                 Explosion(box);
//                 setTimeout(function () {
//                     particleSystem.stop();
//                 }, 500);
//                 fCrashed = true;
//             }
//             if (box2.position.y < yFall) {
//                 Explosion(box2);
//                 setTimeout(function () {
//                     particleSystem.stop();
//                 }, 500);
//                 sCrashed = true;
//             }
//         }else{
//             for(var i = 0 ; i < ObsNum ; i++) {
//                 if (box.intersectsMesh(Obstacles[i], false)) {
//                     Explosion(box);
//                     Game.createHomeScene();
//                     console.log("tank collided with " + Obstacles[i].name);
//                     setTimeout(function () {
//                         Game.ind += 1;
//                     }, 1000);
//                     break;
//                 }
//             }
//             if (box.position.y < yFall) {
//                 Explosion(box);
//                 Game.createHomeScene();
//                 setTimeout(function () {
//                     Game.ind+=1;
//                 }, 500);
//             }
//         }
//     if(multi && (fCrashed || sCrashed)){
//         Game.createHomeScene();
//         Game.ind += 1;
//     }
//     if (box.intersectsMesh(Grounds[winGround], false)){console.log("e2fesh");}
// }
function checkObs(){
    if(multi){
        for(var i = 0 ; i < ObsNum ; i++) {
            if (box.intersectsMesh(Obstacles[i], false)) {
                Explosion(box);
                fCrashed = true;
                break;
            }
            if (box2.intersectsMesh(Obstacles[i], false)) {
                Explosion(box2);
                sCrashed = true;
                break;
            }
        }
    }else{
        for(var i = 0 ; i < ObsNum ; i++) {
            if (box.intersectsMesh(Obstacles[i], false)) {
                Explosion(box);
                Game.createHomeScene();
                console.log("tank collided with " + Obstacles[i].name);
                setTimeout(function () {
                    Game.ind += 1;
                }, 1000);
                break;
            }
        }
    }
    if(multi && (fCrashed || sCrashed)){
        Game.createHomeScene();
        Game.ind += 1;
    }
}
function checkFall(yFall = 0.1){
    if(multi){
        if (box.position.y < yFall) {
            Explosion(box);
            setTimeout(function () {
                particleSystem.stop();
            }, 500);
            fCrashed = true;
        }
        if (box2.position.y < yFall) {
            Explosion(box2);
            setTimeout(function () {
                particleSystem.stop();
            }, 500);
            sCrashed = true;
        }
    }else{
        if (box.position.y < yFall) {
            Explosion(box);
            Game.createHomeScene();
            setTimeout(function () {
                Game.ind+=1;
            }, 500);
        }
    }
    if(multi && (fCrashed || sCrashed)){
        Game.createHomeScene();
        Game.ind += 1;
    }
}

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    // engine.displayLoadingUI();
    Game.createHomeScene();
    setListeners();
    // setTimeout(function () {particleSystem.start();},2000);
    engine.runRenderLoop(function () {
        applysskMovements();
        Game.scene[Game.ind].renderLoop();
        // console.log(box.position.y);
    });
}

function loadFawzya(){
    //FAW-zya
    box = new BABYLON.Mesh.CreateBox("Spaceship",1,activeScene);
    var bm = new BABYLON.StandardMaterial("BM",activeScene);
    bm.alpha = 0.1;
    box.scaling = new BABYLON.Vector3(0.3,0.3,0.3);
    box.position = new BABYLON.Vector3(0,0.3,0);
    box.material = bm;
    box.speed = 5;
    box.frontVector = new BABYLON.Vector3(0, 0, -1);
    box.yRotation = 0;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, friction: 0.15, restitution: 0 }, activeScene);
    box.applyGravity = true;
    BABYLON.SceneLoader.ImportMesh("", "scenes/", "sg-light-destroyer.babylon", activeScene, onShipLoaded);
    function onShipLoaded(newMeshes, particeSystems,skeletons) {
        // newMeshes[0].scaling = new BABYLON.Vector3(0.3,0.3,0.3);
        newMeshes[0].parent = box;
    }
}

function setEnvironment(imgName){
    //Background
    var background = new BABYLON.Layer("back", "images/"+imgName+".jpg", activeScene);
    background.isBackground = true;
    background.texture.level = 0;

    //Light
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), activeScene);

    //Camera
    camera = new BABYLON.FollowCamera("follow",
        new BABYLON.Vector3(0, 2, -5), activeScene);
    camera.lockedTarget = box;
    camera.radius = 10; // how far from the object to follow
    camera.heightOffset = 2; // how high above the object to place the camera
    camera.rotationOffset = 0; // the viewing angle
    camera.cameraAcceleration = 0.05 // how fast to move
    camera.maxCameraSpeed = 20 // speed limit
    activeScene.activeCameras.push(camera);
}

function Explosion(player){
    particleSystem = new BABYLON.ParticleSystem("particles", 2000, activeScene);
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png", activeScene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = player;
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 0);
    particleSystem.color2 = new BABYLON.Color4(1, 200/255, 0, 0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.7;
    particleSystem.emitRate = 2000;
    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 8);
    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -8);
    particleSystem.gravity = new BABYLON.Vector3(0, 9.81, 0);
    particleSystem.start();
}
function applysskMovements() {
    var jump = 0.3;
    if (isFPressed && isWPressed && box.position.y < 0.5) {
        if(whatGravity)jump = 120;
        else jump = 60;
    }else {jump = 0.3;}

    if (isWPressed) {
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x) * -1 * box.speed,jump, Number(box.frontVector.z) *-1* box.speed));
    }
    if (isSPressed) {
        box.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box.frontVector.x)  * box.speed, Number(box.frontVector.y) * box.speed, Number(box.frontVector.z)  * box.speed));
    }
    if (isDPressed){
        if(isDrunk){box.yRotation -= .05;}
        else box.yRotation += .05;
    }
    if (isAPressed) {
        if(isDrunk){box.yRotation += .05;}
        else box.yRotation -= .05;
    }
    box.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(box.yRotation, 0, 0);
    box.frontVector.x = Math.sin(box.yRotation);
    box.frontVector.z = Math.cos(box.yRotation);

    if(multi){
        var jump2 = 0.3;
        if (isOPressed && isIPressed && box2.position.y < 0.5) {
            if(whatGravity)jump2 = 120;
            else jump2 = 60;
        }else {jump2 = 0.3;}

        if (isIPressed) {
            box2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box2.frontVector.x) * -1 * box2.speed,jump2, Number(box2.frontVector.z) *-1* box2.speed));
        }
        if (isKPressed) {
            box2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Number(box2.frontVector.x)  * box2.speed, Number(box2.frontVector.y) * box2.speed, Number(box2.frontVector.z) * box2.speed));
        }
        if (isLPressed){
            if(isDrunk){box2.yRotation -= .05;}
            else box2.yRotation += .05;
        }
        if (isJPressed){
            if(isDrunk){box2.yRotation += .05;}
            else box2.yRotation -= .05;
        }
        box2.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(box2.yRotation, 0, 0);
        box2.frontVector.x = Math.sin(box2.yRotation);
        box2.frontVector.z = Math.cos(box2.yRotation);
    }
}

function setListeners(){
    document.addEventListener("keyup", function () {
        if (event.key == 'a' || event.key == 'A') {isAPressed = false;}
        if (event.key == 's' || event.key == 'S') {isSPressed = false;}
        if (event.key == 'd' || event.key == 'D') {isDPressed = false;}
        if (event.key == 'w' || event.key == 'W') {isWPressed = false;}
        if (event.key == 'f' || event.key == 'F') {isFPressed = false;}

        if (event.key == 'i' || event.key == 'I') {isIPressed = false;}
        if (event.key == 'k' || event.key == 'K') {isKPressed = false;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = false;}
        if (event.key == 'l' || event.key == 'L') {isLPressed = false;}
        if (event.key == 'o' || event.key == 'O') {isOPressed = false;}

        if ((event.key == 'm' || event.key == 'M') && !multi) {enableMulti(); multi = true;}
    });

    document.addEventListener("keydown", function () {
        if (event.key == 'a' || event.key == 'A') {isAPressed = true;}
        if (event.key == 's' || event.key == 'S') {isSPressed = true;}
        if (event.key == 'd' || event.key == 'D') {isDPressed = true;}
        if (event.key == 'w' || event.key == 'W') {isWPressed = true;}
        if (event.key == 'f' || event.key == 'F') {isFPressed = true;}

        if (event.key == 'i' || event.key == 'I') {isIPressed = true;}
        if (event.key == 'k' || event.key == 'K') {isKPressed = true;}
        if (event.key == 'j' || event.key == 'J') {isJPressed = true;}
        if (event.key == 'l' || event.key == 'L') {isLPressed = true;}
        if (event.key == 'o' || event.key == 'O') {isOPressed = true;}
    });
}

var Grounds = [];
var GroundsNum = 0;
function createGround(len,wid, xPos, yPos, zPos,rr,gg,bb, fric = 0.01){
    Grounds[GroundsNum] = new BABYLON.Mesh.CreateBox("Ground"+GroundsNum,1,activeScene);
    Grounds[GroundsNum].scaling = new BABYLON.Vector3(wid,0.1,len);
    Grounds[GroundsNum].position = new BABYLON.Vector3(xPos,yPos,zPos);
    roadMat = new BABYLON.StandardMaterial("RMat",activeScene);
    roadMat.alpha = 0.5;
    roadMat.diffuseColor = new BABYLON.Vector3(rr,gg,bb);
    Grounds[GroundsNum].checkCollisions = true;
    Grounds[GroundsNum].physicsImpostor = new BABYLON.PhysicsImpostor(Grounds[GroundsNum], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: fric, restitution: 0.01 }, activeScene);
    Grounds[GroundsNum].material = roadMat;
    GroundsNum++;
}

var Obstacles = [];
var ObsNum = 0;
function createObstacle(wid,hieght,len, xPos, yPos, zPos,rr,gg,bb,m = 200){
    Obstacles[ObsNum] = new BABYLON.Mesh.CreateBox("Obs",1,activeScene);
    Obstacles[ObsNum].scaling = new BABYLON.Vector3(wid,hieght,len);
    Obstacles[ObsNum].position = new BABYLON.Vector3(xPos,yPos,zPos);
    ObsMat = new BABYLON.StandardMaterial("ObsMat",activeScene);
    ObsMat.alpha = 1;
    ObsMat.diffuseColor = new BABYLON.Vector3(rr,gg,bb);
    Obstacles[ObsNum].checkCollisions = true;
    Obstacles[ObsNum].physicsImpostor = new BABYLON.PhysicsImpostor(Obstacles[ObsNum], BABYLON.PhysicsImpostor.BoxImpostor, { mass: m, friction: 1, restitution: 0.01 }, activeScene);
    Obstacles[ObsNum].material = ObsMat;
    ObsNum++;
}

Game.createLevel1 = function () { //"You Know What To Do !"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("1");
    createGround(100,5,0,0,0,1,1,1);
    createGround(50,5,10,0,0,1,0,0);
    createGround(50,5,-10,0,0,1,1,0);
    createGround(10,3,0,0,-60,1,1,1);
    createGround(10,3,0,0,-75,0,1,1);
    createGround(10,5,10,0,-90,1,1,1);
    createGround(10,5,-10,0,-90,1,1,1);
    createGround(10,3,0,-5,-130,1,0,1);
    createGround(10,3,10,-3,-135,0,0,1);
    createGround(10,5,-10,-3,-135,0,0,1);
    createGround(20,5,0,0,-145,0,0.5,1);
    // createGround(15,15,0,0,-175,0.5,0,1);
    createGround(10,10,0,0,-165,0.5,0,1);
    createGround(10,10,10,0,-175,0.5,0,1);
    createGround(10,10,-10,0,-175,0.5,0,1);
    createGround(10,10,0,0,-185,0.5,0,1);
    createGround(20,8,0,0,-205,0,0.8,0.3);
    createGround(20,6,0,0,-225,0,0.8,0.3);
    createGround(20,4,0,0,-245,0,0.8,0.3);
    createGround(20,2,0,0,-265,0,0.8,0.3);
    createGround(20,1,0,0,-285,0,0.8,0.3);
    createGround(50,2,-5,0,-310,0.2,0.8,0.6);
    createGround(5,5,0,0,-335,0.2,0.8,0.6);
    createGround(50,2,5,0,-355,0.2,0.8,0.6);
    createGround(5,5,0,0,-380,0.2,0.8,0.6);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        // GameOver(23);
        checkFall();
        checkObs();
        if (box.intersectsMesh(Grounds[23], false)){console.log("e2fesh");}
    }
    return scene;
}

Game.createLevel2 = function () { //"TWO is my lucky number"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    var count = 0;
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("2");
    // Explosion();
    createGround(50,5,0,0,-25,1,1,1);
    createGround(5,50,27.5,0,-47.5,1,1,1);
    createGround(50,5,50,0,-75,1,1,1);
    createGround(5,100,2.5,0,-102.5,1,1,1);
    createGround(2,50,-72.5,0,-102.5,1,1,1);
    createGround(100,4,-99.5,0,-53.5,1,1,1);
    createGround(3.5,99,-52,0,-1.75,1,1,1);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        if (box.intersectsMesh(Grounds[0], false)&& box.intersectsMesh(Grounds[6], false)){count++;}
        if (count == 3){Game.createHomeScene();
            Game.ind += 1;}
    }
    return scene;
}

Game.createLevel3 = function () { //"Porsche with no brakes"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("3");
    // todo
    createGround(100,5,0,0,0,1,1,1,0);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        GameOver(0);// set win ground instead of 0
    }
    return scene;
}

Game.createLevel4 = function () { //"Let go, trust me"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    var letGo = false;
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("4");
    createGround(50,5,0,0,-20,0.7,0.7,0.3);
    createGround(10,4,4.5,0,-50,0.7,0.7,0.3);
    createGround(10,4,-4.5,0,-50,0.7,0.7,0.3);
    createGround(10,4,8.5,0,-60,0.7,0.7,0.3);
    createGround(10,4,-8.5,0,-60,0.7,0.7,0.3);
    createGround(10,4,12.5,0,-70,0.7,0.7,0.3);
    createGround(10,4,-12.5,0,-70,0.7,0.7,0.3);
    createGround(30,3,12.5,0,-95,0.7,0.7,0.3);
    createGround(30,3,-12.5,0,-95,0.7,0.7,0.3);
    createGround(30,2,12.5,0,-133,0.7,0.7,0.3);
    createGround(30,2,-12.5,0,-133,0.7,0.7,0.3);
    createGround(30,10,0,0,-168,0.7,0.7,0.3);
    createObstacle(2,2,1,4,0,-160,1,0,0);
    createObstacle(2,2,1,2,0,-161,1,0,0);
    createObstacle(2,2,1,0,0,-162,1,0,0);
    createObstacle(2,2,1,-4,0,-167,1,0,0);
    createObstacle(2,2,1,-2,0,-168,1,0,0);
    createObstacle(2,2,1,0,0,-169,1,0,0);
    createObstacle(2,2,1,4,0,-174,1,0,0);
    createObstacle(2,2,1,2,0,-175,1,0,0);
    createObstacle(2,2,1,0,0,-176,1,0,0);
    createGround(5,5,0,0,-190,0.7,0.7,0.3);
    createGround(5,5,0,0,-200,0.7,0.7,0.3);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        if(letGo){
            if(multi){

            }
            else
                if (box.position.y < -100){console.log("e2fesh");}
        }
        else{
            checkObs();
            checkFall();
        }
        if (box.intersectsMesh(Grounds[13], false)){letGo = true;}
    }
    return scene;
}

Game.createLevel5 = function () { //"just give up this time"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("5");
    // todo
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
    }
    return scene;
}

Game.createLevel6 = function () { //"after 6th bottle of vodka"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    isDrunk = true;
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("6");
    // todo
    createGround(50,5,0,0,-20,0.9,0.72,0.18);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
        checkObs();
    }
    return scene;
}

Game.createLevel7 = function () { //"what gravity ?!"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("7");
    whatGravity = true;
    // todo
    createGround(100,5,0,0,0,1,1,1);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkObs();
        checkFall();
    }
    return scene;
}

Game.createLevel8 = function () { //"Gone in 60 seconds"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("8");
    var Timer = setTimeout(function () {
        Game.createHomeScene();
        Game.ind+=1;
    }, 60000);
    // todo
    createGround(100,5,0,0,0,0.86,0.12,0.52);
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkObs();
        checkFall();
        // clearTimeout(Timer);
    }
    return scene;
}

Game.createLevel9 = function () { //"built TOUGH"
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0,-40, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    activeScene = scene
    activeScene.enablePhysics(gravityVector, physicsPlugin);
    loadFawzya();
    setEnvironment("9");
    // todo
    var sceneIndex = Game.scene.push(scene) - 1;
    Game.scene[sceneIndex].renderLoop = function () {
        this.render();
        checkFall();
    }
    return scene;
}

function enableMulti(){
    //Sama7
    box2 = new BABYLON.Mesh.CreateBox("Spaceship2",1,activeScene);
    var bm2 = new BABYLON.StandardMaterial("BM",activeScene);
    bm2.alpha = 0.1;
    box2.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    box2.position = new BABYLON.Vector3(0,0.3,-2);
    box2.material = bm2;
    box2.speed = 5;
    box2.frontVector = new BABYLON.Vector3(0, 0, -1);
    box2.yRotation = 0;
    box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 20, friction: 0.15, restitution: 0 }, activeScene);
    box2.applyGravity = true;
    BABYLON.SceneLoader.ImportMesh("", "scenes/", "sg-light-destroyer.babylon", activeScene, onShipLoaded);
    function onShipLoaded(newMeshes, particeSystems,skeletons) {
        newMeshes[0].parent = box2;
    }
    var camera2 = new BABYLON.FollowCamera("follow",
        new BABYLON.Vector3(0, 2, -5), activeScene);
    camera2.lockedTarget = box2;
    camera2.radius = 10; // how far from the object to follow
    camera2.heightOffset = 2; // how high above the object to place the camera
    camera2.rotationOffset = 0; // the viewing angle
    camera2.cameraAcceleration = 0.05 // how fast to move
    camera2.maxCameraSpeed = 20 // speed limit
    activeScene.activeCameras.push(camera2);
    camera2.viewport = new BABYLON.Viewport(0.5,0,0.5,1);
    camera.viewport = new BABYLON.Viewport(0,0,0.5,1);
}