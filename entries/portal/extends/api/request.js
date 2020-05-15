import {Get, Post,Put} from './http';


const request = {
    getStationAlertInfo:(data) => {
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
    getNotice:(data) => {
        // 获取公告
        return Get('/controller/personlInfo/getInfo',data);
    },
    getMonthStar:(data) => {
        return Get('/controller/starMonth/getStationStarMonthByStationId', data)
    },
    //获取登录人权限
    getUserPermissions:(data) => {
        return Get('/controller/org/getUserAuthority?userId=2c90a43e6efe8b04016effb119271c6f',data);
    },
    //根据大队id获取消防站
    getStation:(data) => {
        return Get('/controller/org/getAllStationListByBrigadeId',data);
    },
    //根据消防站id获取今日警情信息
    getEarlyInfo(data){
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
    //更新今日警情信息
    uploadEarlyInfo(data){
        return Put('/controller/alertInfo/updateStationAlertInfoByStationId',data);
    },

    //获取值班信息
    getOnDutyInfo(data){
        return Get('/controller/stationDutyInfo/getStationDutyInfoByStationId',data);
    },

    //获取车辆信息
    getVehicleInfo(data){
        return Get('/controller/carsInfo/getCarsInfos',data);
    },

    //更新车辆状态
    uploadVehicleStatus(data){
        return Put('/controller/carsInfo/updateCarsStatus',data);
    }
}

export default request;