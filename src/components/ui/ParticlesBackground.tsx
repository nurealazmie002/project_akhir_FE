import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Container, Engine } from 'tsparticles-engine'

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (_container: Container | undefined) => {
  }, [])

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            resize: true,
          },
          modes: { 
            repulse: { distance: 150, duration: 0.4 } 
          },
        },
        particles: {
          color: { value: '#10b981' },
          links: {
            color: '#14b8a6',
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            outModes: { default: 'bounce' },
          },
          number: { 
            density: { enable: true, area: 800 }, 
            value: 60 
          },
          opacity: { value: 0.4 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 4 } },
        },
        detectRetina: true,
      }}
    />
  )
}

export default ParticlesBackground
