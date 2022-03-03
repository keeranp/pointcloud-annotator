import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { displayPoints, init, render } from './app';


init()
render()

document.getElementById("selectFile").oninput = (e) => {
    const file = e.target.files[0]
    const fileURL = URL.createObjectURL(file)
    console.log(fileURL)
    const loader = new PCDLoader();

    loader.load(fileURL, points => {
        displayPoints(points)
        render();
    })
}