import Axios from "axios";

const baseURL = "https://bitcoinvsaltcoins.com";

const axios = Axios.create({
    baseURL,
    timeout: 10000,
});

axios.interceptors.request.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            const code = error.response.status;
            const msg = error.response.data.message;
            console.log(`Code: ${code}, Message: ${msg}`);
            console.error(`[Axios Error]`, error.response);
        } else {
            console.log(`${error}`);
        }
        return Promise.reject(error);
    }
);

export default axios;
