<script>
    import Router from 'svelte-spa-router'
    import {push, pop, replace} from 'svelte-spa-router'
    import {wrap} from 'svelte-spa-router/wrap'
    import {store} from "./store";
    import Login from "./pages/Login.svelte";
    import Home from "./pages/Home.svelte";


    let loggedIn = false;

    store.loggedIn.subscribe((value) => {
        loggedIn = value;
    })

    const routes = {
        // Exact path
        '/': wrap({
            // Use a dynamically-loaded component for this
            asyncComponent: () => Home,
            // Adding one pre-condition that's an async function
            conditions: [
                async (detail) => {
                    // Return true to continue loading the component, or false otherwise
                    if (!loggedIn) {
                        push('/login');
                        return false;
                    } else {
                        return true;
                    }
                }
            ]
        }),

        // Using named parameters, with last being optional
        '/login': Login,

    }


    let state = {
        loggedIn: false
    }

</script>

<body>
<div class="container">
    <Router {routes}/>
</div>
</body>


