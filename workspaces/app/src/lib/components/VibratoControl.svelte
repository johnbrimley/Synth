<script lang="ts">
    import { Waveforms } from '@common/enums/waveforms';
    import type {VibratoMessage} from '@common/messages/vibrato-message'
    import WaveformSelect from './WaveformSelect.svelte';

    export let node: AudioWorkletNode | null = null;

    let message: VibratoMessage = {
        active: false,
        waveform: Waveforms.Sine,
        frequency: 0,
        depth: 0
    }

    $: if (node) {
		node.port.postMessage(message);
	}
</script>

<div class="processor-container">
 <span class=processor-label>Vibrato</span>
 <div>
    <span>Active</span>
    <input type="checkbox" bind:checked={message.active}/>
 </div>
 <WaveformSelect bind:value={message.waveform!}/>
 <div>
    <span>Frequency</span>
    <input type="range" min="0" max="20" bind:value={message.frequency}/>
    <span>{message.frequency}Hz</span>
 </div>
 <div>
    <span>Depth</span>
    <input type="range" min="0" max="5" step="0.01" bind:value={message.depth}/>
    <span>{message.depth}ms</span>
 </div>
</div>