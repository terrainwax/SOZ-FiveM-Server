import { createModel } from '@rematch/core';
import { RootModel } from '..';
import { SozAlbum, ZpotifyInit, ZpotifyEvents, SozMusic } from '../../../../typings/zpotify'
import { ServerPromiseResp } from '../../../../typings/common';
import WaveSurfer from 'wavesurfer.js';
import { fetchNui } from '@utils/fetchNui';
import { buildRespObj } from '@utils/misc';
import { MockZpotifyAlbums } from '../../apps/zpotify/utils/constants';

export const appZpotify = createModel<RootModel>()({
    state: {
        soundPlayer: null as WaveSurfer,
        globalPlayerRef: null as any,
        albums: [] as SozAlbum[],
        playing: null as SozMusic
    },
    reducers: {
        set: (state, payload) => {
            return { ...state, ...payload };
        },
    },
    effects: dispatch => ({
        initializeSelfPlayer(payload: ZpotifyInit) {
            if (!payload.containerRef.current) return

            const ws = WaveSurfer.create({
                ...payload.options,
                container: payload.containerRef.current,
            })
            dispatch.appZpotify.set({ soundPlayer: ws })
        },

        async loadPlayer(music: SozMusic, state: any) {
            if (state.appZpotify.soundPlayer) {
                if (!state.appZpotify.soundPlayer.getDecodedData() || state.appZpotify.playing !== music) {
                    if (state.appZpotify.soundPlayer.isPlaying)
                        state.appZpotify.soundPlayer.pause();

                    (state.appZpotify.soundPlayer as WaveSurfer).load(music.path)
                        .then((value) => {
                            console.log("playing2");
                            dispatch.appZpotify.set({ playing: music })
                        })
                        .catch((rejected) => console.error);
                }

            }

            return
        },
        async loadMusics() {
            fetchNui<ServerPromiseResp<SozAlbum[]>>(
                ZpotifyEvents.FETCH_ALBUMS,
                undefined,
                buildRespObj(MockZpotifyAlbums)
            )
                .then(albums => {
                    dispatch.appZpotify.set({ albums: albums.data });
                })
                .catch(() => console.error);
        }
    })
})