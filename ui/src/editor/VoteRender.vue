<script lang="ts" setup>
import type { VoteBlock } from '@kunkunyu/vote';

const props = withDefaults(
  defineProps<{
    id: string;
  }>(),
  {
  }
);

</script>

<template>
  <div class="pointer-events-none select-none">
    <vote-block :id="id"></vote-block>
  </div>
</template>
