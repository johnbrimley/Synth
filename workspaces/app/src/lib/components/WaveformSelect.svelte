<script lang="ts">
  import { Waveform } from "$lib/common/enums/waveforms";
  export let value: Waveform;
  const options = Object.values(Waveform);
</script>

<label>
  <span>Waveform</span>
  <select bind:value>
    {#each options as wave}
      <option value={wave}>{wave}</option>
    {/each}
  </select>
</label>
