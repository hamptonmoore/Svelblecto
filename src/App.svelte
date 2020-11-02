<script>
    import Router from 'svelte-spa-router'
    import {push, pop, replace, location} from 'svelte-spa-router'
    import {get} from 'svelte/store';
    import {wrap} from 'svelte-spa-router/wrap'
    import {store} from "./store";
    import Login from "./pages/Login.svelte";
    import Home from "./pages/Home.svelte";
    import Viewer from "./pages/Viewer.svelte";
    import Icon from 'svelte-awesome';
    import {signOut} from 'svelte-awesome/icons';


    let loggedIn = false;

    store.loggedIn.subscribe((value) => {
        loggedIn = value;
    });

    let showNav = true;

    store.showNav.subscribe((v) => showNav = v);

    async function checkLoggedIn(detail) {
        if (!loggedIn) {
            store.redirectedFrom.set(get(location));
            push('/login');
            return false;
        } else {
            return true;
        }
    }

    const routes = {
        // Exact path
        '/': wrap({
            // Use a dynamically-loaded component for this
            asyncComponent: () => Home,
            // Adding one pre-condition that's an async function
            conditions: [
                checkLoggedIn
            ]
        }),

        '/viewer/:type/:id/:file': wrap({
            // Use a dynamically-loaded component for this
            asyncComponent: () => Viewer,
            // Adding one pre-condition that's an async function
            conditions: [
                checkLoggedIn
            ]
        }),

        // Using named parameters, with last being optional
        '/login': Login,

    }


    let state = {
        loggedIn: false
    }

</script>

<div>
    <nav class="navbar navbar-dark bg-primary text-white" class:d-none={!showNav}>
        <a class="navbar-brand" href="#">Oblecto</a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item clickable" on:click={store.signOut} >
                <Icon data={signOut} scale={2} />
            </li>
        </ul>

    </nav>
    <div class="container">
        <Router {routes}/>
    </div>
</div>

<style>
    nav {
        margin-bottom: 2em;
    }
</style>