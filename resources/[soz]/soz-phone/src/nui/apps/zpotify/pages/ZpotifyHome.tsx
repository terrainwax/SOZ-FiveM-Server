import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState, store } from '../../../store';
import { Searchlist } from '../components/SearchList';

export const ZpotifyHome: React.FC = () => {
    const zpotify = useSelector((state: RootState) => state.appZpotify);
    const isPlaying = useSelector((state: RootState) => state.appZpotify.playing);
    const [inputText, setInputText] = useState('');

    const inputHandler = e => {
        //convert input text to lower case
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    useEffect(() => {
        store.dispatch.appZpotify.loadMusics();
    }, []);

    return (
        <div className={'relative grow flex flex-col grow' + (isPlaying ? ' h-[90%]' : ' h-full')}>
            <span className="blur-3xl bg-[#68EF8E] w-[272px] h-[272px] fixed left-[244px] top-[416px] -z-[1] bg-opacity-50" />
            <span className="blur-3xl bg-[#4AD234] w-[272px] h-[272px] fixed left-[76px] top-[716px] -z-[1] bg-opacity-50" />

            <div className="max-w-md rounded-lg overflow-hidden md:max-w-xl ">
                <div className="md:flex">
                    <div className="w-full p-3">
                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#FFFFFF"
                                className="w-5 h-5 absolute top-5 left-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>

                            <input
                                type="text"
                                onChange={inputHandler}
                                placeholder="Rechercher un artiste ? une musique ?"
                                className="bg-[#295122] opacity-50 h-14 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer text-white"
                                name=""
                            />
                        </div>
                    </div>
                </div>
            </div>

            {inputText !== '' ? <Searchlist musics={zpotify.albums} input={inputText} /> : <div>test2</div>}
        </div>
    );
};
