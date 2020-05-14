import {Get, Post} from './http';

const request = {
    getStationAlertInfo:(data) => {
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
    getNotice:(data) => {
        // 获取公告
        return Post('/controller/notice/getNoticeById',data);
    },
    getMonthStar:(data) => {
        return Get('/controller/starMonth/getStationStarMonthByStationId', data)
    }
}

export default request;