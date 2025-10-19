<script lang="ts">
    import { Waveforms } from '@common/enums/waveforms';
    import type {TremoloMessage} from '@common/messages/tremolo-message'
    import WaveformSelect from './WaveformSelect.svelte';

    export let node: AudioWorkletNode | null = null;

    let waveform:Waveforms
    let frequency:number;
    let depth:number;
    let active: boolean;

    $: if (node) {
		const message: TremoloMessage = { active, waveform, frequency, depth };
		node.port.postMessage(message);
	}
</script>

<div class="processor-container">
 <span class=processor-label>Tremolo</span>
 <div>
    <span>Active</span>
    <input type="checkbox" bind:checked={active}/>
 </div>
 <WaveformSelect bind:value={waveform}/>
 <div>
    <span>Frequency</span>
    <input type="range" min="0" max="20" bind:value={frequency}/>
    <span>{frequency}</span>
 </div>
 <div>
    <span>Depth</span>
    <input type="range" min="0" max="1" step="0.01" bind:value={depth}/>
    <span>{depth}</span>
 </div>
</div>