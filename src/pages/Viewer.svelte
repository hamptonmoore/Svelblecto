<script>
    import {store} from "../store";
    import Icon from 'svelte-awesome';
    import {play, pause} from 'svelte-awesome/icons';

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
        ui.video.load();
        ui.video.play();
    });

    let dataPromise;
    if (params.type == "movie") {
        dataPromise = store.oblecto.axios.get(`/movie/${params.id}/info`);
    } else {
        dataPromise = store.oblecto.axios.get(`/episode/${params.id}/info`);
    }

    dataPromise.then(({data}) => {
        let files = data.Files;
        console.log(files);
        for (let file of files) {
            if (file.id == params.file){
                state.duration = file.duration;
            }
        }
    });

    let state = {
        playing: true,
        duration: 0,
        offset: 0,
        currentTime: 0
    }

    let ui = {
        playPause: null,
        video: null,
        seek: null
    }
    let actions = {};

    actions.playPause = function () {
        state.playing = !state.playing;
        if (state.playing) {
            ui.video.play();
        } else {
            ui.video.pause();
        }
    }


    // formatTime takes a time length in seconds and returns the time in
    // minutes and seconds
    function formatTime(timeInSeconds) {
        const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
        return result;
    };
</script>


<div>

    <div class="video-container" id="video-container">
        <div class="playback-animation" id="playback-animation">
            <svg class="playback-icons">
                <use class="hidden" href="#play-icon"></use>
                <use href="#pause"></use>
            </svg>
        </div>

        <video class="video" id="video" bind:this={ui.video} poster="poster.jpg">
            <source src={streamingURL} type="video/mp4"/>
        </video>

        <div class="video-controls" id="video-controls">
            <div class="video-progress">
                <progress id="progress-bar" value="0" min="0"></progress>
                <input class="seek" id="seek" value="0" min="0" type="range" step="1" bind:this={ui.seek}>
                <div class="seek-tooltip" id="seek-tooltip">00:00</div>
            </div>

            <div class="bottom-controls">
                <div class="left-controls">
                    <button data-title="Play (k)" bind:this={ui.playPause} on:click={actions.playPause}>
                        <svg class="playback-icons text-white">
                            <Icon data={state.playing ? pause : play} scale={2}/>
                        </svg>
                    </button>

                    <div class="volume-controls">
                        <button data-title="Mute (m)" class="volume-button" id="volume-button">
                            <svg>
                                <use class="hidden" href="#volume-mute"></use>
                                <use class="hidden" href="#volume-low"></use>
                                <use href="#volume-high"></use>
                            </svg>
                        </button>

                        <input class="volume" id="volume" value="1"
                               data-mute="0.5" type="range" max="1" min="0" step="0.01">
                    </div>

                    <div class="time">
                        <time id="time-elapsed">00:00</time>
                        <span> / </span>
                        <time id="duration">{formatTime(state.duration)}</time>
                    </div>
                </div>

                <div class="right-controls">
                    <button data-title="PIP (p)" class="pip-button" id="pip-button">
                        <svg>
                            <use href="#pip"></use>
                        </svg>
                    </button>
                    <button data-title="Full screen (f)" class="fullscreen-button" id="fullscreen-button">
                        <svg>
                            <use href="#fullscreen"></use>
                            <use href="#fullscreen-exit" class="hidden"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>


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
        background: var(--youtube-red);
        border-radius: 2px;
    }

    progress::-moz-progress-bar {
        border: 1px solid var(--youtube-red);
        background: var(--youtube-red);
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

    input[type=range] {
        -webkit-appearance: none;
        -moz-appearance: none;
        height: 8.4px;
        background: transparent;
        cursor: pointer;
    }

    input[type=range]:focus {
        outline: none;
    }

    input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        cursor: pointer;
        border-radius: 1.3px;
        -webkit-appearance: none;
        transition: all 0.4s ease;
    }

    input[type=range]::-webkit-slider-thumb {
        height: 16px;
        width: 16px;
        border-radius: 16px;
        background: var(--youtube-red);
        cursor: pointer;
        -webkit-appearance: none;
        margin-left: -1px;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
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

    input[type=range]::-moz-range-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        border: 1px solid transparent;
        background: transparent;
        border-radius: 1.3px;
    }

    input[type=range]::-moz-range-thumb {
        height: 14px;
        width: 14px;
        border-radius: 50px;
        border: 1px solid var(--youtube-red);
        background: var(--youtube-red);
        cursor: pointer;
        margin-top: 5px;
    }

    input[type=range]:focus::-moz-range-track {
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