import { useParams } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { slugify } from "../utils/slugify";
import { Typography } from "@material-tailwind/react";

export const ZpotifyAlbum: React.FC = () => {
    const zpotify = useSelector((state: RootState) => state.appZpotify);
    const { artiste, album } = useParams()

    const albumobj = zpotify.albums.find((value) => {
        return slugify(value.artiste.name) === artiste && slugify(value.name) === album
    })

    return (<div className="flex flex-col">
        <div id="album-header" className="flex flex-row p-4">
            <img src={albumobj.cover} className="w-40 h-40" />
            <div className="p-4 flex flex-col-reverse ">
                
                <Typography variant="small" color="white" className="mb-2 h-fit" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                    {albumobj.artiste.name}
                </Typography>
                <Typography variant="h4" color="white" className="mb-2 h-fit" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                    {albumobj.name}
                </Typography>
            </div>

        </div>
        <div className="overflow-y">

        </div>
    </div>)
}