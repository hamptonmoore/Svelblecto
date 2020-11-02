<script>
    import {link} from 'svelte-spa-router'
    import {store} from '../store';

    console.log("Loaded");

    let user;
    store.user.subscribe((v) => user = v);
</script>

<div>
    <div class="row mx-auto justify-content-center">
        {#await store.oblecto.movieLibrary.getList('createdAt', 'desc')}

        {:then movieLibrary}

            {#each movieLibrary as movie}
                <div class="col-sm-12 col-md-3 col-lg-2 clickable">
                    <div class="card text-white">
                        <img class="card-img-top" src={`${store.endpoint}/movie/${movie.id}/poster`}>
                        <div class="card-body">
                            <h6 class="card-title">{movie.movieName}</h6>
                        </div>
                    </div>
                </div>
            {/each}

        {/await}
    </div>
    <div class="row mx-auto justify-content-center">
        {#await store.oblecto.movieLibrary.getList('createdAt', 'desc')}

        {:then movieLibrary}

            {#each movieLibrary as movie}
                <div class="col-sm-12 col-md-3 col-lg-2 clickable">
                    <div class="card text-white">
                        <img class="card-img-top" src={`${store.endpoint}/movie/${movie.id}/poster`}>
                        <div class="card-body">
                            <h6 class="card-title">{movie.movieName}</h6>
                        </div>
                    </div>
                </div>
            {/each}

        {/await}
    </div>
</div>

<style>

</style>