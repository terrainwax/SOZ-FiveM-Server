import { cachedBlobToBlob } from '@utils/misc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';

import { useConfig } from '../../../hooks/usePhone';
import { db, Music } from '../../../models/app/zpotify/zpotifydb';
import { RootState, store } from '../../../store';

const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null);
    const zpotify = useSelector((state: RootState) => state.appZpotify);
    const RWOptions = { ...options };

    // Initialize wavesurfer when the container mounts
    // or any of the props change

    useEffect(() => {
        if (zpotify.soundPlayer) {
            containerRef.current!.appendChild(zpotify.soundPlayer['renderer']['container']);
            zpotify.soundPlayer.setOptions({ ...RWOptions });
            setWavesurfer(zpotify.soundPlayer);
            return () => {
                zpotify.globalPlayerRef.current!.appendChild(zpotify.soundPlayer['renderer']['container']);
                zpotify.soundPlayer.setOptions({ container: zpotify.globalPlayerRef });
            };
        }

        store.dispatch.appZpotify.initializeSelfPlayer({ options: RWOptions, containerRef });

        setWavesurfer(zpotify.soundPlayer);
    }, [options, containerRef, zpotify.playing]);

    return wavesurfer;
};

const WaveSurferPlayer = props => {
    const containerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [durationTime, setDurationTime] = useState(0);
    const wavesurfer = useWavesurfer(containerRef, props);
    const settings = useConfig();
    const artiste = props.artiste;
    const music = props.music;

    // On play button click
    const onPlayClick = useCallback(() => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }, [wavesurfer]);

    const convert = (value: number): string => {
        return (
            Math.floor(value / 60) +
            ':' +
            (value % 60 ? (Math.trunc(value % 60) < 10 ? '0' + Math.trunc(value % 60) : Math.trunc(value % 60)) : '00')
        );
    };

    // Initialize wavesurfer when the container mounts
    // or any of the props change

    useEffect(() => {
        if (!wavesurfer) return;

        setCurrentTime(0);

        setIsPlaying(wavesurfer.isPlaying());

        const subscriptions = [
            wavesurfer.on('play', () => {
                setIsPlaying(true);
            }),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('ready', durationTime => {
                const reader = new FileReader();
                reader.addEventListener('load', async () => {
                    if (!props.artiste || !props.music) return;
                    await db.transaction('rw', db.music, async function () {
                        const musicObj = await db.music
                            .where({ artiste: props.artiste, musicName: props.music })
                            .first();
                        if (!musicObj) await db.music.add(new Music(artiste, music, reader.result as string));
                    });
                });
                fetch(wavesurfer['media'].src).then(async r => reader.readAsDataURL(await r.blob()));
            }),
            wavesurfer.on('timeupdate', currentTime => {
                setCurrentTime(currentTime);
                setDurationTime(wavesurfer.getDuration());
            }),
            wavesurfer.on('timeupdate', currentTime => {
                if (wavesurfer.getDuration() <= currentTime) wavesurfer.play();
            }),
        ];

        wavesurfer['renderer'].wrapper.addEventListener('click', e => {
            const rect = wavesurfer['renderer'].wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left * (settings.zoom.value / 100);
            const relativeX = x / (rect.width * (settings.zoom.value / 100));
            wavesurfer.seekTo(relativeX);
        });

        return () => {
            subscriptions.forEach(unsub => unsub());
        };
    }, [wavesurfer]);

    return (
        <>
            <div ref={containerRef} />
            <div className="w-full">
                <span className="text-white inline-block w-2/4">{convert(currentTime)}</span>
                <span className="text-white inline-block w-2/4 text-right">{convert(durationTime)}</span>
            </div>
            <div className="w-full flex items-center justify-center">
                <div onClick={onPlayClick}>
                    {!isPlaying ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="white"
                            className="w-9 h-9"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="white"
                            className="w-9 h-9"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                    )}
                </div>
            </div>
        </>
    );
};

export const ZpotifyPlayer: React.FC<any> = ({ drawerclose }) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const settings = useConfig();
    const zpotify = useSelector((state: RootState) => state.appZpotify);

    const navigate = useNavigate();

    useEffect(() => {
        store.dispatch.appZpotify.loadMusics();
    }, []);

    const music = zpotify.playing;
    // Define the waveform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, '#ffffff'); // Top color
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#ffffff'); // Top color
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#ffffff'); // Bottom color
    gradient.addColorStop(1, '#ffffff'); // Bottom color

    // Define the progress gradient
    const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    progressGradient.addColorStop(0, '#2fee39'); // Top color
    progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#2fee39'); // Top color
    progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
    progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
    progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#a6f694'); // Bottom color
    progressGradient.addColorStop(1, '#a6f694'); // Bottom color

    return (
        <div className="relative h-[100%]">
            <span className="blur-3xl bg-[#68EF8E] w-[272px] h-[272px] fixed left-[244px] top-[416px] -z-[1] bg-opacity-50" />
            <span className="blur-3xl bg-[#4AD234] w-[272px] h-[272px] fixed left-[76px] top-[716px] -z-[1] bg-opacity-50" />
            <div className="w-full">
                <div className="inline-block w-1/5" onClick={drawerclose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-10 h-10 ml-[9px]"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <span className="font-['Rubik'] text-left text-xl font-bold text-white mt-[7px] align-top inline-block w-3/5 text-center">
                    {music?.musicName}
                </span>
                <div className="inline-block w-1/5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-10 h-10 ml-[30px]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                    </svg>
                </div>
            </div>
            <div className="mt-[49px] w-[363px] h-[363px] mr-auto ml-auto">
                <img className="rounded-3xl" src={music?.cover} />
            </div>
            <div className="w-full">
                <div className="mt-[25px] ml-[12px] inline-block">
                    <span className="font-['Rubik'] text-left text-2xl font-bold text-white align-top block">
                        {music?.musicName}
                    </span>
                    <span className="font-['Rubik'] text-left text-xs font-normal text-white mt-[4px] align-top block">
                        {music?.artiste.flatMap(artiste => artiste.name).join(',')}
                    </span>
                </div>
                <div className="mt-[35px] inline-block float-right mr-[22px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-8 h-8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </div>
            </div>
            <div className="w-[87%] mr-auto ml-auto mt-[50px]">
                <WaveSurferPlayer
                    height={54}
                    waveColor={gradient}
                    progressColor={progressGradient}
                    barWidth={4}
                    barRadius={4}
                    url={music?.path}
                    artiste={music?.artiste.flatMap(artiste => artiste.name).join('+')}
                    music={music?.musicName}
                />
            </div>
        </div>
    );
};
