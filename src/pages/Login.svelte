<main>
    <h1>Login!</h1>
    <h2>{message}</h2>
    {#if state == "endpoint"}
        <input bind:value={endpoint} placeholder="Oblecto Server">
        <br>
        <button on:click={checkEndpoint}>Login</button>
    {/if}

    {#if state == "userselect"}
        {#each users as user}
            <div>
                {user.username}
            </div>
        {/each}
    {/if}
</main>

<script>
    import {store} from '../store';
    import {push} from "svelte-spa-router";
    let state = 'endpoint';
    let users = [];
    let message = '';
    let username = '';
    let password = '';
    let endpoint = '';

    async function checkEndpoint(){
        let result = await store.checkEndpoint(endpoint);
        if (result.status == "success"){
            state = "userselect";
            users = result.data;
            console.log(users);
        } else {
            message = result.reason;
        }
    }

    async function login(){

        console.log(username, password);
        switch(await store.loginUser(username, password, endpoint)){
            case "success":
                push("/");
                break;
            case "endpointErr":
                message = "Endpoint not found";
                break;
            case "loginErr":
                message = "username or password not correct, please try again";
                break;
        }
    }
</script>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>