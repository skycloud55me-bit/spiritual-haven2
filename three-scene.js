// المشهد الثلاثي الأبعاد العاطفي
class EmotionalScene3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.emotionalState = 'neutral';
        
        this.init();
    }

    init() {
        // إنشاء المشهد
        this.scene = new THREE.Scene();
        
        // الكاميرا
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // المُصيِّر
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('threejs-container').appendChild(this.renderer.domElement);
        
        // الإضاءة
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // إنشاء العالم العاطفي
        this.createEmotionalWorld();
        this.animate();
        
        // استجابة لتغير الحجم
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createEmotionalWorld() {
        // الأرض العاطفية
        const geometry = new THREE.PlaneGeometry(20, 20, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a2e,
            side: THREE.DoubleSide 
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
        
        // العناصر العاطفية
        this.createEmotionalElements();
    }

    createEmotionalElements() {
        // جسيمات عائمة تمثل المشاعر
        this.particles = new THREE.Group();
        
        for (let i = 0; i < 50; i++) {
            const size = Math.random() * 0.2 + 0.1;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.x = (Math.random() - 0.5) * 10;
            particle.position.y = (Math.random() - 0.5) * 10;
            particle.position.z = (Math.random() - 0.5) * 10;
            
            particle.userData = {
                speed: Math.random() * 0.02 + 0.01,
                direction: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                )
            };
            
            this.particles.add(particle);
        }
        
        this.scene.add(this.particles);
    }

    // تحديث المشهد بناءً على الحالة العاطفية
    updateEmotionalScene(emotion) {
        this.emotionalState = emotion.type;
        
        // تغيير الألوان والجو بناءً على العاطفة
        let sceneColor, particleColor, intensity;
        
        switch(emotion.type) {
            case 'positive':
                sceneColor = 0x2e8b57; // أخضر سلام
                particleColor = 0xffd700; // ذهبي
                intensity = emotion.intensity * 2;
                break;
            case 'negative':
                sceneColor = 0x4682b4; // أزرق حزين
                particleColor = 0x87ceeb; // أزرق فاتح
                intensity = emotion.intensity * 1.5;
                break;
            case 'anxious':
                sceneColor = 0x8b4513; // بني ترابي
                particleColor = 0xff4500; // برتقالي محمر
                intensity = emotion.intensity * 3;
                break;
            case 'peaceful':
                sceneColor = 0x483d8b; // بنفسجي مظلم
                particleColor = 0x9370db; // بنفسجي فاتح
                intensity = emotion.intensity * 1;
                break;
            default:
                sceneColor = 0x1a1a2e;
                particleColor = 0x4ecdc4;
                intensity = 1;
        }
        
        // تطبيق التغييرات
        this.scene.background = new THREE.Color(sceneColor);
        
        this.particles.children.forEach(particle => {
            particle.material.color.set(particleColor);
            particle.material.opacity = 0.5 + (intensity * 0.3);
            particle.userData.speed = 0.01 + (intensity * 0.02);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // تحريك الجسيمات
        this.particles.children.forEach(particle => {
            particle.position.add(particle.userData.direction);
            
            // إبقاء الجسيمات ضمن حدود معينة
            if (Math.abs(particle.position.x) > 8) particle.userData.direction.x *= -1;
            if (Math.abs(particle.position.y) > 8) particle.userData.direction.y *= -1;
            if (Math.abs(particle.position.z) > 8) particle.userData.direction.z *= -1;
            
            // دوران بسيط
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
