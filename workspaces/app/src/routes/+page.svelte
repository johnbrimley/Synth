<script lang="ts">
    import WaveformSelect from "$lib/components/WaveformSelect.svelte";
    import { Waveform } from "$lib/common/enums/waveforms";
    import { Processors } from "$lib/common/enums/processors";
    import { onMount } from "svelte";
    import ToneControl from "$lib/components/ToneControl.svelte";
    import { error } from "@sveltejs/kit";
    import Keyboard from "$lib/components/Keyboard.svelte";

    let audioContext: AudioContext | null = null;
    let toneNode: AudioWorkletNode | null = null;

    onMount(async () => {
        audioContext = new AudioContext();
        const nodes = new Map<Processors, AudioWorkletNode>();
        for (const processor of Object.values(Processors)) {
            const processorPath = `processors/${processor}-processor.js`;
            await audioContext.audioWorklet.addModule(processorPath);
            const node = new AudioWorkletNode(
                audioContext,
                `${processor}-processor`,
            );
            nodes.set(processor, node);
        }

        toneNode =
            nodes.get(Processors.Tone) ??
            error(500, { message: "toneNode was undefined" });

        toneNode
        .connect(nodes.get(Processors.Tanh)!)
        .connect(audioContext.destination);
    });
</script>

<style>
    .control-container {
        display: flex;
        flex-direction: row;
    }
</style>

<div class="control-container">
    <ToneControl bind:node={toneNode} />
</div>
<Keyboard bind:node={toneNode} />