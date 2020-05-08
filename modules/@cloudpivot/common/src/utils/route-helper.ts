
import { RouteConfig } from 'vue-router';


export interface RouteMap {

    root?: RouteConfig

    home?: RouteConfig

    [key: string]: RouteConfig | RouteMap | undefined

}

export abstract class RouteHelper {


    static assign(map1: RouteMap, map2: RouteMap) {
        const keys1 = Object.keys(map1);
        if (keys1.length === 0) {
            return map2;
        }

        const keys2 = Object.keys(map2);
        if (keys2.length === 0) {
            return map1;
        }

        const keys = keys1.concat(keys2);
        const map: RouteMap = {};
        for (const key of keys) {
            const item1 = map1[key];
            if (!item1) {
                map[key] = map2[key];
            } else if (!map2[key]) {
                map[key] = item1;
            } else {
                if (!(item1 as RouteMap).root) {
                    map[key] = map2[key];
                } else {
                    map[key] = RouteHelper.assign(item1 as RouteMap, map2[key] as RouteMap);
                }
            }
        }

        return map;

    }


    static toRoutes(map: RouteMap) {

        const routes = Object.keys(map).map(key => {
            const item = Object.assign({}, map[key]);
            const root = (item as RouteMap).root;
            if (root) {
                delete (item as any).root;
                root.children = RouteHelper.toRoutes(item as RouteMap);
                return root;
            }else{
                return item as RouteConfig;
            }
        });

        return routes;
    }

}