import {Get, Post} from './http';

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
    getAssessmentInfo:(data) =>{
        return Get('/controller/quantiAssessment/getAssessmentInfo',data);
    }
}

export default request;