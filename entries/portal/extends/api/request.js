import {Get, Post,Put} from './http';


const request = {
    getStationAlertInfo:(data) => {
        return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
    },
    //每月之星
    getStationStarMonth:(data) => {
        return Get('/controller/starMonth/getStationStarMonthByStationId',data);
    },
    //人员动态和生日
    getMainInfo:(data) =>{
        return Get('/controller/personlInfo/getInfo',data);
    },
    //量化考评
    getAssessmentInfo:(data) =>{
        return Get('/controller/quantiAssessment/getAssessmentInfo',data);
    },
    // 获取天气
    getWeatherData: (data) => {
        return Get('/controller/weather/getWeatherByCityCode',data)
    },
    getNotice:(data) => {
        // 获取公告
        return Get('/controller/personlInfo/getInfo',data);
    },
    getEducationInfo:(data) => {
        // 获取教育训练计划
        return Get('/controller/Education/getStationEduTrainPalnByStationId',data);
    },
    getTrainInfo:(data) => {
        // 获取龙虎榜
        return Get('/controller/trainResult/getTrainResults',data);
    },
    // 获取本周工作
    getWorkData: (data) => {
        return Get('/controller/weekWork/getWeekWorks',data);
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
    //根据消防站id获取今日警情信息/获取大队今日警情信息
    getEarlyInfo(data,type){
        if(type == 2){
            console.log("查询大队")
            return Get('/controller/alertInfo/getBrigadeAlertInfoByBrigadeId',data);
        }else{
            console.log("查询消防站")
            return Get('/controller/alertInfo/getStationAlertInfoByStationId',data);
        }
    },

    //更新今日警情信息
    uploadEarlyInfo(data){
        return Put('/controller/alertInfo/updateStationAlertInfoByStationId',data);
    },

    //获取值班信息
    getOnDutyInfo(data,type){
        if(type == 2){
            console.log("获取大队值班信息")
            return Get('/controller/stationDutyInfo/getBrigadeDutyInfoByBrigadeId',data);
        }else{
            console.log("获取消防站值班信息")
            return Get('/controller/stationDutyInfo/getStationDutyInfoByStationId',data);
        }
    },

    //获取车辆信息
    getVehicleInfo(data){
        return Get('/controller/carsInfo/getCarsInfos',data);
    },

    //更新车辆状态
    uploadVehicleStatus(data){
        return Put('/controller/carsInfo/updateCarsStatus',data);
    },
    //获取双随机公开数据a
    getRandomData(data){
        return Get('/controller/personlInfo/getTwoRandownInfo',data);
    }
}

export default request;