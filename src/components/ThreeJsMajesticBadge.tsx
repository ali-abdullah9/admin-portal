"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";

// No need for explicit interface with function-as-child pattern

const ThreeJsMajesticBadge = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation for container
  const containerAnimation = useSpring({
    scale: isHovered ? 1.02 : 1,
    boxShadow: isHovered 
      ? "0 20px 50px rgba(59, 130, 246, 0.3)" 
      : "0 10px 30px rgba(0, 0, 0, 0.1)",
    config: { tension: 300, friction: 20 }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Add a gradient background
    scene.background = new THREE.Color(0x000a20);

    // Camera setup with better positioning
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    // Renderer setup with enhanced visuals
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true, // Allow transparency
      powerPreference: "high-performance"
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // Badge group
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // Create badge disk with improved materials
    const diskGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 64);
    const diskMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.8,
      roughness: 0.15,
      reflectivity: 1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    disk.castShadow = true;
    disk.receiveShadow = true;
    badgeGroup.add(disk);

    // Create a silver rim with enhanced materials
    const rimGeometry = new THREE.TorusGeometry(2.05, 0.12, 32, 128);
    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.05,
      reflectivity: 1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.03,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.castShadow = true;
    badgeGroup.add(rim);

    // Add a second decorative rim
    const outerRimGeometry = new THREE.TorusGeometry(2.22, 0.04, 16, 100);
    const outerRimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfafafa,
      metalness: 1,
      roughness: 0.05,
      reflectivity: 1,
    });
    const outerRim = new THREE.Mesh(outerRimGeometry, outerRimMaterial);
    outerRim.castShadow = true;
    badgeGroup.add(outerRim);

    // Create embossed NT text
    function createEmbossedText() {
      const textGroup = new THREE.Group();
      
      // Create NT using custom geometries for more 3D effect
      
      // Letter N
      const nGroup = new THREE.Group();
      
      // Vertical lines of N
      const nVerticalGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.15);
      const nMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xfafafa,
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 0.5,
      });
      
      const nLeft = new THREE.Mesh(nVerticalGeometry, nMaterial);
      nLeft.position.x = -0.8;
      nLeft.position.z = 0.15;
      nGroup.add(nLeft);
      
      const nRight = new THREE.Mesh(nVerticalGeometry, nMaterial);
      nRight.position.x = -0.2;
      nRight.position.z = 0.15;
      nGroup.add(nRight);
      
      // Diagonal of N
      const nDiagonalGeometry = new THREE.BoxGeometry(0.2, 1.7, 0.15);
      const nDiagonal = new THREE.Mesh(nDiagonalGeometry, nMaterial);
      nDiagonal.position.z = 0.15;
      nDiagonal.position.x = -0.5;
      nDiagonal.rotation.z = Math.PI / 5;
      nGroup.add(nDiagonal);
      
      // Letter T
      const tGroup = new THREE.Group();
      
      // Vertical part of T
      const tVerticalGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.15);
      const tMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xfafafa,
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 0.5,
      });
      
      const tVertical = new THREE.Mesh(tVerticalGeometry, tMaterial);
      tVertical.position.x = 0.5;
      tVertical.position.z = 0.15;
      tGroup.add(tVertical);
      
      // Horizontal part of T
      const tHorizontalGeometry = new THREE.BoxGeometry(1.1, 0.3, 0.15);
      const tHorizontal = new THREE.Mesh(tHorizontalGeometry, tMaterial);
      tHorizontal.position.x = 0.5;
      tHorizontal.position.y = 0.6;
      tHorizontal.position.z = 0.15;
      tGroup.add(tHorizontal);
      
      textGroup.add(nGroup);
      textGroup.add(tGroup);
      textGroup.position.y = 0;
      
      return textGroup;
    }

    const embossedText = createEmbossedText();
    badgeGroup.add(embossedText);

    // Create particles for space effect with improved visuals
    const particlesCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Create a galaxy-like distribution with improved spread
      const radius = 3 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;
      
      posArray[i3] = Math.cos(angle) * radius;
      posArray[i3 + 1] = height;
      posArray[i3 + 2] = Math.sin(angle) * radius;
      
      // Variable sizes for particles
      scaleArray[i] = Math.random() * 2 + 0.5;
      
      // Different colors for particles
      // Bluish to purplish gradient
      const blueAmount = 0.5 + Math.random() * 0.5;
      colorArray[i3] = 0.1 + Math.random() * 0.2; // Red
      colorArray[i3 + 1] = 0.2 + Math.random() * 0.4; // Green
      colorArray[i3 + 2] = blueAmount; // Blue (dominant)
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Create custom shader material for better-looking particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.06,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Enhanced lighting for better visual quality
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Main directional light
    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(5, 5, 5);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;
    scene.add(light1);

    // Secondary light for rim highlights
    const light2 = new THREE.DirectionalLight(0x0066ff, 1.5);
    light2.position.set(-5, -2, 3);
    scene.add(light2);
    
    // Add a point light for badge glow
    const pointLight = new THREE.PointLight(0x3b82f6, 2, 8);
    pointLight.position.set(0, 0, 1.5);
    badgeGroup.add(pointLight);

    // Add top light for embossed text highlight
    const topLight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI / 4, 0.5, 1);
    topLight.position.set(0, 5, 5);
    topLight.castShadow = true;
    scene.add(topLight);

    // Add floating particles inside the badge (smaller, closer particles)
    const innerParticlesCount = 500;
    const innerParticlesGeometry = new THREE.BufferGeometry();
    const innerPosArray = new Float32Array(innerParticlesCount * 3);
    
    for (let i = 0; i < innerParticlesCount * 3; i += 3) {
      // Create a distribution inside the badge
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = Math.random() * 1.8;
      
      innerPosArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      innerPosArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      innerPosArray[i + 2] = radius * Math.cos(phi) + 0.15; // Push slightly forward
    }
    
    innerParticlesGeometry.setAttribute(
      'position', 
      new THREE.BufferAttribute(innerPosArray, 3)
    );
    
    const innerParticlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x80b3ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    
    const innerParticlesMesh = new THREE.Points(innerParticlesGeometry, innerParticlesMaterial);
    badgeGroup.add(innerParticlesMesh);

    // Interactive mouse tracking with improved response
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Enhanced responsive rotation with damping
      targetRotation.y = mouse.x * 0.4; 
      targetRotation.x = mouse.y * 0.3;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Handle hover events
    const handleMouseEnter = () => {
      setIsHovered(true);
      
      // Animation for hover effect
      gsap.to(pointLight, {
        intensity: 4,
        distance: 10,
        duration: 0.5
      });
      
      gsap.to(badgeGroup.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
      
      // Animation for hover effect
      gsap.to(pointLight, {
        intensity: 2,
        distance: 8,
        duration: 0.5
      });
      
      gsap.to(badgeGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Animation variables
    let time = 0;
    
    // Animation loop with enhanced effects
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      
      // Smooth rotation with improved physics
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      // Limit rotation to prevent extreme angles
      badgeGroup.rotation.x = Math.max(Math.min(currentRotation.x, 0.5), -0.5);
      badgeGroup.rotation.y = Math.max(Math.min(currentRotation.y + Math.sin(time * 0.2) * 0.05, 0.8), -0.8);
      
      // Add subtle floating animation
      badgeGroup.position.y = Math.sin(time) * 0.1;
      
      // Rotate particles
      particlesMesh.rotation.y = time * 0.1;
      particlesMesh.rotation.x = time * 0.05;
      
      // Animate inner particles
      innerParticlesMesh.rotation.y = -time * 0.2;
      innerParticlesMesh.rotation.z = time * 0.1;
      
      // Pulse light intensity for glowing effect
      const pulseValue = Math.sin(time * 3) * 0.2 + 0.8;
      pointLight.intensity = pulseValue * 2 + (isHovered ? 2 : 0);
      
      // Render
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // Resize handler with improved performance
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        if (containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-primary/20 transition-all duration-300">
      {/* Create a component from animated */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-full"
      >
        {React.createElement(
          animated.div,
          {
            style: {
              ...containerAnimation,
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: 0
            }
          },
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="h-8 w-8 rounded-full border-3 border-primary border-t-transparent animate-spin"></div>
              </div>
            )}
            <div ref={containerRef} className="w-full h-full"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ThreeJsMajesticBadge;