import { Transition } from '@headlessui/react';
import React, { useEffect } from 'react';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { Route, Routes } from 'react-router-dom';
import { useApp } from '@os/apps/hooks/useApps';
import { ZpotifyPlayer } from './components/ZpotifyPlayer';
import { FullPage } from '@ui/layout/FullPage';
import { ZpotifyHome } from './pages/ZpotifyHome';
import { Drawer, Typography } from '@material-tailwind/react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ZpotifyAlbum } from './pages/ZpotifyAlbum';

export const ZpotifyApp: React.FC = () => {
    const messages = useApp('zpotify');
    const soundPlayer = useSelector((state: RootState) => state.appZpotify.soundPlayer);
    const isPPlaying = useSelector((state: RootState) => !state.appZpotify.soundPlayer?.isPlaying());
    const playing = useSelector((state: RootState) => state.appZpotify.playing);
    const musicname = useSelector((state: RootState) => state.appZpotify.playing?.musicName);
    const [openTop, setOpenTop] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false)
    const closeDrawerTop = () => setOpenTop(false);
    const openDrawerTop = () => setOpenTop(true);

    useEffect(() => {
        if (!soundPlayer) return
        setIsPlaying(soundPlayer.isPlaying())
    }, [musicname])

    useEffect(() => {
        if (!soundPlayer) return
        const subscriptions = [
            soundPlayer.on('play', () => {
              setIsPlaying(true)
            }),
            soundPlayer.on('pause', () => setIsPlaying(false)),
        ]
        return () => {
            subscriptions.forEach((unsub) => unsub())
          }
    }, [soundPlayer])

    return (
        <FullPage className='bg-[#121C0A]'>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[60%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[60%_20%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper className="h-[820px] w-full">
                    <AppWrapper className="h-[788px] w-full flex flex-col">
                        <Routes>
                            <Route path=':artiste/:album' element={<ZpotifyAlbum />} />
                            <Route index element={<ZpotifyHome />} />
                        </Routes>

                        {soundPlayer && playing && <div className='w-full bg-black/[0.6] h-[70px] flex flex-row' onClick={openDrawerTop}>
                            <div className='p-[5px] w-[60px] flex items-center'>
                                <img src={playing.cover}></img>
                            </div>
                            <div className='grow ml-2 mt-2'>
                                <Typography variant="h5" color="white" className="" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    {playing.musicName}
                                </Typography>
                                <Typography variant="h6" color="white" className="" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    {playing.artiste.flatMap((artiste) => artiste.name).join(',')}
                                </Typography>
                            </div>
                            <div className='flex items-center mr-5' onClick={async (event) => {
                                event.stopPropagation()
                                await soundPlayer.isPlaying() ? soundPlayer.pause() : soundPlayer.play()
                            }}>
                                {!isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-9 h-9">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-9 h-9">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                </svg>
                                }
                            </div>
                        </div>}
                    </AppWrapper>
                    <Drawer
                        placement="bottom"
                        size={820}
                        open={openTop}
                        onClose={closeDrawerTop}
                        className="p-4 bg-[#121C0A]"
                        overlay={false}
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        <ZpotifyPlayer drawerclose={closeDrawerTop} />
                    </Drawer>
                </AppWrapper>
            </Transition>
        </FullPage>
    );
};