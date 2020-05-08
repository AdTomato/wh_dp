import defaultRoutes from './routes';


import { utils } from '@cloudpivot/common';

// const routeMap = utils.RouteHelper.assign(defaultRoutes);

const routes = utils.RouteHelper.toRoutes(defaultRoutes as any);

// console.log(routeMap);
// console.log(routes);

export default routes;