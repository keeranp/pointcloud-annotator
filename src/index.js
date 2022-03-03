import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, canvas;

const init = () => {
    canvas = document.querySelector("#canvas")
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd)

    camera = new THREE.PerspectiveCamera(75, 2, 0.01, 100);
    camera.position.set(0, 0, 1);
    camera.up.set(0, 0, -1)
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.listenToKeyEvents(window)

    const loader = new PCDLoader();
    loader.load('../data/test.pcd', points => {
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.material.color.setHex(0x000000);
        scene.add(points);
        render();

    })

    window.addEventListener('keypress', keyboard);
}

function keyboard(ev) {

    const points = scene.getObjectByName('test.pcd');

    switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {

        case '+':
            points.material.size *= 1.2;
            break;

        case '-':
            points.material.size /= 1.2;
            break;

    }

    render();

}

function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

init()
render()