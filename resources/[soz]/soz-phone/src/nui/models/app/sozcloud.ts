import { createModel } from '@rematch/core';
import { RootModel } from '..';
import {SozCloudInit} from '../../../../typings/sozcloud'
import WaveSurfer from 'wavesurfer.js';

export const appSozcloud = createModel<RootModel>()({
    state: {
        soundPlayer: null as WaveSurfer,
        globalPlayerRef: null as any
    },
    reducers: {
        set: (state, payload) => {
            console.log(state)
            console.log(payload)
            console.log({ ...state, ...payload })
            return { ...state, ...payload };
        },
    },
    effects: dispatch => ({
        initializeSelfPlayer(payload: SozCloudInit) {
            if (!payload.containerRef.current) return
  
            const ws = WaveSurfer.create({
              ...payload.options,
              container: payload.containerRef.current,
            })
            dispatch.appSozcloud.set({soundPlayer: ws})
        }
    })
})