import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { displayPoints, init } from './app';


init()

// document.getElementById("selectFile").oninput = (e) => {
//     const file = e.target.files[0]
//     const fileExtenson = file.name.split('.')[1]
// if (fileExtenson == "pcd") {
//         const fileURL = URL.createObjectURL(file)
const loader = new PCDLoader();

loader.load('../data/test.pcd', points => {
        displayPoints(points)
    })
    //     } else {
    //         alert("Please select a .pcd file")
    //     }
    // }