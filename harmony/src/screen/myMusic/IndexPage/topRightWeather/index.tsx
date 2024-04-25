import * as React from 'react';
// import { connect } from 'react-redux';
import { Descriptions } from 'antd';

import './index.scss';
import TransparentBox1 from 'src/components/transparentBox1';
// import { getWeather } from '@/redux/modules/Weather/action';

interface BottomWeatherProps {
  // getWeather: Function;
  weather: { [propName: string]: any };
}

interface BottomWeatherState {}

class BottomWeather extends React.Component<
  BottomWeatherProps,
  BottomWeatherState
> {
  state = {};
  render() {
    const {
      baro,
      humidity,
      currentTemp,
      weatherDescription,
      feelTemp,
      airQuailty,
    } = this.props.weather;
    return (
      <TransparentBox1 title="Weather">
        <Descriptions className="transparent_description">
          <Descriptions.Item label="Temp">
            {currentTemp} ℃
          </Descriptions.Item>
          <Descriptions.Item  label="BTemp">{feelTemp} ℃</Descriptions.Item>
          <Descriptions.Item   label="Weather">
            {weatherDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Air">
            {airQuailty}
          </Descriptions.Item>
          <Descriptions.Item   label="Pressure">{baro} hPa</Descriptions.Item>
          <Descriptions.Item   label="Humidity">{humidity} %</Descriptions.Item>
        </Descriptions>
      </TransparentBox1>
    );
  }


}


export default BottomWeather