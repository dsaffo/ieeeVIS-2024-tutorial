import * as anu from '@jpmorganchase/anu';
import * as d3 from "d3";
import { Vector3, ExecuteCodeAction, ActionManager, StandardMaterial} from '@babylonjs/core';
import iris from './data/iris.json' assert {type: 'json'};  //Our data
import { MultiuserManager } from './MultiuserManager';
// import { claimOwnership } from './network/collabxr-decorator';
// import { releaseOwnership } from './network/collabxr-decorator';

//Create and export a function that takes a Babylon engine and returns a Babylon Scene
export function anuVisMultiUser(scene){

  //Create the D3 functions that we will use to scale our data dimensions to desired output ranges for our visualization
  //In this case, we create scale functions that correspond to the x, y, and z positions
  //nice() adds some padding to both ends of the scale
  let scaleX = d3.scaleLinear().domain(d3.extent(d3.map(iris, (d) => {return d.sepalLength}))).range([-0.5,0.5]).nice();
  let scaleY = d3.scaleLinear().domain(d3.extent(d3.map(iris, (d) => {return d.petalLength}))).range([-0.5,0.5]).nice();
  let scaleZ = d3.scaleLinear().domain(d3.extent(d3.map(iris, (d) => {return d.sepalWidth}))).range([-0.5,0.5]).nice();
  
  //We also create a scale function for the three types of flowers in our iris dataset
  //ordinalChromatic() is an Anu helper function to create an array of hex colors, 'd310' specifies this to be schemecategory10 from D3
  //toStandardMaterial() is an Anu helper function to convert an array of hex colors to their respective StandardMaterial from Babylon
  let scaleC = d3.scaleOrdinal(anu.ordinalChromatic('d310').toStandardMaterial());

  //Create a Center of Transform TransformNode using create() that serves the parent node for all our meshes that make up our chart
  let CoT = anu.create("cot", "David");

  //We need to make an Anu Selection separately, as create() does not return a Section but the created Babylon TransformNode
  let chart = anu.selectName("David", scene);

  //Create sphere meshes for each row of our data and set their visual encodings using method chaining
  //These spheres are created as children of the CoT due to chart.bind()
  //Remember that in this case, 'CoT' is the Babylon TransformNode and 'chart' is the Anu Selection
  let spheres = chart.bind('sphere', { diameter: 0.02 }, iris)
                     .positionX((d) => scaleX(d.sepalLength))
                     .positionY((d) => scaleY(d.petalLength))
                     .positionZ((d) => scaleZ(d.sepalWidth))
                     .material((d) => scaleC(d.species))  
                     .action((d, n, i) => new ExecuteCodeAction(
                      ActionManager.OnPointerOverTrigger,
                          () => {
                          
                            console.log("index: " + i + " , " + JSON.stringify(d));
                           MultiuserManager.getInstance().hoverEventObj = {"dataPointID" : n.id, "scaleVec" : {x:1.5,y:1.5,z:1.5}};
                          }
                    ))
                    .action((d, n, i) => new ExecuteCodeAction(
                      ActionManager.OnPointerOutTrigger,
                          () => {
                           
                            console.log("index: " + i + " , " + JSON.stringify(d));
                            MultiuserManager.getInstance().hoverEventObj = { "dataPointID": n.id, "scaleVec": { x: 1.0, y: 1.0, z: 1.0 } };
                
                          }
                    ))
                    .prop("id", (d, n, i)=>{
                      return CoT.name + "-"+i;
                    }) //We set the material to change the spheres' color as our scaleC() was configured to return a StandardMaterial

  //Use the createAxes() Anu helper function to create the axes for us based on our D3 scale functions
  anu.createAxes('test', scene, { parent: chart, scale: { x: scaleX, y: scaleY, z: scaleZ } });

  chart.positionUI({billboard: false})
  .scaleUI({ minimum: 0.5, maximum: 2 })
  .rotateUI({billboard: false});

  let hoverMaterial = new StandardMaterial('hover', scene);


  const hoverDataPointHandler = (message: any) => {
 
    const selectedMesh = spheres.filter((d, n, i) => {
      return (n.id == message.dataPointID)
    }).selected[0];
  
    const scaleVec = new Vector3(message.scaleVec.x, message.scaleVec.y, message.scaleVec.z); 
    selectedMesh.scaling = scaleVec;
  
  }

  MultiuserManager.getInstance().hoverEventHandler = hoverDataPointHandler;



  return scene;
};