<div class="container-fluid" style="margin-bottom: 3em;">
    <h4 class="text-white">{title}</h4>
    <div class="d-flex flex-row flex-nowrap scrollable">
        {#await promise}
        {:then items}
            {#each items as item}
                <svelte:component this={child} item={item}/>
            {/each}
        {/await}
    </div>
</div>

<script>
    export let promise;
    export let child;
    export let title;
</script>

<style>
    .scrollable {
        overflow: hidden;
        overflow-x: visible;
        white-space: nowrap;
        padding: 5px 0;
    }
</style>