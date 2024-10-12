import * as BABYLON from '@babylonjs/core'
import "@babylonjs/inspector";

import { yourNameVis } from './anu_boilerplate';

import * as anu from '@jpmorganchase/anu';
//import { anuVis } from './anuVis_compelte';
import { anuVisMultiUser } from './anuMultiuser_compelte';
import { MultiuserManager } from './MultiuserManager';


const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);


// A camera you control with arrow keys like a fps
// var camera = new BABYLON.UniversalCamera("mainCamera", new BABYLON.Vector3(0, 0.7, 0), scene);
// camera.fov = 90 * Math.PI / 180;
// camera.minZ = 0.1;
// camera.speed = 0.05;
// camera.attachControl(true);

// A camera that rotates around a set point
// Parameters: name, alpha, beta, radius, target position, scene
const camera = new BABYLON.ArcRotateCamera("Camera", -1, 0.9, 5, new BABYLON.Vector3(0, 0, 0), scene);
camera.minZ = 0.1;
camera.wheelPrecision = 50;
camera.attachControl(canvas, true);

// Some lighting, one up one down so we can cancel shadows. 
const ambientLight1 = new BABYLON.HemisphericLight("light-01", new BABYLON.Vector3(5, 5, 5), scene);
ambientLight1.intensity = 0.5;
const ambientLight2 = new BABYLON.HemisphericLight("light-02", new BABYLON.Vector3(-5, 5, -5), scene);
ambientLight2.intensity = 0.5;

// Babylon helper function to add a skybox and ground mesh. 
let env = scene.createDefaultEnvironment();
env.ground.position.y = -1.2;

// multiplayer stuff
// let babylonManager = new MultiuserManager(scene, engine);
// await babylonManager.start();

//Call the function that handels our chart logic passing in our scene
yourNameVis(scene);


// Save this for later when we want to see everyones together. 

// let scenes = {
//     'David': anuVis,
// }

// for (const [key, value] of Object.entries(scenes)) {
//     try {
//         value(scene);
//     } catch (e) {
//         console.warn("Error in: " + key + " scene")
//         console.warn(e);
//     }
//   }
// let allCharts = anu.selectName(Object.keys(scenes), scene); 
// let layout = anu.planeLayout('layout', {selection: allCharts, rows: 1, margin: new BABYLON.Vector2(1,1)}, scene);
// layout.root.position.y = 1;



//anuMultiuserVis(scene);



//Code to setup webXR when browser supports it. 
try {
    var defaultXRExperience = await scene.createDefaultXRExperienceAsync({ floorMeshes: [env.ground] });

    if (!defaultXRExperience.baseExperience) {
      console.log('No XR');
    } else {


      defaultXRExperience.baseExperience.sessionManager.onXRFrameObservable.addOnce(() => {
          defaultXRExperience.baseExperience.camera.position = new BABYLON.Vector3(0, -1.2, -2);
        })
     

      const featureManager = defaultXRExperience.baseExperience.featuresManager;

      if (!featureManager) {
        console.log('No Feature Manager');
      } else {
        defaultXRExperience.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, 'latest', {
          xrInput: defaultXRExperience.input,
        });
      }
    }
  } catch {
    console.warn('XR Not Supported');
  }



engine.runRenderLoop(() => {
    scene.render();
});


window.addEventListener('resize', () => {
    engine.resize();
});


window.addEventListener("keydown", async (ev) => {
    // Shift+Ctrl+Alt+I
    if (ev.key === "l") {
        if (scene.debugLayer.isVisible()) {
            scene.debugLayer.hide();
        } else {
            scene.debugLayer.show();
        }
    }

})
