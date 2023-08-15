import { useEffect, useRef } from "react"
import { RootState, store } from '../../../store';
import { useSelector } from 'react-redux';


export const AudioPlayer: React.FC = () => {
    const containerRef = useRef()
    const sozCloud = useSelector((state: RootState) => state.appSozcloud);

    useEffect(() => {
        if (sozCloud.globalPlayerRef && sozCloud.soundPlayer)
        {
            sozCloud.soundPlayer.setOptions({container: sozCloud.globalPlayerRef})
            
        }
        if (sozCloud.globalPlayerRef)
            return
        if (!sozCloud.soundPlayer)
            store.dispatch.appSozcloud.initializeSelfPlayer({options: {}, containerRef})
        store.dispatch.appSozcloud.set({globalPlayerRef: containerRef})
        return
    }, [containerRef])

    return (
     <div ref={containerRef} className="opacity-0 absolute w-[0px]"></div>   
    )
}