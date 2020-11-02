import jwt_decode from "jwt-decode";
import {push} from "svelte-spa-router";
import {writable} from "svelte/store";
import axios from "axios";
import Oblecto from 'oblectoclient';

let OblectoSession = Oblecto.default;

let store = {
    oblecto: null,
    user: writable({
        "id": 0,
        "name": null,
        "email": null,
        "iat": null
    }),
    showNav: writable(true),
    endpoint: localStorage.getItem("endpoint"),
    loggedIn: writable(false),

    checkEndpoint: async function (endpoint) {
        endpoint = endpoint || "http://localhost:8080";
        try {
            this.oblecto = new OblectoSession(endpoint);
            let users = await this.oblecto.userManager.getUsers();
            this.setEndpoint(endpoint);
            return {status: "success", data: users}
        } catch (error) {
            console.log(error);
            return {status: "failure", reason: "Endpoint not found"};
        }
    },

    buildLocalUserData: async function () {
        store.user.set(jwt_decode(this.oblecto.accessToken));
    },

    loginUser: async function (username, password) {
        try {
            await this.oblecto.authenticate(username, password);
            this.loggedIn.set(true);
            localStorage.setItem("JWT", this.oblecto.accessToken);
            this.buildLocalUserData();
            return {status: "success"};
        } catch (error) {
            console.log(error)
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                return {status: "failure", reason: "loginErr"};
            } else {
                console.log("failed to load");
                return {status: "failure", reason: "endpointErr"};
            }
        }
    },

    setEndpoint: function (endpoint) {
        this.endpoint = endpoint;
        localStorage.setItem("endpoint", endpoint);
    }
}

if (localStorage.getItem("endpoint") && localStorage.getItem("JWT")) {
    let oblectoTest = new OblectoSession(localStorage.getItem("endpoint"));

    oblectoTest.accessToken = localStorage.getItem("JWT");
    oblectoTest.axios.defaults.headers.common = {'Authorization': `bearer ${oblectoTest.accessToken}`};

    oblectoTest.remotes.getClients().then(() => {
        store.loggedIn.set(true);
        store.oblecto = oblectoTest;
        store.buildLocalUserData();
    }).catch((err) => {
        localStorage.removeItem("JWT");
    });
}


export {store};

