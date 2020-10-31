import jwt_decode from "jwt-decode";
import {push} from "svelte-spa-router";
import axios from "axios";

let store = {
    user: {
        "id": 0,
        "sername": null,
        "name": null,
        "email": null,
        "iat": null
    },
    JWT: null,
    endpoint: null,
    loggedIn: false,

    checkEndpoint: async function(endpoint){
        endpoint = endpoint || "http://localhost:8080";
        try {
            let {data} = await axios.get(`${endpoint}/users`);
            return {status: "success", data}
        } catch(error) {
                return {status: "failure", reason: "Endpoint not found"};
        }
    },

    loginUser: async function (username, password, endpoint) {
        endpoint = endpoint || "http://localhost:8080";
        try {
            let {data} = await axios.post(`${endpoint}/auth/login`, {
                username,
                password,
            })
            this.applyJWT(data.accessToken);
            return "success";
        } catch(error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                return "loginErr";
            } else {
                console.log("failed to load");
                return "endpointErr";
            }
        }
    },

    setEndpoint: function (endpoint) {
        this.endpoint = endpoint;
    },
    applyJWT: function (JWT) {
        this.JWT = JWT;
        this.loggedIn = true;
        this.user = jwt_decode(JWT);
    }
}

export {store};

