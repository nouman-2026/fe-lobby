<script setup lang="ts">
import { setIframeAudioMuted } from '~/utils/iframeAudio'

const props = defineProps<{
  src: string
  title: string
  /** When false, mute same-origin iframe audio; when true, unmute. */
  sessionVisible?: boolean
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)

function syncSession() {
  if (props.sessionVisible == null) return

  const frame = iframeRef.value
  const visible = props.sessionVisible

  // Same-origin: mute/unmute audio inside the iframe (no game code changes).
  setIframeAudioMuted(frame, !visible)

  // Optional signal for game-ui microfrontend if it wants richer pause handling.
  try {
    frame?.contentWindow?.postMessage(
      { type: 'NINJA_LOBBY_VISIBILITY', visible },
      '*'
    )
  } catch {
    // ignore
  }
}

watch(
  () => props.sessionVisible,
  () => {
    syncSession()
  }
)

function onLoad() {
  syncSession()
}
</script>

<template>
  <iframe
    ref="iframeRef"
    :src="src"
    :title="title"
    class="h-full w-full min-h-0 border-0 bg-black"
    allow="fullscreen"
    @load="onLoad"
  />
</template>
