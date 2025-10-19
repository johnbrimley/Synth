<script lang="ts">
    import { Processors } from "@common/enums/processors";
    import { onMount } from "svelte";
    import ToneControl from "$lib/components/ToneControl.svelte";
    import { error } from "@sveltejs/kit";
    import Keyboard from "$lib/components/Keyboard.svelte";
    import TremoloControl from "$lib/components/TremoloControl.svelte";

    let audioContext: AudioContext | null = null;
    let toneNode: AudioWorkletNode | null = null;
    let tremoloNode: AudioWorkletNode | null = null;

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

        tremoloNode =
            nodes.get(Processors.Tremolo) ??
            error(500, { message: "tremoloNode was undefined" });

        toneNode
            .connect(tremoloNode)
            .connect(nodes.get(Processors.Tanh)!)
            .connect(audioContext.destination);
    });
</script>

<div class="controls-container">
    <ToneControl bind:node={toneNode} />
    <TremoloControl bind:node={tremoloNode} />
</div>
<Keyboard bind:node={toneNode} />

<style>
    .controls-container {
        display: flex;
        flex-direction: row;
    }
</style>
