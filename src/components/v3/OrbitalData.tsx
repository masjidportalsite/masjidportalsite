/* eslint-disable react-hooks/purity */
"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OrbitalData() {
    const count = 350;
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const radius = 6 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 6;
            const speed = 0.3 + Math.random() * 0.7;
            temp.push({ radius, angle, y, speed });
        }
        return temp;
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            particle.angle += delta * particle.speed;
            const x = Math.cos(particle.angle) * particle.radius;
            const z = Math.sin(particle.angle) * particle.radius;

            dummy.position.set(x, particle.y, z);

            // Look at central core to align the data packets nicely
            dummy.lookAt(0, 0, 0);
            dummy.scale.setScalar(0.4 + Math.random() * 0.6);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
        meshRef.current.rotation.z += delta * 0.08;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[0.08, 0.02, 0.5]} />
            <meshStandardMaterial
                color="#80bea6"
                emissive="#ffffff"
                emissiveIntensity={2.5}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
}
