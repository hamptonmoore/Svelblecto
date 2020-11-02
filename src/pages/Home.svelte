<script>
    import {link} from 'svelte-spa-router'
    import TVShow from '../components/items/TVShow.svelte';
    import Movie from '../components/items/Movie.svelte';
    import ItemList from '../components/items/ItemList.svelte';
    import {store} from '../store';

    let user;
    store.user.subscribe((v) => user = v);
</script>

<div>
    <ItemList child={Movie} title="Watching: Movies"
              promise={store.oblecto.movieLibrary.getWatching()}/>
    <ItemList child={Movie} title="Recently Added: Movies"
              promise={store.oblecto.movieLibrary.getList('createdAt', 'desc')}/>
    <ItemList child={TVShow} title="Recently Added: TVShows"
              promise={store.oblecto.episodeLibrary.getList('createdAt', 'desc')}/>
</div>

<style>
    .display-item {
        min-width: 300px;
    }

    .wrap-overflow {
        overflow: visible;
        overflow-x: paged-y;
        overflow-wrap: break-word;
    }


</style>