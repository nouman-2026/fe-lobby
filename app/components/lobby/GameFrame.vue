<script setup lang="ts">
import { setIframeAudioMuted } from '~/utils/iframeAudio'

const props = defineProps<{
  src: string
  title: string
  /** When false, mute same-origin iframe audio; when true, unmute. */
  sessionVisible?: boolean
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeLoading = ref(true)

watch(
  () => props.src,
  () => {
    iframeLoading.value = true
  }
)

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
  iframeLoading.value = false
  syncSession()
}
</script>

<template>
  <div class="relative h-full w-full min-h-0">
    <iframe
      ref="iframeRef"
      :src="src"
      :title="title"
      class="h-full w-full min-h-0 border-0 bg-black"
      allow="fullscreen"
      @load="onLoad"
    />

    <Transition name="game-frame-loader">
      <div
        v-if="iframeLoading"
        class="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black"
        role="status"
        aria-live="polite"
        aria-label="Preparing game"
      >
        <Icon
          name="mdi:loading"
          size="48"
          class="animate-spin text-amber-400"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-frame-loader-leave-active {
  transition: opacity 0.35s ease;
}

.game-frame-loader-leave-to {
  opacity: 0;
}
</style>
