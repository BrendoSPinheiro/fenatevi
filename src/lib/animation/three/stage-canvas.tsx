'use client';

import { AdaptiveDpr } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import type { Mesh } from 'three';

/**
 * Prova técnica da infraestrutura 3D — não é a cena definitiva do festival.
 *
 * Este módulo é carregado **dinamicamente e apenas no cliente** (ver
 * `StageScene`), portanto nunca entra no HTML do servidor nem no bundle inicial.
 */

interface StageCanvasProps {
  /** Quando `false`, o loop de renderização é interrompido. */
  readonly active: boolean;
}

function SpotlitSolid({ animated }: { readonly animated: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!animated || !meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x += delta * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshStandardMaterial color="#e8b04b" flatShading roughness={0.35} metalness={0.15} />
    </mesh>
  );
}

export default function StageCanvas({ active }: StageCanvasProps) {
  return (
    <Canvas
      // `demand` renderiza apenas quando algo muda: fora da viewport o custo é zero.
      frameloop={active ? 'always' : 'demand'}
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{ antialias: true, powerPreference: 'low-power' }}
    >
      {/* Luz ambiente fraca + um "refletor" quente: a metáfora do palco. */}
      <ambientLight intensity={0.35} />
      <spotLight position={[3, 4, 3]} angle={0.5} penumbra={0.8} intensity={90} color="#fff2d6" />
      <pointLight position={[-3, -2, -2]} intensity={12} color="#5a4bd8" />
      <SpotlitSolid animated={active} />
      {/* Reduz a resolução automaticamente quando a taxa de quadros cai. */}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
