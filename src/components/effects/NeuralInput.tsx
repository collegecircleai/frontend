'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  intensity: number
}

const PARTICLE_COUNT = 300;

function NeuralParticles({ intensity }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16 
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const speed = 0.1 + intensity * 0.5 // Much slower, more elegant
    
    pointsRef.current.rotation.y = time * speed * 0.05
    
    const attr = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = attr.getX(i)
      const y = attr.getY(i)
      // Gentle, dust-like floating motion
      attr.setY(i, y + Math.sin(time * 0.5 + x) * 0.002 * (1 + intensity * 3))
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} key={PARTICLE_COUNT}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} // Small "dust" particles
        color={new THREE.Color('#B4ADFF')} 
        transparent
        opacity={0.8 + intensity * 0.2} // High visibility but small size
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

interface NeuralInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType
  isError?: boolean
}

export default function NeuralInput({ icon: Icon, isError, ...props }: NeuralInputProps) {
  const [intensity, setIntensity] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleKeyDown = () => {
    setIntensity(1)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIntensity(0)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Background 3D Neural Field */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none', borderRadius: '22px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
          <NeuralParticles intensity={intensity} />
        </Canvas>
      </div>

      {Icon && (
        <Icon 
          size={22} 
          style={{ 
            position: 'absolute', 
            left: '22px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: isError ? '#ff4d4d' : 'var(--violet)', 
            zIndex: 10,
            transition: 'color 0.3s'
          }} 
        />
      )}

      <input
        {...props}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        onKeyDown={(e) => {
          handleKeyDown()
          props.onKeyDown?.(e)
        }}
        style={{ 
          width: '100%', 
          padding: '22px 22px 22px 60px', 
          borderRadius: '22px', 
          border: isError ? '1.5px solid #ff4d4d' : isFocused ? '1.5px solid var(--violet)' : '1px solid var(--border)', 
          background: 'rgba(var(--header-bg), 0.25)', 
          backdropFilter: 'blur(12px)',
          outline: 'none', 
          fontSize: '16px', 
          fontWeight: 500, 
          position: 'relative',
          zIndex: 5,
          color: 'var(--ink)',
          boxShadow: isError ? '0 0 20px rgba(255, 77, 77, 0.08)' : isFocused ? '0 0 0 4px rgba(77, 63, 255, 0.15)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
          ...props.style
        }}
      />
    </div>
  )
}
