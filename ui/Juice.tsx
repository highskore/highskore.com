'use client'

import {
  Float,
  Lightformer,
  Text,
  Html,
  Environment,
  MeshTransmissionMaterial,
  useDetectGPU,
  PerformanceMonitor,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, N8AO, TiltShift2 } from '@react-three/postprocessing'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useWindowSize } from 'react-use'
import { throttle } from 'lodash'
import Fallback from './Fallback'

const inter = Inter({ subsets: ['latin'] })

const Sphere = (props: any) => (
  <mesh position={props.position}>
    <sphereGeometry args={[props.size, 42, 10]} />
    <MeshTransmissionMaterial
      backside
      backsideThickness={5}
      distortionScale={0}
      temporalDistortion={0}
      thickness={10}
    />
  </mesh>
)

const Cube = (props: any) => (
  <mesh position={props.position}>
    <boxGeometry args={props.size} />
    <MeshTransmissionMaterial
      distortionScale={0}
      temporalDistortion={4}
      thickness={20}
    />
  </mesh>
)

const Octahedron = (props: any) => (
  <mesh position={props.position}>
    <octahedronGeometry args={props.size} />
    <MeshTransmissionMaterial
      distortionScale={0}
      temporalDistortion={2}
      thickness={10}
    />
  </mesh>
)

function Title(props: any) {
  const asciiText = 'HIGHSKORE'

  return (
    <>
      <Text color='black' font={inter} {...props}>
        {asciiText}
        <Html
          style={{
            color: 'transparent',
            fontSize: (props.fontSize * 2.4).toString().concat('em'),
          }}
          transform
        >
          {asciiText}
        </Html>
      </Text>
    </>
  )
}

function Content() {
  const { camera } = useThree()
  const viewport = useWindowSize()
  const scrollY = useRef(
    typeof window !== 'undefined'
      ? window.pageYOffset || document.documentElement.scrollTop
      : 0
  )
  const scrollEndTimeoutRef = useRef<number | null>(null)
  const targetScrollY = useRef(scrollY.current)

  // Memoize these calculations to prevent recalculation on every render
  const isMobile = useMemo(() => viewport.width / 30 < 20, [viewport.width])
  const sizeMultiplier = useMemo(
    () => Math.max(Math.min(viewport.height / 37, 6), 3),
    [viewport.height]
  )
  const fontSize = useMemo(
    () =>
      isMobile
        ? Math.max(Math.min(viewport.width / 150, 6))
        : Math.min(viewport.width / 150, 6.9),
    [isMobile, viewport.width]
  )

  const [scrolling, setScrolling] = useState(false)

  // Use a less intensive frame update
  useFrame(() => {
    const lerpFactor = 0.2 // Original value
    const diff = (targetScrollY.current - scrollY.current) * lerpFactor

    camera.position.y += diff * (isMobile ? 0.02 : 0.05) // Original values
    camera.position.z += diff * (isMobile ? 0.02 : 0.05) // Original values

    // Update the current scroll position
    scrollY.current += diff

    camera.updateProjectionMatrix()
  })

  // Throttle scroll handler to improve performance
  const handleScroll = useCallback(
    throttle(() => {
      setScrolling(true)
      targetScrollY.current = window.scrollY

      // Clear any existing timeouts to handle rapid firing of the scroll event
      if (scrollEndTimeoutRef.current !== null) {
        clearTimeout(scrollEndTimeoutRef.current)
      }

      // Set a timeout to detect when scrolling stops
      scrollEndTimeoutRef.current = window.setTimeout(() => {
        setScrolling(false)
      }, 50) // Slightly increased from 10ms for better performance
    }, 16), // 60fps (1000ms/60 ≈ 16ms)
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      // Also clear any timeout when the component unmounts
      if (scrollEndTimeoutRef.current !== null) {
        clearTimeout(scrollEndTimeoutRef.current)
      }
    }
  }, [handleScroll])

  return (
    <>
      <Title
        fontSize={fontSize * (isMobile ? 1.3 : 1)}
        position={[0, 8, -10 + (isMobile ? 2 : 0)]}
      />
      <Float enabled={isMobile ? !scrolling : true}>
        <Sphere
          position={[
            0,
            8 + (isMobile ? 1.2 : 0),
            0 - sizeMultiplier * 1.2 + (isMobile ? 2 : 0),
          ]}
          size={(fontSize / 1.1) * (isMobile ? 1.2 : 1)}
        />
        <Cube
          position={[
            7 - sizeMultiplier / 3 + (isMobile ? -1.3 : 4),
            isMobile ? 8 : 8,
            0,
          ]}
          size={[
            1.2 * fontSize,
            1.2 * fontSize,
            10 / fontSize / (isMobile ? 3 : 1),
          ]}
        />
        <Octahedron
          position={[-7 + sizeMultiplier / 4 + (isMobile ? 2 : -1), 8, 0]}
          size={[
            (fontSize / 1.5) * (isMobile ? 1.3 : 1) * (isMobile ? 1.2 : 1),
            0,
          ]}
        />
      </Float>
    </>
  )
}

export default function Juice({ onLoaded }: { onLoaded: () => void }) {
  const GPUTier = useDetectGPU()
  const [degraded, degrade] = useState(false)

  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  if (GPUTier.isMobile && GPUTier.tier === 0) return <Fallback />

  return (
    <>
      <Canvas
        camera={{ fov: 80, position: [0, 0, 20] }}
        eventPrefix='client'
        style={{
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 0,
        }}
      >
        <color args={['#e0e0e0']} attach='background' />
        <Content />
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <Environment resolution={64} frames={degraded ? 1 : Infinity}>
          <Lightformer
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-50, 2, 0]}
            scale={[100, 2, 1]}
          />
        </Environment>
        <EffectComposer disableNormalPass enabled={!degraded}>
          <N8AO aoRadius={3} intensity={1} />
          <TiltShift2 blur={0.05} />
        </EffectComposer>
      </Canvas>
    </>
  )
}
