<script lang="ts">
    import type { ToneMessage } from '@common/messages/tone-message';
    import { Waveforms } from '@common/enums/waveforms';
    import WaveformSelect from '$lib/components/WaveformSelect.svelte';

    export let node: AudioWorkletNode | null = null;

    let waveform: Waveforms = Waveforms.Square;

    $: if (node) {
        const message: ToneMessage = {waveform};
        node.port.postMessage(message);
    }
</script>

<WaveformSelect bind:value={waveform} />
