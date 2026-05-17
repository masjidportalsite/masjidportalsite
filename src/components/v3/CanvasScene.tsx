"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sparkles, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import SacredCore from './SacredCore';
import OrbitalData from './OrbitalData';

export default function CanvasScene() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
            <color attach="background" args={['#020406']} />

            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
            <pointLight position={[-10, -10, -10]} intensity={2.0} color="#80bea6" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <SacredCore />
                <OrbitalData />
            </Float>

            <Sparkles count={400} size={1.5} color="#d4af37" scale={20} speed={0.4} opacity={0.6} noise={0.2} />
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            <EffectComposer>
                <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={2.0} mipmapBlur />
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2.5} height={480} />
            </EffectComposer>

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.8}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />
        </Canvas>
    );
}
