<script lang="ts">
    import type { ToneMessage } from "@common/messages/tone-message";
    import { onMount } from "svelte";

    export let node: AudioWorkletNode | null = null;

    const noteMap: Record<string, number> = {
        a: 261.63, // C4
        w: 277.18, // C#4 / Db4
        s: 293.66, // D4
        e: 311.13, // D#4 / Eb4
        d: 329.63, // E4
        f: 349.23, // F4
        t: 369.99, // F#4 / Gb4
        g: 392.0, // G4
        y: 415.3, // G#4 / Ab4
        h: 440.0, // A4
        u: 466.16, // A#4 / Bb4
        j: 493.88, // B4
        k: 523.25, // B4
    };

    onMount(() => {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.repeat) return;
            const addFrequency = noteMap[event.key];
            const message: ToneMessage = { addFrequency };
            if (addFrequency && node) {
                node.port.postMessage(message);
            }
        });

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            const removeFrequency = noteMap[event.key];
            const message: ToneMessage = { removeFrequency };
            if (removeFrequency && node) {
                node.port.postMessage(message);
            }
        });
    });
</script>
