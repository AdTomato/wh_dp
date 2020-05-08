
import * as typing from '../platform-service';

import { IS_DINGTALK, IS_IOS } from '../is-platform'

import dd from 'dingtalk-jsapi';

export {
    dd
}

export class DingTalkService implements typing.PlatformServiceLike {

    // private setLeftFn?: (e: any) => void;

    setTitle(title: string) {
        dd.biz.navigation.setTitle({
            title
        });
    }

    openLink(url: string) {
        dd.biz.util.openLink({
            url: url,
        });
    }

    close() {
        dd.biz.navigation.close({});
    }

    setLeft(params: typing.SetLeftParams) {
        const fn = params.fn;

        const text = params.text || '返回';

        // if (IS_IOS) {
            // this.setLeftFn = fn;
            dd.biz.navigation.setLeft({
                text, // 控制显示文本，空字符串表示显示默认文本
                // show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
                control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
                // showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
                android: true,
                onSuccess() {
                    fn.apply(this, []);
                },
                // onFail() { },
            });
        // } else {
        //     // this.setLeftFn = (e: any) => {
        //     //     fn();
        //     //     if (e) {
        //     //         e.preventDefault();
        //     //     }
        //     // };

        //     const listener = function (e: Event) {
        //         if (e) {
        //             e.preventDefault();
        //         }
        //         fn();
        //     };

        //     window.document.addEventListener('backbutton', listener, false);
        // }
    }

    getLocation(params: typing.GetLocationParams): Promise<typing.GetLocationResult> {
        return dd.device.geolocation.get({
            targetAccuracy: params.accuracy,
            coordinate: 1,
            withReGeocode: params.reGeocode,
            useCache: false
        });
    }

    mapSearch(params: typing.MapSearchParams): Promise<typing.MapSearchResult> {
        return dd.biz.map.search(params as any);
    }

    mapView(params: typing.MapViewParams): void {
        dd.biz.map.view(params);
    }
}