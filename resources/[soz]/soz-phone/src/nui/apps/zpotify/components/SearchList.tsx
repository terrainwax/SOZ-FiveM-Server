import { Avatar, Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { SozAlbum } from "@typings/zpotify"
import { RootState, store } from "../../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

export const Searchlist: React.FC<{ musics: SozAlbum[], input: string }> = ({ musics, input }) => {
    const navigate = useNavigate()
    const artistes = musics.flatMap((albums) => albums.musics.flatMap((musics) => musics.artiste))

    const unique = artistes.filter((obj, index) => {
        return index === artistes.findIndex(o => obj.name === o.name);
    });

    const artisteSearch = unique.filter((obj, index) => {
        return obj.name.toLowerCase().includes(input.toLowerCase());
    })

    const musicSearch = musics.filter((album, index) => {
        return (album.name.toLowerCase().includes(input.toLowerCase()) ||
            album.musics.some((music) => music.musicName.toLowerCase().includes(input.toLowerCase())) ||
            album.artiste.name.toLowerCase().includes(input.toLowerCase()) ||
            album.musics.some((music) => music.artiste.some((artiste) => artiste.name.toLowerCase().includes(input.toLowerCase()))))
    })


    return (
        <div className="h-[89%]">
            <div>
                {artisteSearch.length > 0 && (
                    <span className="text-left text-xl font-bold text-white p-3">
                        Artiste
                    </span>)}
                <div className="flex overflow-x-auto w-[400px] flex-row no-scrollbar">
                    {artisteSearch.map((artiste, index) => {
                        return (
                            <Card key={artiste.name+index} className="bg-transparent m-2 min-w-[45%] hover:border hover:border-solid hover:border-[#295122]" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                <CardHeader floated={false} className="h-24 bg-transparent justify-center flex" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    <img src={artiste.avatar} alt="profile-picture" className="rounded-full bg-auto" />
                                </CardHeader>
                                <CardBody className="text-center" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    <Typography variant="h4" color="white" className="mb-2" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                        {artiste.name}
                                    </Typography>
                                </CardBody>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <div className="h-[62%]">
                {musicSearch.length > 0 && (
                    <span className="text-left text-xl font-bold text-white p-3">
                        Musiques / Albums
                    </span>)}
                <div className="flex overflow-y-auto h-[94%] flex-col">
                    {musicSearch.map((music, index) => {
                        return (
                            <Card key={music.name+index} className="bg-transparent w-full max-w-[24rem] flex-row p-2 hover:scale-[1.01]" onClick={async (event) => {
                                if (music.isSingle())
                                {
                                    event.stopPropagation()
                                    await store.dispatch.appZpotify.loadPlayer(music.musics[0])
                                    //playing(true)
                                }
                                else
                                    navigate(`${slugify(music.artiste.name)}/${slugify(music.name)}`)
                            }} nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                <CardHeader floated={false} className="m-0 w-1/5 shrink-0 bg-transparent" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    <img src={music.cover} alt="profile-picture" />
                                </CardHeader>
                                <CardBody nonce={undefined} onResize={undefined} onResizeCapture={undefined} className="align-middle flex p-0 ml-2 w-[300px]">
                                    <div className="grow">
                                        <Typography variant="h4" color="white" className="mb-2" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                            {music.name}
                                        </Typography>
                                        <Typography variant="h6" color="white" className="mb-4" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                            {music.artiste.name}
                                        </Typography>
                                    </div>
                                    <Button className="flex items-center justify-center " variant="text" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 hover:w-7 hover:h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </Button>
                                </CardBody>
                            </Card>
                        )
                    })
                    }

                </div>
            </div>
        </div>
    )
}