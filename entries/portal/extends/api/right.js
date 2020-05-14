import request from './request';
var obj = {};
var storage = {
      //获取用户权限
      async getUserPermissionsDate(){
        await request.getUserPermissions().then(res => {
          console.log("res===",res);
          if(res.errcode==0){
            debugger;
            if(res.data.isStation==true){
              debugger;
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
      }
      
}
export default storage;//把这个方法暴露出去，方便外部引用

