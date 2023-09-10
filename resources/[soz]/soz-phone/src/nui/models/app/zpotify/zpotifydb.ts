import Dexie from "dexie";

export class ZpotifyDB extends Dexie {
    music!: Dexie.Table<IMusic, number>;

    constructor() {
        super("ZpotifyDB");

        this.version(1).stores({
            music: '++id, [artiste+musicName], cache',
        });

        this.music.mapToClass(Music);
    }
}

export interface IMusic {
    id?: number; // Primary key. Optional (autoincremented)
    artiste: string;
    musicName: string;
    cache: string;

}

export class Music implements IMusic {
    id?: number;
    artiste: string;
    musicName: string;
    cache: string;

    constructor(artiste: string, musicName: string, cache: string, id?: number) {
        this.artiste = artiste;
        this.musicName = musicName;
        this.cache = cache;
        if (id) this.id = id;
    }

    save() {
        return db.transaction('rw', db.music, () => {
            db.music.put(this).then(id => this.id = id)
        });
    }
}

export var db = new ZpotifyDB();