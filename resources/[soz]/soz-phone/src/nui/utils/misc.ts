// Quickly determine whether we are in browser
import { ServerPromiseResp } from '@typings/common';

import { SOZ_PHONE_IS_PRODUCTION } from '../../globals';

export const isEnvBrowser = (): boolean => !SOZ_PHONE_IS_PRODUCTION && !(window as any).invokeNative;

export const getResourceName = () =>
    (window as any).GetParentResourceName ? (window as any)?.GetParentResourceName() : 'soz-phone';

export const buildRespObj = (data: any, status?: 'ok' | 'error', errorMsg?: string): ServerPromiseResp<any> => ({
    data,
    status,
    errorMsg,
});

export const cachedBlobToBlob = (cache: string): Blob => {
    let BASE64_MARKER = ';base64,';
    let base64Index = cache.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = cache.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let arr = new Uint8Array(new ArrayBuffer(rawLength));

    let TYPE_MARKER = 'data:';
    
    let markerIndex = cache.indexOf(TYPE_MARKER) + TYPE_MARKER.length;
    let endtype = cache.indexOf(';', markerIndex);
    let type = cache.substring(markerIndex, endtype)
  
    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i);
    }

    let blob = new Blob([arr], {
        type
      });
    return blob;
}
