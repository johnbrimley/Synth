<script lang="ts">
    import type { ToneMessage } from "$lib/common/messages/tone-message";
    import { Waveform } from "$lib/common/enums/waveforms";
    import WaveformSelect from "$lib/components/WaveformSelect.svelte";

    export let node: AudioWorkletNode | null = null;

    let waveform: Waveform = Waveform.Square;

    $: if (node) {
        const message: ToneMessage = {waveform};
        node.port.postMessage(message);
    }
</script>

<WaveformSelect bind:value={waveform} />
