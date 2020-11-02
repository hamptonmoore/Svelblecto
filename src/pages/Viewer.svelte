<script>
    import {store} from "../store";

    export let params = {}
    let streamingURL = "";
    console.log(params);

    store.oblecto.axios.get(`/session/create/${params.file}`).then(({data}) => {
        console.log(data);
        let streamURL = new URL(store.oblecto.axios.defaults.baseURL);
        streamURL.pathname = `/session/stream/${data.sessionId}`;
        streamURL.searchParams.append("offset", "0");
        streamingURL = streamURL.href;
        console.log(streamingURL);
        video.load();
        video.play();
    });

    let video;
</script>


<div>
    <video bind:this={video} controls>
        <source src={streamingURL} type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

<style>
    video {
        width: 100%;
        height: 100%;
    }
</style>