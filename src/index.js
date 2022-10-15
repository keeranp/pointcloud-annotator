import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { displayPoints, init } from './app';

init()

if(document.getElementById("EXAMPLE")){
    console.log("Test Page")
    
    const loader = new PCDLoader();

    loader.load("assets/Zaghetto.pcd", points => {
        displayPoints(points, "Zaghetto.pcd")
    })
}

document.getElementById("selectFile").oninput = (e) => {
    const file = e.target.files[0]
    const fileExtenson = file.name.split('.')[1]

    // Check if file format is the right one
    if (fileExtenson == "pcd") {
        const fileURL = URL.createObjectURL(file)
        const loader = new PCDLoader();

        loader.load(fileURL, points => {
            displayPoints(points, file.name)
        })
    } else {
        alert("Please select a .pcd file")
    }
}