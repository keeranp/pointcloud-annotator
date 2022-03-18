import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'
import { hexToRgb, waitForElm } from './utils';

let camera, scene, renderer, canvas, points, raycaster, mouse
let classes = []
let currentColor = { r: 0, g: 0, b: 0 }

export const init = () => {
    const modal = document.getElementById("modal");
    const addClassButton = document.getElementById("add-class-button");
    const closeButton = document.getElementsByClassName("close")[0];

    const classNameInput = document.querySelector("#class-name-input")
    const classColorInput = document.querySelector("#class-color-input")
    const createClassButton = document.querySelector("#create-class-button")
    const classesDisplay = document.querySelector("#classes-display")

    const eraseButton = document.querySelector("#erase-button")

    mouse = {
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

    const gui = new dat.GUI()

    const world = {
        brush: {
            size: 0.05
        }
    }

    gui.add(world.brush, 'size', 0.005, 0.5).onChange(() => {
        raycaster.params.Points.threshold = world.brush.size
    })

    raycaster = new THREE.Raycaster()
    raycaster.params.Points.threshold = 0.05

    const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    }

    animate()

    /////////////////////////////////////////////////// EVENTS //////////////////////////////////////////////////

    // When the user clicks on the button, open the modal
    addClassButton.onclick = () => {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = () => {
        modal.style.display = "none";
    }

    window.addEventListener('keypress', keyboard);
    addEventListener('mousemove', (event) => {
        mouse.x = ((event.clientX - document.querySelector("#nav").clientWidth) / canvas.clientWidth) * 2 - 1
        mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1
    })

    eraseButton.onclick = () => {
        const doms = document.getElementsByClassName(`class`)

        for (let i = 0; i < doms.length; i++) {
            doms[i].style.background = "#ffffff"
        }
        currentColor = hexToRgb("#000000")
    }

    createClassButton.onclick = async() => {
        if (!classNameInput.value) {
            alert("Please select a class name")
        } else if (classColorInput.value == "#000000") {
            alert("Please select a class color")
        } else {
            if (classes.some(e => e.className === classNameInput.value)) {
                alert("Class name already taken")
            } else if (classes.some(e => e.color === classColorInput.value)) {
                alert("Class color already taken")
            } else {
                classes.push({ className: classNameInput.value, color: classColorInput.value, selected: false })

                const div = document.createElement('div');
                div.innerHTML =
                    `<div class="name ${classes.length}">${classNameInput.value}</div>
                    <div class="color ${classes.length}" style="background:${classColorInput.value};"></div>`
                div.className = `class ${classes.length}`
                div.onclick = selectClass
                classesDisplay.appendChild(div)

                classNameInput.value = null
                classColorInput.value = "#000000"
                modal.style.display = "none"
            }
        }
    }
}

const selectClass = event => {
    let domElement = undefined
    const doms = document.getElementsByClassName(`class`)

    for (let i = 0; i < doms.length; i++) {
        doms[i].style.background = "#ffffff"
    }

    if (event.path.length == 8) {
        domElement = event.path[1]
        currentColor = hexToRgb(classes[event.path[1].className.split(' ')[1] - 1].color)
    } else {
        domElement = event.path[0]
        currentColor = hexToRgb(classes[event.path[0].className.split(' ')[1] - 1].color)
    }
    domElement.style.background = "rgb(0, 163, 166, 0.8)"
}

export const displayPoints = (_points) => {
    points = _points
    points.geometry.center()
    points.geometry.rotateX(Math.PI)
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

const keyboard = (ev) => {
    switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
        case '+':
            points.material.size *= 1.2
            break

        case '-':
            points.material.size /= 1.2
            break

        case ' ':
            raycaster.setFromCamera(mouse, camera)
            if (points) {
                const intersects = raycaster.intersectObject(points, false)

                if (intersects.length > 0) {
                    for (let i = 0; i < Math.round(intersects.length); i++) {
                        console.log(intersects[i].distanceToRay)
                        const { color } = intersects[i].object.geometry.attributes
                        color.setX(intersects[i].index, currentColor.r)
                        color.setY(intersects[i].index, currentColor.g)
                        color.setZ(intersects[i].index, currentColor.b)
                        color.needsUpdate = true
                    }
                }
            }

            break
    }
}

const resizeRendererToDisplaySize = (renderer) => {
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