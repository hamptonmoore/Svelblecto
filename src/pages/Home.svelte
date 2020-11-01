<script>
    import {link} from 'svelte-spa-router'
    import {store} from '../store';
</script>

<main>
<h1>Hello!</h1>
    {JSON.stringify(store)}
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>

</style>