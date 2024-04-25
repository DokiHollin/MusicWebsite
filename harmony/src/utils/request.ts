// import axios from 'axios';
// import qs from 'qs';
// import { message } from 'antd';

import axios from "axios";


type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  data?: any;
};

axios.defaults.baseURL = 'http://3.26.210.47/api';

export function request(config: RequestOptions) {
  return axios(config);
}