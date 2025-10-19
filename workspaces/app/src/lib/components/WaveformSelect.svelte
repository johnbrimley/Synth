<script lang="ts">
  import { Waveforms } from "@common/enums/waveforms";
  export let value: Waveforms;
  const options = Object.values(Waveforms);
</script>

<label>
  <span>Waveform</span>
  <select bind:value>
    {#each options as wave}
      <option value={wave}>{wave}</option>
    {/each}
  </select>
</label>
