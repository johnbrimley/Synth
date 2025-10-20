<script lang="ts">
    import { onMount } from "svelte";

    export let context: AudioContext | null = null;
    let state: string = "Not Connected";
    $: if (context) {
        context.onstatechange = () => {
            state= context.state;
            console.log("changed");
        }
        state = context.state;
    }
</script>

<div class="processor-container">
    <span class="processor-label">Context</span>
    <div>
        <span>State: </span>
        <span>{state}</span>
    </div>
    <input type="button" on:click={async () => await context?.resume()} value="Resume"/>
    <input type="button" on:click={async () => await context?.suspend()} value="Suspend"/>
</div>
