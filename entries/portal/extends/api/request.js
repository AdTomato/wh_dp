import {Get, Post} from './http';

const request = {
    getStationAlertInfo:(data) => {
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
}

export default request;