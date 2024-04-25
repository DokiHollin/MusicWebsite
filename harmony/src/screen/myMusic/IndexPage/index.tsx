import * as React from 'react';
import { Row, Col } from 'antd';
import './index.scss';

import LeftList from './leftList';
import MiddleGreeting from './middleGreeting';
import RightFunctionList from './rightFunctionList';
import BottomWeather from './topRightWeather';
import BottomSpectrum from './topLeftSpectrum';
// import judgeBrowserTitle from '@/utils/judgeBrowserTitle';

interface IndexPageProps {}

interface IndexPageState {}
// let weather = {
//   baro: 1012,
//   humidity: 65,
//   currentTemp: 22.5,
//   weatherDescription: 'Partly Cloudy',
//   feelTemp: 21.8,
//   airQuailty: 'Good'
// };
interface IndexPageState {
  weather: {
    baro: number;
    humidity: number;
    currentTemp: number;
    weatherDescription: string;
    feelTemp: number;
    airQuailty: string;
  }
}
const apiKey = '506acd974776efcdab4516d408da7723';
const cityName = 'Sydney';  // 你可以更改这个城市名
const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     // const weather = {
//     //   baro: data.main.pressure,
//     //   humidity: data.main.humidity,
//     //   currentTemp: data.main.temp,
//     //   weatherDescription: data.weather[0].description,
//     //   feelTemp: data.main.feels_like,
//     //   // airQuality: 这需要其他的API端点或服务来获取
//     // };
//     weather.baro = data.main.pressure
//     weather.humidity = data.main.humidity
//     weather.currentTemp = data.main.temp
//     weather.weatherDescription = data.weather[0].description
//     weather.feelTemp = data.main.feels_like

//     console.log(weather.baro);
//     console.log(weather.humidity);
//     console.log(weather.currentTemp);
//     console.log(weather.weatherDescription);
//     console.log(weather.feelTemp);
//     console.log(weather.airQuailty);
    
//   })
//   .catch(error => {
//     console.error('Error fetching weather data:', error);
//   });




class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
  constructor(props: IndexPageProps) {
    super(props);
    this.state = {
      weather: {
        baro: 1012,
        humidity: 65,
        currentTemp: 22.5,
        weatherDescription: 'Partly Cloudy',
        feelTemp: 21.8,
        airQuailty: 'Good'
      }
    };
  }
  componentDidMount() {
    const apiKey = '506acd974776efcdab4516d408da7723';
    const cityName = 'Sydney';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          weather: {
            ...this.state.weather,  // 保留其他不变的属性
            baro: data.main.pressure,
            humidity: data.main.humidity,
            currentTemp: data.main.temp,
            weatherDescription: data.weather[0].description,
            feelTemp: data.main.feels_like,
          }
        });
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
  render() {
    return (
      <div className="index_page">
        <Row className="h20 spectrum">
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <BottomSpectrum
           
  
          />

          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <BottomWeather weather={this.state.weather} />
          </Col>
        </Row>
        <Row className="h80">
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <LeftList />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <MiddleGreeting />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <RightFunctionList name='some name'/>
          </Col>
        </Row>
      </div>
    );
  }
  // componentDidMount() {
  //   judgeBrowserTitle();
  // }
}

export default IndexPage;
