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
          }else if(res.errcode == 405){
            obj =  res;
          }
        })
        return obj ;
      },

      //根据消防站id获取今日警情信息
      async getEarlyInfo(stationId,type){
        var time = new Date().toLocaleDateString().replace(/\//g, '-')+" 00:00:00";
        if(type == 2){
          var parmar = {
            brigadeId:stationId,
            date:time
          }
        }else{
          var parmar = {
            stationId:stationId,
            date:time
          }
        }
        await request.getEarlyInfo(parmar,type).then(res => {
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

      async getOnDutyInfo(stationId,type){
        if(type==2){
          var parmar = {
            brigadeId:stationId,
            date:new Date().toLocaleDateString().replace(/\//g, '-')+" 00:00:00"
          }
        }else{
          var parmar = {
            stationId:stationId,
            date:new Date().toLocaleDateString().replace(/\//g, '-')+" 00:00:00"
          }
        }
        await request.getOnDutyInfo(parmar,type).then(res => {
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
      },

      //获取双随机公开数据 getRandomData
      async getRandomData(brigadeId){
        var parmar = {brigadeId:brigadeId}
        await request.getRandomData(parmar).then(res => {
          if(res.errcode==0){
            obj = res.data;
          }
        })
        return obj ;
      },

      //获取大屏标题接口
      async getTitle(id){
        var parmar = {id:id}
        await request.getTitle(parmar).then(res => {
          if(res.errcode==0){
            obj = res.data;
          }else if(res.errcode == 407){
            obj = res;
          }
        })
        return obj ;
      }

}
export default storage;//把这个方法暴露出去，方便外部引用

