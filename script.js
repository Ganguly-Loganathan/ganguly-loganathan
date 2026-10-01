// Setup Three.js Scene
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 3D Wireframe Shape
const geometry = new THREE.IcosahedronGeometry(10, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 25;

// Interactive Motion for Mouse & Touch
let mouseX = 0;
let mouseY = 0;

function handleMove(x, y) {
    mouseX = (x / window.innerWidth) - 0.5;
    mouseY = (y / window.innerHeight) - 0.5;
}

document.addEventListener('mousemove', (event) => {
    handleMove(event.clientX, event.clientY);
});

document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        handleMove(event.touches[0].clientX, event.touches[0].clientY);
    }
});

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    // Subtle Continuous Rotation
    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.002;

    // Responsive Touch/Mouse Rotation
    sphere.rotation.x += mouseY * 0.03;
    sphere.rotation.y += mouseX * 0.03;

    renderer.render(scene, camera);
}

animate();

// Handle Screen Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
