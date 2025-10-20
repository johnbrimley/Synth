<script lang="ts">
    import { Processors } from "@common/enums/processors";
    import { onMount } from "svelte";
    import ToneControl from "$lib/components/ToneControl.svelte";
    import { error } from "@sveltejs/kit";
    import Keyboard from "$lib/components/Keyboard.svelte";
    import TremoloControl from "$lib/components/TremoloControl.svelte";
    import ContextStatusControl from "$lib/components/ContextStatusControl.svelte";
    import VibratoControl from "$lib/components/VibratoControl.svelte";

    let audioContext: AudioContext | null = null;
    let toneNode: AudioWorkletNode | null = null;
    let tremoloNode: AudioWorkletNode | null = null;
    let vibratoNode: AudioWorkletNode | null = null;

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

        vibratoNode =
            nodes.get(Processors.Vibrato) ??
            error(500, { message: "vibratoNode was undefined" });

        toneNode
            .connect(tremoloNode)
            .connect(vibratoNode)
            .connect(nodes.get(Processors.Tanh)!)
            .connect(audioContext.destination);
    });
</script>

<div class="controls-container">
    <ContextStatusControl bind:context={audioContext} />
    <ToneControl bind:node={toneNode} />
    <TremoloControl bind:node={tremoloNode} />
    <VibratoControl bind:node={vibratoNode}/>
</div>
<Keyboard bind:node={toneNode} />

<style>
    .controls-container {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }
</style>
