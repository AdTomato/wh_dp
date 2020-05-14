import {Get, Post} from './http';

const request = {
    getStationAlertInfo:(data) => {
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
<<<<<<< Updated upstream
    getNotice:(data) => {
        // 获取公告
        return Post('/controller/notice/getNoticeById',data);
    },
    getMonthStar:(data) => {
        return Get('/controller/starMonth/getStationStarMonthByStationId', data)
    }
=======

    //获取登录人权限
    getUserPermissions:(data) => {
        return Get('/controller/org/getUserAuthority?userId=2c90a43e6eb51314016eb667507239e9',data);
    },

    //根据大队id获取消防站
    getStation:(data) => {
        return Get('/controller/org/getAllStationListByBrigadeId',data);
    },

>>>>>>> Stashed changes
}

export default request;