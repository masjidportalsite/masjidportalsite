/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/immutability */
"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Performance: detect low-power / touch devices ─────────────────────
function useIsLowPower() {
    const [low, setLow] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
        const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
        setLow(mq.matches || rm.matches);
    }, []);
    return low;
}

// ─── Islamic Eight-Pointed Star (Octagram) floating core ────────────────
function IslamicStar({ activeSection }: { activeSection: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);

    // Build an octagram (8-pointed star) from two overlaid squares (quads)
    const starShape = useMemo(() => {
        const shape = new THREE.Shape();
        const pts = 8;
        const outerR = 1.0;
        const innerR = 0.42;
        for (let i = 0; i < pts * 2; i++) {
            const angle = (i * Math.PI) / pts - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        return shape;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.18,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 4,
    }), []);

    const starGeometry = useMemo(() =>
        new THREE.ExtrudeGeometry(starShape, extrudeSettings),
        [starShape, extrudeSettings]);

    const coreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#7a5c00',
        emissive: '#D4AF37',
        emissiveIntensity: 0.65,
        metalness: 1.0,
        roughness: 0.12,
        transparent: true,
        opacity: 0.92,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
    }), []);

    // Second, larger outer star ring (wire)
    const outerEdges = useMemo(() => new THREE.EdgesGeometry(starGeometry), [starGeometry]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.z = t * 0.08 + activeSection * 0.4;
            groupRef.current.position.y = Math.sin(t * 0.6) * 0.22;
        }
        if (innerRef.current) {
            // Pulsing emissive
            const mat = innerRef.current.material as THREE.MeshPhysicalMaterial;
            mat.emissiveIntensity = 0.5 + Math.sin(t * 1.8) * 0.35;
        }
        if (outerRef.current) {
            outerRef.current.rotation.z = -(t * 0.04);
            outerRef.current.scale.setScalar(1.55 + Math.sin(t * 0.5) * 0.04);
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Core gold star body */}
            <mesh ref={innerRef} geometry={starGeometry} material={coreMat}
                position={[0, 0, -0.09]} />

            {/* Outer spinning wire frame */}
            <lineSegments ref={outerRef} geometry={outerEdges} position={[0, 0, 0]}>
                <lineBasicMaterial color="#D4AF37" transparent opacity={0.35} />
            </lineSegments>

            {/* Central glow light */}
            <pointLight color="#D4AF37" intensity={8} distance={6} decay={2} />
            <pointLight color="#80bea6" intensity={3} distance={4} decay={2} position={[0, 0, 1.5]} />
        </group>
    );
}

// ─── Sacred Dome Arch (wireframe torus segments) ────────────────────────
function SacredDome() {
    const ref = useRef<THREE.Group>(null);

    const archGeo = useMemo(() => new THREE.TorusGeometry(3.2, 0.012, 6, 80, Math.PI), []);
    const pillarGeo = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 1.8, 6), []);

    const lineMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#80bea6',
        transparent: true,
        opacity: 0.25,
    }), []);

    const pillarMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#80bea6',
        transparent: true,
        opacity: 0.18,
    }), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = t * 0.018;
            ref.current.position.y = -0.3 + Math.sin(t * 0.25) * 0.08;
        }
    });

    return (
        <group ref={ref} position={[0, -0.5, -1.5]}>
            {/* Primary arch */}
            <mesh geometry={archGeo} material={lineMat} rotation={[0, 0, 0]} />
            {/* Second smaller arch tilted */}
            <mesh geometry={archGeo} material={lineMat}
                rotation={[0, Math.PI / 4, 0]}
                scale={[0.75, 0.75, 0.75]} />
            {/* Left pillar */}
            <mesh geometry={pillarGeo} material={pillarMat} position={[-3.2, -0.9, 0]} />
            {/* Right pillar */}
            <mesh geometry={pillarGeo} material={pillarMat} position={[3.2, -0.9, 0]} />
        </group>
    );
}

// ─── Volumetric Light Beam ──────────────────────────────────────────────
function VolumetricBeam() {
    const ref = useRef<THREE.Mesh>(null);
    const geo = useMemo(() => new THREE.ConeGeometry(0.8, 6, 24, 1, true), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#D4AF37',
        transparent: true,
        opacity: 0.055,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            (ref.current.material as THREE.MeshBasicMaterial).opacity =
                0.04 + Math.sin(t * 0.9) * 0.025;
        }
    });

    return (
        <mesh ref={ref} geometry={geo} material={mat} position={[0, 2.8, 0]} rotation={[0, 0, Math.PI]} />
    );
}

// ─── Dual-Layer Star Field ──────────────────────────────────────────────
function IslamicStarField() {
    const innerRef = useRef<THREE.Points>(null);
    const outerRef = useRef<THREE.Points>(null);

    const [innerPos, outerPos] = useMemo(() => {
        const inner = new Float32Array(600 * 3);
        const outer = new Float32Array(500 * 3);

        for (let i = 0; i < 600; i++) {
            const r = 2.5 + Math.random() * 4.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            inner[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            inner[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
            inner[i * 3 + 2] = r * Math.cos(phi);
        }

        for (let i = 0; i < 500; i++) {
            const r = 7 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            outer[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            outer[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
            outer[i * 3 + 2] = r * Math.cos(phi);
        }

        return [inner, outer];
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (innerRef.current) {
            innerRef.current.rotation.y = t * 0.025;
            innerRef.current.rotation.x = Math.sin(t * 0.04) * 0.06;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y = -t * 0.012;
        }
    });

    return (
        <>
            <Points ref={innerRef} positions={innerPos} stride={3}>
                <PointMaterial
                    transparent
                    color="#D4AF37"
                    size={0.055}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.75}
                />
            </Points>
            <Points ref={outerRef} positions={outerPos} stride={3}>
                <PointMaterial
                    transparent
                    color="#80bea6"
                    size={0.04}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.45}
                />
            </Points>
        </>
    );
}

// ─── Floating Geometric Rings ───────────────────────────────────────────
function FloatingRings({ activeSection }: { activeSection: number }) {
    const r1 = useRef<THREE.Mesh>(null);
    const r2 = useRef<THREE.Mesh>(null);
    const r3 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const offset = activeSection * 0.3;
        if (r1.current) {
            r1.current.rotation.x = t * 0.12 + offset;
            r1.current.rotation.y = t * 0.08;
            r1.current.scale.setScalar(1.7 + Math.sin(t * 0.4) * 0.1);
        }
        if (r2.current) {
            r2.current.rotation.x = -t * 0.09;
            r2.current.rotation.z = t * 0.11 + offset;
            r2.current.scale.setScalar(2.4 + Math.cos(t * 0.35) * 0.12);
        }
        if (r3.current) {
            r3.current.rotation.y = t * 0.06;
            r3.current.rotation.x = Math.sin(t * 0.2) * 0.3;
            r3.current.scale.setScalar(3.1 + Math.sin(t * 0.28) * 0.15);
        }
    });

    return (
        <group>
            <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.5, 0.012, 8, 80]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
            </mesh>
            <mesh ref={r2} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[2.0, 0.008, 8, 80]} />
                <meshBasicMaterial color="#D4AF37" transparent opacity={0.28} />
            </mesh>
            <mesh ref={r3} rotation={[Math.PI / 6, Math.PI / 4, 0]}>
                <torusGeometry args={[2.8, 0.006, 6, 64]} />
                <meshBasicMaterial color="#80bea6" transparent opacity={0.18} />
            </mesh>
        </group>
    );
}

// ─── Mouse Parallax + Scroll Scene Controller ────────────────────────────
function SceneController({ children, scrollY }: { children: React.ReactNode; scrollY: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const { camera } = useThree();

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouse.current = {
                x: (e.clientX / window.innerWidth - 0.5),
                y: -(e.clientY / window.innerHeight - 0.5),
            };
        };
        window.addEventListener('mousemove', handleMouse, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += (mouse.current.x * 0.5 - groupRef.current.rotation.y) * 0.04;
            groupRef.current.rotation.x += (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.04;
        }
        // Subtle scroll camera drift
        const targetZ = 7.5 + scrollY * 0.003;
        (camera as THREE.PerspectiveCamera).position.z +=
            (targetZ - (camera as THREE.PerspectiveCamera).position.z) * 0.06;
    });

    return <group ref={groupRef}>{children}</group>;
}

// ─── Main Export ──────────────────────────────────────────────────────────
interface SanctuaryCanvasProps {
    activeSection?: number;
    scrollY?: number;
}

export default function SanctuaryCanvas({ activeSection = 0, scrollY = 0 }: SanctuaryCanvasProps) {
    const isLowPower = useIsLowPower();

    if (isLowPower) {
        // Static fallback for mobile / reduced-motion
        return (
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    background: 'radial-gradient(ellipse at 60% 40%, rgba(212,175,55,0.12) 0%, rgba(6,78,59,0.18) 40%, #050a08 80%)',
                }}
            />
        );
    }

    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 7.5], fov: 44 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                frameloop="always"
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[4, 8, 4]} intensity={1.8} color="#80bea6" />
                <directionalLight position={[-4, -4, -4]} intensity={1.0} color="#D4AF37" />

                <SceneController scrollY={scrollY}>
                    <IslamicStarField />
                    <IslamicStar activeSection={activeSection} />
                    <FloatingRings activeSection={activeSection} />
                    <SacredDome />
                    <VolumetricBeam />
                </SceneController>
            </Canvas>
        </div>
    );
}
