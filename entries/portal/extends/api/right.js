import request from './request';
var obj = {};
var storage = {
      //获取用户权限
      async getUserPermissionsDate(){
        await request.getUserPermissions().then(res => {
          if(res.errcode==0){
            if(res.data.isStation==true){
              obj =  res.data;
            }else if(res.data.isDetachment==true){
              obj =  res.data;
            }else if(res.data.isBrigade==true){ 
              obj =  res.data;
            }else{
              alert("类型不存在")
            }
          }else if(res.errcode == 406){
              obj =  res;
          }
        })
        return obj ;
      },

      //根据消防站id获取今日警情信息
      async getEarlyInfo(stationId){
        var parmar = {
          stationId:stationId,
          date:"2020-04-07 00:00:00"
        }
        await request.getEarlyInfo(parmar).then(res => {
          if(res.errcode==0){
            obj = res.data;
          }
        })
        return obj ;
      },

      //更新今日警情信息
      async uploadEarlyInfo(parmar){
        await request.uploadEarlyInfo(parmar).then(res => {
          if(res.errcode==0){obj = res;}
        })
        return obj ;
      },
      //获取值班信息

      async getOnDutyInfo(stationId){
        var parmar = {
          stationId:stationId,
          date:"2020-04-07 00:00:00"
        }
        await request.getOnDutyInfo(parmar).then(res => {
          if(res.errcode==0){
            obj = res.data;
          }
        })
        return obj ;
      },

      //获取车辆信息
      async getVehicleInfo(stationId){
        var parmar = {stationId:stationId}
        await request.getVehicleInfo(parmar).then(res => {
          if(res.errcode==0){
            obj = res.data;
          }
        })
        return obj ;
      }
}
export default storage;//把这个方法暴露出去，方便外部引用

