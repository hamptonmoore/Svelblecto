<div class="col-sm-12 col-md-4 col-lg-2 clickable" on:click={click}>
    <div class="card">
        <img class="card-img-top" src={`${store.endpoint}/movie/${item.id}/poster`}>
    </div>
    <p class="text-white">
        {item.movieName}
    </p>
</div>

<script>
    import {store} from '../../store';
    import {push} from 'svelte-spa-router';

    export let item;

    async function click() {
        let res = await store.oblecto.axios.get(`/movie/${item.id}/info`);
        push(`/viewer/movie/${item.id}/${res.data.Files[0].id}`);
    }
</script>

<style>
    .card-img-top {
        width: 100%;
        object-fit: cover;
    }
</style>
