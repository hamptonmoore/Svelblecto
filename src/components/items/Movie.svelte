<div class="col-sm-12 col-md-4 col-lg-2 clickable">
    <div class="card">
        <img class="card-img-top" src={`${store.endpoint}/movie/${item.id}/poster`}>
    </div>
    <p class="text-white">
        {item.movieName}
    </p>
</div>

<script>
    import {store} from '../../store';
    export let item;
</script>

<style>
    .card-img-top {
        width: 100%;
        object-fit: cover;
    }
</style>
