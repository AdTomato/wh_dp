<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">天气情况</h3>
          <div class="weather-info">
            <span>{{nowDate}}</span>
            <span>{{nowWeek}}</span>
            <img :src="imgUrl" alt="">
            <span>{{temDif}}℃</span>
          </div>
          <ul class="weather-item">
            <li>
              <span class="weather-item-left weather-item-mid-left">湿度</span>
              <span class="weather-item-right weather-item-mid-right">{{humidity}}%</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">空气质量</span>
              <span class="weather-item-right weather-item-big-right">{{airQuality}}</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">气温</span>
              <span class="weather-item-right weather-item-small-right">{{airTemperature}}℃</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-mid-left">风力</span>
              <span class="weather-item-right weather-item-mid-right">{{windSpeed}}级</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-big-left">风向</span>
              <span class="weather-item-right weather-item-big-right">{{windDirection}}风</span>
            </li>
            <li>
              <span class="weather-item-left weather-item-small-left">能见度</span>
              <span class="weather-item-right weather-item-small-right">{{weatherVisible}}KM</span>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "weather",
        data() {
            return {
                humidity: '',
                airQuality: '',
                airTemperature: '',
                windSpeed: '',
                windDirection: '',
                weatherVisible: '',
                temDif: '',
                currentDate: [],
                nowDate: '',
                nowWeek: '',
                imgCode: '',
                imgUrl: '',
            }
        },
        methods:{
            getWeatherData(){
              // 获取当天天气情况
              // 获取空气质量
              axios.get('https://api.seniverse.com/v3/air/now.json?key=S2FU4pzhy2uHwdUpv&location=wuhan&scope=city')
              .then(res => {
                  this.airQuality = res.results[0].air.city.quality;
              })

              // 获取温差
              axios.get('https://api.seniverse.com/v3/weather/daily.json?key=S2FU4pzhy2uHwdUpv&location=wuhan&unit=c&start=0&days=1')
              .then(res => {
                  let highTem = res.results[0].daily[0].high;
                  let lowTem = res.results[0].daily[0].low;
                  this.temDif = lowTem + '-' + highTem;
              })

              // 获取其他条件
              axios.get('https://api.seniverse.com/v3/weather/now.json?key=S2FU4pzhy2uHwdUpv&location=wuhan&unit=c')
              .then(res => {
                  console.log(res.results);
                  let weatherData = res.results[0].now;
                  this.humidity = weatherData.humidity;
                  this.airTemperature = weatherData.temperature;
                  this.windSpeed = weatherData.wind_scale;
                  this.windDirection = weatherData.wind_direction;
                  this.weatherVisible = weatherData.visibility;
                  this.imgCode = weatherData.code;

                  let imgurls = '';
                  if(weatherData.code == 0 || weatherData.code == 1 || weatherData.code == 2 
                  || weatherData.code == 3 || weatherData.code == 38){
                    imgurls = 'sun_icon.png'
                  }else if(weatherData.code == 4 || weatherData.code == 5 || weatherData.code == 6 || weatherData.code == 7
                  || weatherData.code == 9 || weatherData.code == 8 || weatherData.code == 37){
                    imgurls = '4@2x.png'
                  }else if(weatherData.code == 10 || weatherData.code == 11 || weatherData.code == 12 
                  || weatherData.code == 13 || weatherData.code == 14 || weatherData.code == 15
                  || weatherData.code == 16 || weatherData.code == 17 || weatherData.code == 18 || weatherData.code == 19){
                    imgurls = '16@2x.png'
                  }else if(weatherData.code == 20 || weatherData.code == 21 || weatherData.code == 22 
                  || weatherData.code == 23 || weatherData.code == 24 || weatherData.code == 25){
                    imgurls = '23@2x.png'
                  }else if(weatherData.code == 26 || weatherData.code == 27 || weatherData.code == 28 
                  || weatherData.code == 29){
                    imgurls = '27@2x.png'
                  }else if(weatherData.code == 32 || weatherData.code == 33 || weatherData.code == 34 
                  || weatherData.code == 35 || weatherData.code == 36){
                    imgurls = '33@2x.png'
                  }else if(weatherData.code == 30){
                    imgurls = '30@2x.png'
                  }else if(weatherData.code == 31){
                    imgurls = '31@2x.png'
                  }
                  this.imgUrl = require('../assets/images/' + imgurls);
                  
              })

            },
            
            getCurrentDate(){
              // 获取当前日期
              var _this = this;
              let yy = new Date().getFullYear();
              let mm = new Date().getMonth() + 1;
              let dd = new Date().getDate();
              let week = new Date().getDay();
              if (week == 1) {
                  this.nowWeek = "星期一";
              } else if (week == 2) {
                  this.nowWeek = "星期二";
              } else if (week == 3) {
                  this.nowWeek = "星期三";
              } else if (week == 4) {
                  this.nowWeek = "星期四";
              } else if (week == 5) {
                  this.nowWeek = "星期五";
              } else if (week == 6) {
                  this.nowWeek = "星期六";
              } else {
                  this.nowWeek = "星期日";
              }
              _this.nowDate = yy + "年" + mm + "月" + dd + "号";
            }          
        },
        mounted(){
            this.getWeatherData();
            this.getCurrentDate();
        }
    }
</script>