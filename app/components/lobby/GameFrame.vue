<script setup lang="ts">
defineProps<{
  src: string
  title: string
}>()
</script>

<template>
  <iframe
    :src="src"
    :title="title"
    class="h-full w-full min-h-0 border-0 bg-black"
    allow="fullscreen"
  />
</template>
