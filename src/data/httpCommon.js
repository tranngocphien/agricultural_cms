import axios from 'axios';

// create a new axios instance
const instance = axios.create({
  baseURL: 'http://192.168.1.13:8080',
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin" : "*"
  }
});

// add an interceptor to the instance
instance.interceptors.request.use(
  (config) => {
    console.log(config)
    // const token = localStorage.getItem('token');
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4OTYxNTAxOSwiZXhwIjoxNjg5NzAxNDE5fQ.8IKWX7An514zTEAxCRLP1vhowPIKEPtcnP0du2jPa4k"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "*/*";
    return config;
  },
  (error) => {
    console.log(error)
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(response => {
    console.log(response);
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

export default instance;