import { useCallback, useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import { RootState, store } from '../../../store';
import { useSelector } from 'react-redux';



const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null)
    const sozCloud = useSelector((state: RootState) => state.appSozcloud);
  
    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
      if (sozCloud.soundPlayer)
      {
        if (!sozCloud.soundPlayer.getDecodedData())
          sozCloud.soundPlayer.load(options.url)
        sozCloud.soundPlayer.setOptions({...options})
        containerRef.current!.appendChild(sozCloud.soundPlayer['renderer']['container'])
        setWavesurfer(sozCloud.soundPlayer)
        return () => {
            sozCloud.soundPlayer.setOptions({container: sozCloud.globalPlayerRef})
            sozCloud.globalPlayerRef.current!.appendChild(sozCloud.soundPlayer['renderer']['container'])
            sozCloud.soundPlayer.play()
        }
      }
      store.dispatch.appSozcloud.initializeSelfPlayer({options, containerRef});
      
      setWavesurfer(sozCloud.soundPlayer)
  
    }, [options, containerRef])
  
    return wavesurfer
  }

  const WaveSurferPlayer = (props) => {
    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, props)
  
    // On play button click
    const onPlayClick = useCallback(() => {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }, [wavesurfer])
  
    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
      if (!wavesurfer) return
  
      setCurrentTime(0)
      setIsPlaying(false)
  
      const subscriptions = [
        wavesurfer.on('play', () => setIsPlaying(true)),
        wavesurfer.on('pause', () => setIsPlaying(false)),
        wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
        wavesurfer.on('click', (clickx) => console.log(clickx)),
        wavesurfer.on('timeupdate', (currentTime) => {if (wavesurfer.getDuration() <= currentTime ) wavesurfer.play()}),
        wavesurfer.on('redraw', () => console.log("render"))

      ]
  
      return () => {
        subscriptions.forEach((unsub) => unsub())
      }
    }, [wavesurfer])


  
    return (
      <>
        <div ref={containerRef} style={{ minHeight: '120px' }} />
  
        <button onClick={onPlayClick} style={{ marginTop: '1em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </>
    )
  }

export const ZpotifyPlayer: React.FC = () => {
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// Define the waveform gradient
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
gradient.addColorStop(0, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
gradient.addColorStop(1, '#B1B1B1') // Bottom color

// Define the progress gradient
const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
progressGradient.addColorStop(0, '#2fee39') // Top color
progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#2fee39') // Top color
progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#a6f694') // Bottom color
progressGradient.addColorStop(1, '#a6f694') // Bottom color


    return (
      <div className="relative">
        <div style={{zoom:"111%"}}>
        <WaveSurferPlayer
        
        height={80}
        waveColor={gradient}
        progressColor={progressGradient}
        barWidth={4}
        barRadius={4}
        url={'https://audio.jukehost.co.uk/mvuqUe7UdE1ifIXLwEJrjnakuMzQacMf'}
      />
      </div>
      </div>
    )
}