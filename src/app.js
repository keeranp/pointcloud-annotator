import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

let camera, scene, renderer, canvas, points;

export const init = () => {
    const mouse = {
        x: undefined,
        y: undefined
    }



    canvas = document.querySelector("#canvas")
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd)

    camera = new THREE.PerspectiveCamera(75, 2, 0.01, 100);
    camera.position.set(0, 0, 1);
    camera.up.set(0, 0, -1)
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.listenToKeyEvents(window)

    // const gui = dat.GUI()

    // const world = {
    //     brush: {
    //         size: 100
    //     }
    // }

    // // gui.add(world.brush, 'size', 1, 500)

    const raycaster = new THREE.Raycaster()

    const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }



        animate()

        window.addEventListener('keypress', keyboard);
        addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        })
    }

    export const displayPoints = (_points) => {
        points = _points
        points.geometry.center();
        points.geometry.rotateX(Math.PI);
        points.material.color.set(0xffffff)
        points.material.vertexColors = true

        const colors = []

        for (let i = 0; i < points.geometry.attributes.position.count; i++) {
            colors.push(0, 0, 0)
        }

        points.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
        console.log(points.geometry)
        scene.add(points);
    }

    function keyboard(ev) {
        switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
            case '+':
                points.material.size *= 1.2;
                break;

            case '-':
                points.material.size /= 1.2;
                break;

            case ' ':
                raycaster.setFromCamera(mouse, camera)
                raycaster.params.Points.threshold = 0.05;
                if (points) {
                    const intersects = raycaster.intersectObject(points, false)

                    if (intersects.length > 0) {
                        console.log(intersects.length)
                        for (let i = 0; i < intersects.length; i++) {
                            const { color } = intersects[i].object.geometry.attributes

                            color.setX(intersects[i].index, 0)
                            color.setY(intersects[i].index, 0.56)
                            color.setZ(intersects[i].index, 0.56)
                            color.needsUpdate = true
                        }
                    }
                }
        }
    }
}

// export function render() {

//     renderer.render(scene, camera);
// }

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