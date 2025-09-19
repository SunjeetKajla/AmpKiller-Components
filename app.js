// Component data for 3D visualization
const components = {
    esp32cam: { color: 0x4CAF50, name: 'ESP32-CAM' },
    arduino_nano: { color: 0x2196F3, name: 'Arduino Nano' },
    esp32: { color: 0x9C27B0, name: 'ESP32' },
    mq2: { color: 0xF44336, name: 'MQ-2 Gas Sensor' },
    hcsr04: { color: 0xFF9800, name: 'HC-SR04' },
    adxl345: { color: 0xFFEB3B, name: 'ADXL345' },
    lora: { color: 0x00BCD4, name: 'LoRa SX1278' }
};

// Global variables for scenes and animations
let scenes = {};
let animationFrames = {};
let isHovered = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHeroScene();
    initializeComponentScenes();
    initializeIntersectionObserver();
    initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Hero section 3D scene
function initializeHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create multiple geometric shapes representing the IoT system
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 16, 16),
        new THREE.ConeGeometry(0.7, 1.2, 8),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
        new THREE.TorusGeometry(0.6, 0.3, 8, 16),
        new THREE.OctahedronGeometry(0.8),
        new THREE.TetrahedronGeometry(0.9)
    ];

    const materials = Object.values(components).map(comp => 
        new THREE.MeshPhongMaterial({ 
            color: comp.color,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        })
    );

    const meshes = [];
    
    geometries.forEach((geometry, index) => {
        const material = materials[index % materials.length];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position meshes in a circular formation
        const angle = (index / geometries.length) * Math.PI * 2;
        const radius = 3;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = Math.sin(angle) * 0.5;
        mesh.position.z = Math.sin(angle) * radius;
        
        // Add random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        scene.add(mesh);
        meshes.push(mesh);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00bcd4, 0.5);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    camera.position.z = 8;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.005 + index * 0.001;
            mesh.rotation.y += 0.003 + index * 0.001;
            mesh.rotation.z += 0.002 + index * 0.001;
            
            // Floating animation
            mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
    
    scenes.hero = { scene, camera, renderer, meshes };
}

// Component scenes initialization
function initializeComponentScenes() {
    Object.keys(components).forEach(componentId => {
        createComponentScene(componentId, components[componentId]);
    });
}

function createComponentScene(componentId, componentData) {
    const canvas = document.getElementById(`${componentId}-canvas`);
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create component-specific geometry
    let geometry;
    switch(componentId) {
        case 'esp32cam':
            geometry = new THREE.BoxGeometry(2, 1, 0.3);
            break;
        case 'arduino_nano':
            geometry = new THREE.BoxGeometry(1.8, 0.7, 0.2);
            break;
        case 'esp32':
            geometry = new THREE.BoxGeometry(2.5, 1.2, 0.3);
            break;
        case 'mq2':
            geometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
            break;
        case 'hcsr04':
            geometry = new THREE.BoxGeometry(1.8, 0.8, 0.6);
            break;
        case 'adxl345':
            geometry = new THREE.BoxGeometry(0.8, 0.8, 0.2);
            break;
        case 'lora':
            geometry = new THREE.BoxGeometry(1.5, 1, 0.2);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const material = new THREE.MeshPhongMaterial({
        color: componentData.color,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: componentData.color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframeMesh = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    wireframeMesh.scale.setScalar(1.02);
    scene.add(wireframeMesh);

    // Add component-specific details
    if (componentId === 'esp32cam') {
        // Add camera lens
        const lensGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const lensMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.position.set(0.5, 0, 0.2);
        scene.add(lens);
    } else if (componentId === 'mq2') {
        // Add sensor pins
        const pinGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
        const pinMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        for (let i = 0; i < 6; i++) {
            const pin = new THREE.Mesh(pinGeometry, pinMaterial);
            pin.position.set((i - 2.5) * 0.2, -1, 0);
            scene.add(pin);
        }
    } else if (componentId === 'hcsr04') {
        // Add ultrasonic sensors
        const sensorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
        const sensorMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const sensor1 = new THREE.Mesh(sensorGeometry, sensorMaterial);
        const sensor2 = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensor1.position.set(-0.4, 0, 0.4);
        sensor2.position.set(0.4, 0, 0.4);
        scene.add(sensor1);
        scene.add(sensor2);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(componentData.color, 0.3);
    pointLight.position.set(-2, 2, 3);
    scene.add(pointLight);

    camera.position.z = 5;

    // Store scene data
    scenes[componentId] = {
        scene,
        camera,
        renderer,
        mesh,
        wireframeMesh,
        baseRotationSpeed: 0.005,
        currentRotationSpeed: 0.005,
        isHovered: false
    };

    // Add mouse interaction
    canvas.addEventListener('mouseenter', () => {
        scenes[componentId].isHovered = true;
        scenes[componentId].currentRotationSpeed = 0.02;
        mesh.scale.setScalar(1.1);
        wireframeMesh.scale.setScalar(1.12);
    });

    canvas.addEventListener('mouseleave', () => {
        scenes[componentId].isHovered = false;
        scenes[componentId].currentRotationSpeed = 0.005;
        mesh.scale.setScalar(1);
        wireframeMesh.scale.setScalar(1.02);
    });

    canvas.addEventListener('click', () => {
        // Add click effect
        const originalScale = mesh.scale.clone();
        mesh.scale.setScalar(1.3);
        wireframeMesh.scale.setScalar(1.32);
        
        setTimeout(() => {
            mesh.scale.copy(originalScale);
            wireframeMesh.scale.setScalar(originalScale.x + 0.02);
        }, 150);
    });

    // Start animation
    animateComponent(componentId);

    // Handle resize
    function handleResize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
}

function animateComponent(componentId) {
    const sceneData = scenes[componentId];
    if (!sceneData) return;

    function animate() {
        animationFrames[componentId] = requestAnimationFrame(animate);
        
        // Rotate the main mesh
        sceneData.mesh.rotation.x += sceneData.currentRotationSpeed;
        sceneData.mesh.rotation.y += sceneData.currentRotationSpeed * 1.5;
        sceneData.mesh.rotation.z += sceneData.currentRotationSpeed * 0.5;
        
        // Rotate wireframe slightly differently
        sceneData.wireframeMesh.rotation.x += sceneData.currentRotationSpeed * 0.8;
        sceneData.wireframeMesh.rotation.y += sceneData.currentRotationSpeed * 1.2;
        sceneData.wireframeMesh.rotation.z += sceneData.currentRotationSpeed * 0.3;
        
        // Add floating animation
        sceneData.mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        sceneData.wireframeMesh.position.y = Math.sin(Date.now() * 0.001 + 0.5) * 0.05;

        sceneData.renderer.render(sceneData.scene, sceneData.camera);
    }
    animate();
}

// Intersection Observer for scroll animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger 3D animation enhancements when section is visible
                const sectionId = entry.target.id;
                if (scenes[sectionId]) {
                    enhanceComponentAnimation(sectionId);
                }
            }
        });
    }, observerOptions);

    // Observe all component sections
    const sections = document.querySelectorAll('.component-section, .overview-section');
    sections.forEach(section => observer.observe(section));
    
    // Observe individual elements for staggered animations
    const elementsToAnimate = document.querySelectorAll('.component-title, .component-description, .specifications, .role, .overview-card, .stat');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            const elementObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);
            elementObserver.observe(element);
        }, index * 50);
    });
}

function enhanceComponentAnimation(componentId) {
    const sceneData = scenes[componentId];
    if (!sceneData) return;

    // Add a temporary speed boost when section comes into view
    sceneData.currentRotationSpeed = 0.03;
    
    setTimeout(() => {
        if (!sceneData.isHovered) {
            sceneData.currentRotationSpeed = sceneData.baseRotationSpeed;
        }
    }, 2000);
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
    // Handle scroll behavior for better performance
    let ticking = false;
    
    function updateScroll() {
        updateActiveNavLink();
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });

    // Add scroll-triggered effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Performance monitoring
function monitorPerformance() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust quality based on FPS
            if (fps < 30) {
                Object.values(scenes).forEach(scene => {
                    if (scene.renderer) {
                        scene.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
                    }
                });
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Initialize performance monitoring
monitorPerformance();

// Cleanup function for better memory management
function cleanup() {
    Object.values(animationFrames).forEach(frameId => {
        if (frameId) cancelAnimationFrame(frameId);
    });
    
    Object.values(scenes).forEach(scene => {
        if (scene.renderer) {
            scene.renderer.dispose();
        }
    });
}

// Clean up on page unload
window.addEventListener('beforeunload', cleanup);

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scenes, components, cleanup };
}