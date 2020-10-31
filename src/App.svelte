<script>
    import Router from 'svelte-spa-router'
    import {push, pop, replace} from 'svelte-spa-router'
    import {wrap} from 'svelte-spa-router/wrap'
    import {store} from "./store";

    import Home from "./pages/Home.svelte";
    import Login from "./pages/Login.svelte";

    const routes = {
        // Exact path
        '/': wrap({
            // Use a dynamically-loaded component for this
            asyncComponent: () => import('./pages/Home.svelte'),
            // Adding one pre-condition that's an async function
            conditions: [
                async (detail) => {
                    // Return true to continue loading the component, or false otherwise
                    if (!store.loggedIn) {
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
    <Router {routes}/>
</body>


