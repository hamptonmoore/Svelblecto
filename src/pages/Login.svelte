<div class="mx-auto">
    <h1>Oblecto: Login</h1>
    <h2>{message}</h2>
    {#if state == states.ENDPOINT}
        <input bind:value={states.ENDPOINT.endpoint} placeholder="Oblecto Server">
        <br>
        <button on:click={checkEndpoint}>Login</button>
    {/if}

    {#if state == states.USERS}
        <div class="row justify-content-center">
            {#each states.USERS.users as user}
                <div class="col-sm-15 col-md-4 col-lg-3 userSelect" on:click={selectUser(user)}>
                    <div class="card">
                        <div class="img-wrapper">
                            <img class="card-img-top" src="https://picsum.photos/seed/{user.username}/256/256">
                            <div class="card-img-overlay d-flex">
                                <h2 class="align-self-center mx-auto">{user.username}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if state == states.LOGIN}
        <input bind:value={states.LOGIN.username} placeholder="username">
        <br>
        <input bind:value={states.LOGIN.password} placeholder="password">
        <br>
        <button on:click={login}>Login</button>
    {/if}
</div>

<script>
    import {store} from '../store';
    import {push} from "svelte-spa-router";

    store.loggedIn.subscribe((v)=>{
        if (v){
            push("/");
        }
    })

    let states = {
        "ENDPOINT": {
            endpoint: store.endpoint
        },
        "USERS": {
            users: []
        },
        "LOGIN": {
            username: "",
            password: ""
        }
    }
    let state = states.ENDPOINT;
    let message = '';

    async function checkEndpoint() {
        let result = await store.checkEndpoint(states.ENDPOINT.endpoint);
        if (result.status == "success") {
            console.log(result.data);
            states.USERS.users = result.data;
            state = states.USERS;
        } else {
            message = result.reason;
        }
    }

    async function login() {
        let result = await store.loginUser(states.LOGIN.username, states.LOGIN.password, states.ENDPOINT.endpoint);
        if (result.status != "success"){
            switch (result.reason){
                case "endpointErr":
                    message = "Endpoint appears to be down, please try again";
                    state = states.ENDPOINT;
                    break;
                case "loginErr":
                    message = "Username or Password not correct, please try again";
                    break;
            }
        }
    }

    function selectUser(user) {
        console.log(user);
        state = states.LOGIN;
        states.LOGIN.username = user.username;
    }

    function hover(cb, cb2) {
        console.log(cb, cb2);
    }
</script>

<style>
    .userSelect:hover {
        cursor: pointer;
    }

    .card {
        margin: 1em;
    }

    .card-img-overlay {
        color: white;
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>