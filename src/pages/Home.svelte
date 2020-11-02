<script>
    import {link} from 'svelte-spa-router'
    import {store} from '../store';

    console.log("Loaded");
    let test = async () => {
        console.log(await store.oblecto.movieLibrary.getList('popularity', 'asc'))
    };
    test();

    let user;
    store.user.subscribe((v) => user = v);
</script>

<div>
    Hello, {user.username}
</div>

<style>

</style>