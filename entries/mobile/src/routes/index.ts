import defaultRoutes from './routes';
import extendRoutes from '../../extends/routes';

import { utils } from '@cloudpivot/common';

const routeMap = utils.RouteHelper.assign(defaultRoutes as any, extendRoutes);

const routes = utils.RouteHelper.toRoutes(routeMap);

// console.log(routeMap);
// console.log(routes);

export default routes;
