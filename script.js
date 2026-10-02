// ==========================================
// THREE.JS BACKGROUND
// ==========================================

const canvas = document.getElementById("bg-canvas");

if (canvas && typeof THREE !== "undefined") {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    // ------------------------------------------
    // Wireframe Globe
    // ------------------------------------------

    const geometry = new THREE.IcosahedronGeometry(
        10,
        2
    );

    const material = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const sphere = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(sphere);

    camera.position.z = 25;


    // ------------------------------------------
    // Mouse / Touch Interaction
    // ------------------------------------------

    let mouseX = 0;
    let mouseY = 0;

    function updatePointer(x, y) {

        mouseX =
            (x / window.innerWidth) - 0.5;

        mouseY =
            (y / window.innerHeight) - 0.5;
    }

    document.addEventListener(
        "mousemove",
        function (event) {

            updatePointer(
                event.clientX,
                event.clientY
            );

        }
    );


    document.addEventListener(
        "touchmove",
        function (event) {

            if (event.touches.length > 0) {

                updatePointer(
                    event.touches[0].clientX,
                    event.touches[0].clientY
                );

            }

        },
        {
            passive: true
        }
    );


    // ------------------------------------------
    // Animation
    // ------------------------------------------

    function animate() {

        requestAnimationFrame(animate);

        sphere.rotation.x +=
            0.001 + mouseY * 0.0005;

        sphere.rotation.y +=
            0.002 + mouseX * 0.0005;

        renderer.render(
            scene,
            camera
        );
    }

    animate();


    // ------------------------------------------
    // Resize
    // ------------------------------------------

    window.addEventListener(
        "resize",
        function () {

            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height
            );

            renderer.setPixelRatio(
                Math.min(window.devicePixelRatio, 2)
            );

        }
    );

}
