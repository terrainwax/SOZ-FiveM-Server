import { Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { RootState, store } from '../../../store';
import { slugify } from '../utils/slugify';

export const ZpotifyAlbum: React.FC = () => {
    const zpotify = useSelector((state: RootState) => state.appZpotify);
    const isPlaying = useSelector((state: RootState) => state.appZpotify.playing);
    const navigate = useNavigate();
    const { artiste, album } = useParams();

    useEffect(() => {
        store.dispatch.appZpotify.loadMusics();
    }, []);
    const albumobj = zpotify.albums.find(value => {
        return slugify(value.artiste.name) === artiste && slugify(value.name) === album;
    });

    if (!albumobj) return <div>Album not found</div>;

    return (
        <div className={`flex flex-col` + (isPlaying ? ' h-[90%]' : ' h-full')}>
            <div className="absolute ml-3 mt-6" onClick={() => navigate(-1)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="white"
                    className="w-6 h-6"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </div>
            <div id="album-header" className="flex flex-row p-4">
                <img src={albumobj.cover} className="w-40 h-40 ml-8" />
                <div className="p-4 flex flex-col-reverse ">
                    <Typography
                        variant="small"
                        color="white"
                        className="mb-2 h-fit"
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        {albumobj.artiste.name}
                    </Typography>
                    <Typography
                        variant="h4"
                        color="white"
                        className="mb-2 h-fit"
                        nonce={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        {albumobj.name}
                    </Typography>
                </div>
            </div>
            <div className="overflow-y-auto flex flex-col h-[74%]">
                {albumobj.musics.map((music, index) => {
                    return (
                        <Card
                            key={music.musicName + index}
                            className="bg-transparent w-full max-w-[24rem] flex-row p-2 hover:scale-[1.01]"
                            onClick={async event => {
                                event.stopPropagation();
                                await store.dispatch.appZpotify.loadPlayer(music);
                            }}
                            nonce={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                        >
                            <CardBody
                                nonce={undefined}
                                onResize={undefined}
                                onResizeCapture={undefined}
                                className="align-middle flex p-0 ml-2 w-[100%]"
                            >
                                <div className="grow">
                                    <Typography
                                        variant="h4"
                                        color="white"
                                        className="mb-2"
                                        nonce={undefined}
                                        onResize={undefined}
                                        onResizeCapture={undefined}
                                    >
                                        {music.musicName}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="white"
                                        className="mb-4"
                                        nonce={undefined}
                                        onResize={undefined}
                                        onResizeCapture={undefined}
                                    >
                                        {music?.artiste.flatMap(artiste => artiste.name).join(',')}
                                    </Typography>
                                </div>
                                <Button
                                    className="flex items-center justify-center "
                                    variant="text"
                                    nonce={undefined}
                                    onResize={undefined}
                                    onResizeCapture={undefined}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="white"
                                        className="w-6 h-6 hover:w-7 hover:h-7"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                        />
                                    </svg>
                                </Button>
                                <Button
                                    className="flex items-center justify-center "
                                    variant="text"
                                    nonce={undefined}
                                    onResize={undefined}
                                    onResizeCapture={undefined}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="white"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                        />
                                    </svg>
                                </Button>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
