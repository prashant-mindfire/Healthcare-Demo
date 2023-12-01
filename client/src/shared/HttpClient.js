import axios from "axios";
//import API_END_POINTS from './ApiEndPoints';

const httpClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  timeout: 1000,
});
// const history = createBrowserHistory();

// let access_token = null;
// const getToken = async () => {
//     try {
//         // Make API call to get token
//         const response = await axios.post(API_END_POINTS.getAccessToken());
//         access_token = response.data.access_token;
//         // token.expiresAt = Math.floor(Date.now() / 1000) + token.expires_in; // Calculate expiration timestamp
//     } catch(error) {
//         console.log(error)
//         throw error;
//     }

// };

// const isTokenExpired = () => {
//     const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds

//     if (token && token.expiresAt && token.expiresAt < currentTime) {
//       return true; // Token has expired
//     }
//     return false; // Token is still valid
// };

//Request handling
// httpClient.interceptors.request.use(
//     async (config) => {
//         if (!access_token) {
//             await getToken();
//         }

//         if (access_token) {
//           config.headers['Authorization'] = `Bearer ${access_token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// );

//Response handling
// httpClient.interceptors.response.use(
//   (response) => {
//     if (response.status === 200 || response.status === 201) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(response);
//     }
//   },
//   async (error) => {
//     const originalConfig = error.config;
//     if (error.response.status) {
//       switch (error.response.status) {
//         case 401:
//           if (!originalConfig._retry) {
//             originalConfig._retry = true;
//             await getToken();
//           }
//           // alert('session expired');
//           // history.push('/');
//           break;
//         default:
//           return Promise.reject(error.response);
//       }
//     }
//   }
// );

export default httpClient;
