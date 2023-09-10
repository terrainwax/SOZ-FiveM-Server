import { useEffect, useRef } from "react"
import { RootState, store } from '../../../store';
import { useSelector } from 'react-redux';


export const AudioPlayer: React.FC = () => {
    const containerRef = useRef()
    const zpotify = useSelector((state: RootState) => state.appZpotify);

    useEffect(() => {
        if (zpotify.globalPlayerRef && zpotify.soundPlayer)
        {
            zpotify.soundPlayer.setOptions({container: zpotify.globalPlayerRef})
            
        }
        if (zpotify.globalPlayerRef)
            return
        if (!zpotify.soundPlayer)
            store.dispatch.appZpotify.initializeSelfPlayer({options: {}, containerRef})
        store.dispatch.appZpotify.set({globalPlayerRef: containerRef})
        return
    }, [containerRef])

    return (
     <div ref={containerRef} className="opacity-0 absolute w-[0px]"></div>   
    )
}