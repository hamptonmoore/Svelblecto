<script>
    import {store} from "../store";
    import {get} from "svelte/store";
    import Icon from 'svelte-awesome';
    import {play, pause, volumeOff, volumeDown, volumeUp, expand, compress} from 'svelte-awesome/icons';

    export let params = {}

    import {onMount} from 'svelte';


    onMount(async () => {
        ui.video.addEventListener('timeupdate', updateTimeElapsed);

        let dataPromise;
        if (params.type == "movie") {
            dataPromise = store.oblecto.axios.get(`/movie/${params.id}/info`);
        } else {
            dataPromise = store.oblecto.axios.get(`/episode/${params.id}/info`);
        }

        dataPromise.then(({data}) => {
            console.log(data);
            for (let file of data.Files) {
                if (file.id == params.file) {
                    duration = file.duration;
                    break;
                }
            }

            let offset = 0;
            if (data.TrackMovies) {
                for (let track of data.TrackMovies) {
                    console.log(track);
                    if (track.UserId == get(store.user).id) {
                        offset = track.time;
                        break;
                    }
                }
            }

            newStream(params.file, offset);
        });
    });

    let streamingURL = "";



    let playing = true
    let duration = 0;
    let offset = 0;
    let currentTime = 0;
    let sessionId = "";
    let showbar = false;

    let ui = {
        playPause: null,
        video: null,
        videoContainer: null,
        seek: null,
        streamSession: null,
        volumeSlider: null
    }
    let actions = {};

    actions.playPause = function () {
        playing = !playing;
        if (playing) {
            playVideo();
        } else {
            ui.video.pause();
        }
    }

    function calculateTime() {
        return Number(currentTime) + Number(offset)
    }

    let fullscreen = false;

    function changeFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            fullscreen = false;
        } else {
            ui.videoContainer.requestFullscreen();
            fullscreen = true;
        }
    }

    function newStream(file, offset) {
        store.oblecto.axios.get(`/session/create/${file}`).then(({data}) => {
            sessionId = data.sessionId;
            setStream(data.sessionId, offset);
            if (playing) {
                playVideo();
            }
        });
    }

    function playVideo() {
        Promise.race([new Promise((resolve, reject) => {
            setTimeout(reject, 2000)
        }), ui.video.play()]).catch(() => {
            console.log("VIDEO NOT PLAYING");
        });
    }

    function setStream(sessionId, nOffset) {
        let streamURL = new URL(store.oblecto.axios.defaults.baseURL);
        streamURL.pathname = `/session/stream/${sessionId}`;
        streamURL.searchParams.append("offset", nOffset);
        streamingURL = streamURL.href;
        ui.video.src = streamingURL;
        offset = nOffset;
        ui.video.load();
    }

    // formatTime takes a time length in seconds and returns the time in
    // minutes and seconds
    function formatTime(timeInSeconds) {
        const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
        return result;
    }

    function seek(e) {
        newStream(params.file, ui.seek.value);
    }

    let volume = 1;

    function changeVolume() {
        ui.video.volume = ui.volumeSlider.value;
    }

    function mouseOverPlayer() {
        showbar = true;
    }

    function mouseOutPlayer() {
        // showbar = false;
    }

    function updateTimeElapsed(){
        currentTime = ui.video.currentTime;
    }
</script>


<div>

    <div class="video-container" bind:this={ui.videoContainer} id="video-container" on:mouseover={mouseOverPlayer}
         on:mouseout={mouseOutPlayer}>

        <video class="video" id="video" preload="none" bind:this={ui.video}
               on:click={actions.playPause}>
        </video>

        {#if showbar}
            <div class="video-controls" id="video-controls">
                <div class="video-progress">
                    <progress id="progress-bar" value={Number(offset) + Number(currentTime)} min="0"
                              max={duration}></progress>
                    <input id="seek" class="seek" min="0"
                           max={duration} type="range" bind:this={ui.seek} on:click={seek}>
                </div>

                <div class="bottom-controls">
                    <div class="left-controls">
                        <button data-title="Play" bind:this={ui.playPause} on:click={actions.playPause}>
                            <svg class="playback-icons text-white">
                                <Icon data={playing ? pause : play} scale={2}/>
                            </svg>
                        </button>

                        <div class="volume-controls">
                            <button data-title="Mute" class="volume-button text-white">
                                <Icon class="icon"
                                      data={volume == 0? volumeOff: volume > 0.5? volumeUp: volumeDown}
                                      scale={2} style="width: 32px; min-width: 32px; max-width: 32px;"/>
                            </button>
                            <input class="volume" bind:this={ui.volumeSlider} on:input={changeVolume}
                                   bind:value={volume}
                                   data-mute="0.5" type="range" max="1" min="0" step="0.01">
                        </div>

                        <div class="time">
                            <time id="time-elapsed">{formatTime(Number(offset) + Number(currentTime))}</time>
                            <span> / </span>
                            <time id="duration">{formatTime(duration)}</time>
                        </div>
                    </div>

                    <div class="right-controls">
                        <button data-title="PIP" class="pip-button" id="pip-button">
                            <svg>
                                <use href="#pip"></use>
                            </svg>
                        </button>
                        <button data-title="Full screen" on:click={changeFullscreen}
                                class="fullscreen-button text-white"
                                id="fullscreen-button">
                            <Icon data={fullscreen? compress: expand} scale={1.5}/>
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>

    :root {
        --svelblecto-blue: #375a7f;
    }

    .icon {
        min-width: 32px !important;
        width: 32px;
        max-width: 32px;
    }

    .video-container {
        width: 100%;
        border-radius: 4px;
        margin: 0 auto;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    video {
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }

    .video-controls {
        right: 0;
        left: 0;
        padding: 10px;
        position: absolute;
        bottom: 0;
        transition: all 0.2s ease;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    }

    .video-controls.hide {
        opacity: 0;
        pointer-events: none;
    }

    .video-progress {
        position: relative;
        height: 8.4px;
        margin-bottom: 10px;
    }

    progress {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 2px;
        width: 100%;
        height: 8.4px;
        pointer-events: none;
        position: absolute;
        top: 0;
    }

    progress::-webkit-progress-bar {
        background-color: #474545;
        border-radius: 2px;
    }

    progress::-webkit-progress-value {
        background: var(--svelblecto-blue);
        border-radius: 2px;
    }

    progress::-moz-progress-bar {
        border: 1px solid var(--svelblecto-blue);
        background: var(--svelblecto-blue);
    }

    .seek {
        position: absolute;
        top: 0;
        width: 100%;
        cursor: pointer;
        margin: 0;
    }

    .seek:hover + .seek-tooltip {
        display: block;
    }

    .seek-tooltip {
        display: none;
        position: absolute;
        top: -50px;
        margin-left: -20px;
        font-size: 12px;
        padding: 3px;
        content: attr(data-title);
        font-weight: bold;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .bottom-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left-controls {
        display: flex;
        align-items: center;
        color: #fff;
    }

    .volume-controls {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    .volume-controls input {
        width: 100px;
        opacity: 1;
        transition: all 0.4s ease;
    }

    .volume-controls:hover input, .volume-controls input:focus {
        width: 100px;
        opacity: 1;
    }

    button {
        cursor: pointer;
        position: relative;
        margin-right: 7px;
        font-size: 12px;
        padding: 3px;
        border: none;
        outline: none;
        background-color: transparent;
    }

    button * {
        pointer-events: none;
    }

    button::before {
        content: attr(data-title);
        position: absolute;
        display: none;
        right: 0;
        top: -50px;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-weight: bold;
        padding: 4px 6px;
        word-break: keep-all;
        white-space: pre;
    }

    button:hover::before {
        display: inline-block;
    }

    .fullscreen-button {
        margin-right: 0;
    }

    .pip-button svg {
        width: 26px;
        height: 26px;
    }

    .playback-animation {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -40px;
        margin-top: -40px;
        width: 80px;
        height: 80px;
        border-radius: 80px;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
    }

    input[type=range].seek {
        opacity: 0;
    }

    input[type=range].volume {
        -webkit-appearance: none;
        -moz-appearance: none;
        height: 8.4px;
        background: transparent;
        cursor: pointer;
    }

    input[type=range].volume:focus {
        outline: none;
    }

    input[type=range].volume::-webkit-slider-runnable-track {
        width: 100%;
        cursor: pointer;
        border-radius: 1.3px;
        -webkit-appearance: none;
        transition: all 0.4s ease;
    }

    input[type=range].volume::-webkit-slider-thumb {
        height: 16px;
        width: 16px;
        border-radius: 16px;
        background: var(--svelblecto-blue);
        cursor: pointer;
        -webkit-appearance: none;
        margin-left: -1px;
    }

    input[type=range].volume:focus::-webkit-slider-runnable-track {
        background: transparent;
    }

    input[type=range].volume {
        height: 5px;
        background-color: #fff;
    }

    input[type=range].volume::-webkit-slider-runnable-track {
        background-color: transparent;
    }

    input[type=range].volume::-webkit-slider-thumb {
        margin-left: 0;
        height: 14px;
        width: 14px;
        background: #fff;
    }

    input[type=range].volume::-moz-range-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        border: 1px solid transparent;
        background: transparent;
        border-radius: 1.3px;
    }

    input[type=range].volume::-moz-range-thumb {
        height: 14px;
        width: 14px;
        border-radius: 50px;
        border: 1px solid var(--svelblecto-blue);
        background: var(--svelblecto-blue);
        cursor: pointer;
        margin-top: 5px;
    }

    input[type=range].volume:focus::-moz-range-track {
        outline: none;
    }

    input[type=range].volume::-moz-range-thumb {
        border: 1px solid #fff;
        background: #fff;
    }

    .hidden {
        display: none;
    }

    svg {
        width: 28px;
        height: 28px;
        fill: #fff;
        stroke: #fff;
        cursor: pointer;
    }
</style>