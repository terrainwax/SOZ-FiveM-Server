export interface ZpotifyInit {
    options: any,
    containerRef: any,
}

export interface SozMusic {
    artiste: SozArtiste[],
    cover: string,
    musicName: string,
    path: string

}

export interface ISozAlbum {
    artiste: SozArtiste,
    name: string,
    cover: string,
    musics: SozMusic[],
    isSingle(): boolean
}

export class SozAlbum implements ISozAlbum {
    artiste: SozArtiste
    name: string
    cover: string
    musics: SozMusic[]

    constructor(artiste, name, cover, musics) {
        this.artiste = artiste;
        this.name = name;
        this.cover = cover;
        this.musics = musics;
    }

    isSingle(): boolean {
        return this.musics.length === 1
    }
    
}

export interface SozArtiste {
    name: string,
    avatar: string
}

export enum ZpotifyEvents {
    FETCH_ALBUMS = 'phone:app:zpotify:fetchAlbums',
}