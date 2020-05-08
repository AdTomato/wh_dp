import {
    renderer
} from '@cloudpivot/form';

import Vue from 'vue';
// import VueAMap from 'vue-amap';

let inited = false;

export class DefaultLocationService implements renderer.LocationService {

    initMap() {

        if (inited) {
            return;
        }

        inited = true;

        const VueAMap = require('vue-amap');

        Vue.use(VueAMap.default);

        VueAMap.initAMapApiLoader({
            key: 'de01827a5c46df0ffa956bc2d6b11ca0',
            plugin: ['Geocoder', 'AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Map'],
            // 默认高德 sdk 版本为 1.4.4
            v: '1.4.14',
            uiVersion: '1.0.11'
        });
    }

    position(range?: number, showMap?: boolean): Promise<renderer.LocationPositionResult> {
        return Promise.resolve({} as any);
    }

    navigation(latitude: number, longitude: number, title: string): void {

    }

    isEl() : void {
        
    }
}
