<div class="row mx-auto justify-content-center">
    <h2>{message}</h2>
    {#if state == states.ENDPOINT}
        <div class="d-flex justify-content-center h-100">
            <div class="d-flex justify-content-center form_container">
                <form>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control input_user"
                               placeholder="Oblecto server" bind:value={states.ENDPOINT.endpoint}>
                    </div>

                    <div class="d-flex justify-content-center mt-3 login_container">
                        <button type="button" name="button" class="btn btn-primary" on:click={checkEndpoint}>Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    {#if state == states.USERS}
            {#each states.USERS.users as user}
                <div class="col-sm-12 col-md-4 col-lg-3 clickable bottom-pad" on:click={selectUser(user)}>
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
    {/if}

    {#if state == states.LOGIN}
        <div class="d-flex justify-content-center h-100">
            <div class="d-flex justify-content-center form_container">
                <form>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control input_user"
                               placeholder="Username" bind:value={states.LOGIN.username}>
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control input_user"
                               placeholder="Password" bind:value={states.LOGIN.password}>
                    </div>

                    <div class="d-flex justify-content-center mt-3 login_container">
                        <button type="button" name="button" class="btn btn-primary" on:click={login}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<script>
    import {store} from '../store';
    import {get} from 'svelte/store';
    import {push, location} from "svelte-spa-router";

    store.loggedIn.subscribe((v)=>{
        if (v){
            let redirectedFrom = get(store.redirectedFrom);
            if (redirectedFrom != ""){
                push(redirectedFrom);
            } else {
                push("/");
            }
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

    .card-img-overlay {
        color: white;
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>