
import axios from './axios';

import api from './api.mappings';


export class CommonApi{

    systemConfig() {
        return axios.get(api.common.systemConfig);
    }

}