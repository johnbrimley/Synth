<script lang="ts">
    import type { ToneMessage } from "@common/messages/tone-message";
    import { Waveforms } from "@common/enums/waveforms";
    import WaveformSelect from "$lib/components/WaveformSelect.svelte";

    export let node: AudioWorkletNode | null = null;

    let message: ToneMessage = {
        waveform: Waveforms.Square,
        attack: 100,
        release: 100,
    };

    $: if (node) {
        node.port.postMessage(message);
    }
</script>

<div class="processor-container">
    <span class="processor-label">Tone</span>
    <WaveformSelect bind:value={message.waveform!} />
    <div>
        <span>Attac</span>
        <input type="range" min="0" max="1000" bind:value={message.attack} />
        <span>{message.attack}ms</span>
    </div>
    <div>
        <span>Release</span>
        <input type="range" min="0" max="2000" bind:value={message.release} />
        <span>{message.release}ms</span>
    </div>
</div>
