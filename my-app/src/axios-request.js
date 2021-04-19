import axios from 'axios';
import { get } from 'js-cookie';
import queryString from 'query-string';

const baseURL = process.env.API_ENDPOINT || 'http://localhost:4000/api/';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

instance.interceptors.request.use((req) => {
  console.log('token', get('USER_TOKEN'));
  req.headers.authorization = `Bearer ${get('USER_TOKEN')}`;
  return req;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    const { response } = error;
    let res = {};

    if (!response) return res;

    res.status = response.status;
    res.statusText = response.statusText;

    if (!response.data) return res;

    res = { ...res, ...response.data };

    throw res;
  }
);

export default instance;
