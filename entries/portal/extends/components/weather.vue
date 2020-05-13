<template>
    <div>
        <div class="screen-item">
          <h3 class="screen-item-title">天气情况</h3>
          <div class="weather-info">
            <span>{{currentDate[0]}}</span>
            <span>{{currentDate[1]}}</span>
            <img src="../assets/images/sun_icon.png" alt />
            <span>7-18℃</span>
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
              <span class="weather-item-right weather-item-big-right">{{windDirection}}</span>
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
    import {Get, GetWeather, Post, getDates} from '../api/http';
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
                currentDate: []
            }
        },
        methods:{
            get_data(){
            // 获取空气质量
            axios.get('https://api.seniverse.com/v3/air/now.json?key=S2FU4pzhy2uHwdUpv&location=wuhan')
            .then(res => {
                this.airQuality = res.results[0].air.city.quality;
            })
            // 获取最高气温最低气温
            axios.get('https://api.seniverse.com/v3/weather/daily.json?key=S2FU4pzhy2uHwdUpv&location=wuhan&unit=c&start=0&days=0')
            .then(res => {
                console.log(res.results[0].daily[0]);
                // let tempeDiferData = 
            })
            // 获取天气
            const weatherUrl = 'https://api.seniverse.com/v3/weather/now.json';
            let par = {
                key: 'S2FU4pzhy2uHwdUpv',
                location: 'wuhan',
                language: 'zh-Hans',
                unit: 'c'
            }
            GetWeather(weatherUrl, par).then(res => {
                let weatherRes = res.results[0];
                console.log(res.results);
                this.humidity = weatherRes.now.humidity;
                this.airTemperature = weatherRes.now.temperature;
                this.windSpeed = weatherRes.now.wind_scale;
                this.windDirection = weatherRes.now.wind_direction;
                this.weatherVisible = weatherRes.now.visibility
               
            })

            // 获取当天的日期
            this.currentDate = getDates().split(',');
                console.log(this.currentDate);
            },
        },
        mounted(){
            // this.get_data();
        }
    }
</script>