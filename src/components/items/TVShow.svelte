<div class="col-sm-12 col-md-4 col-lg-3 clickable" on:click={click}>
    <div class="card">
        <img class="card-img-top" src={`${store.endpoint}/episode/${item.id}/banner`}>
    </div>
    <p class="text-white">
        {item.episodeName} <br/>
        <span class="text-muted">{item.Series.seriesName}</span>
    </p>
</div>

<script>
    import {store} from '../../store';
    import {push} from "svelte-spa-router";

    export let item;async function click() {
        let res = await store.oblecto.axios.get(`/episode/${item.id}/info`);
        push(`/viewer/episode/${item.id}/${res.data.Files[0].id}`);
    }
</script>

<style>
    .card-img-top {
        width: 100%;
        object-fit: cover;
    }
</style>