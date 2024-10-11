import * as BABYLON from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials';
import "@babylonjs/inspector";
import * as anu from '@jpmorganchase/anu';
//import { anuVis } from './anuVis';
import { anuVis } from './anu_boilerplate_compelte';
import { MultiuserManager } from './MultiuserManager';
import { anuMultiuserVis } from './anuMultiuserVis-completed';


const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

var camera = new BABYLON.UniversalCamera("mainCamera", new BABYLON.Vector3(0, 0.7, 0), scene);
camera.fov = 90 * Math.PI / 180;
camera.minZ = 0.1;
camera.speed = 0.05;

const ambientLight1 = new BABYLON.HemisphericLight("light-01", new BABYLON.Vector3(5, 5, 5), scene);
ambientLight1.intensity = 0.8;
const ambientLight2 = new BABYLON.HemisphericLight("light-02", new BABYLON.Vector3(-5, 5, -5), scene);
ambientLight2.intensity = 0.8;

camera.attachControl(true);

let env = scene.createDefaultEnvironment();

// let grid = new GridMaterial("gridMaterial", scene);

// env.ground.material = grid;

let scenes = {
    'David': anuVis,
}


try {
    scenes['David'](scene);
} catch(e){
    console.error(e);
}


// Save this for later when we want to see everyones together. 

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


// let babylonManager = new MultiuserManager(scene, engine);
// await babylonManager.start();
// anuMultiuserVis(scene);



//Code to setup webXR when browser supports it. 
try {
    console.log('hi')
    var defaultXRExperience = await scene.createDefaultXRExperienceAsync({ floorMeshes: [env.ground] });

    if (!defaultXRExperience.baseExperience) {
      console.log('No XR');
    } else {
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
