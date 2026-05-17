/* eslint-disable react-hooks/purity */
"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SacredCore() {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
            groupRef.current.rotation.x += delta * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Outer Octahedron Wireframe */}
            <mesh ref={wireRef}>
                <octahedronGeometry args={[4, 0]} />
                <meshStandardMaterial color="#D4AF37" wireframe transparent opacity={0.4} emissive="#D4AF37" emissiveIntensity={0.6} />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2.5, 1]} />
                <meshStandardMaterial
                    color="#064E3B"
                    emissive="#5c9280"
                    emissiveIntensity={1.2}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Floating Shards using Instanced Mesh pattern for geometry but mapped out */}
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos((i / 8) * Math.PI * 2) * 4.5,
                        Math.sin((i / 4) * Math.PI) * 1.5,
                        Math.sin((i / 8) * Math.PI * 2) * 4.5
                    ]}
                    rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
                >
                    <tetrahedronGeometry args={[0.5]} />
                    <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} emissive="#D4AF37" emissiveIntensity={0.8} />
                </mesh>
            ))}
        </group>
    );
}
