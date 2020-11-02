<div class="col-sm-12 col-md-4 col-lg-3 clickable display-item">
    <div class="card">
        <img class="card-img-top" src={`${store.endpoint}/episode/${item.id}/banner`}>
    </div>
    <p class="text-white">
        {item.episodeName} <br/>
        {item.Series.seriesName}
    </p>
</div>

<script>
    import {store} from '../../store';
    export let item;
</script>

<style>
    .card-img-top {
        width: 100%;
        height: 15vw;
        object-fit: cover;
    }
</style>