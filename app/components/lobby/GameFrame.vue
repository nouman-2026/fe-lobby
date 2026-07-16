<script setup lang="ts">
import { setIframeAudioMuted } from '~/utils/iframeAudio'

const props = defineProps<{
  src: string
  title: string
  /** When false, mute same-origin iframe audio; when true, unmute. */
  sessionVisible?: boolean
}>()

const emit = defineEmits<{
  loadError: []
}>()

const IFRAME_LOAD_TIMEOUT_MS = 15_000
const REACHABILITY_TIMEOUT_MS = 10_000

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeLoading = ref(true)

let loadWatchdog: ReturnType<typeof setTimeout> | null = null
let probeToken = 0

function clearLoadWatchdog() {
  if (loadWatchdog != null) {
    clearTimeout(loadWatchdog)
    loadWatchdog = null
  }
}

function failLoad() {
  clearLoadWatchdog()
  iframeLoading.value = false
  emit('loadError')
}

/** Detect "This site can’t be reached" before / while the iframe navigates. */
async function isLaunchUrlReachable(url: string): Promise<boolean> {
  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(REACHABILITY_TIMEOUT_MS),
    })
    return true
  } catch {
    return false
  }
}

function startLoadWatchdog() {
  clearLoadWatchdog()
  loadWatchdog = setTimeout(() => {
    if (iframeLoading.value) {
      failLoad()
    }
  }, IFRAME_LOAD_TIMEOUT_MS)
}

watch(
  () => props.src,
  async (src) => {
    const token = ++probeToken
    iframeLoading.value = true
    clearLoadWatchdog()

    if (!src) {
      failLoad()
      return
    }

    const reachable = await isLaunchUrlReachable(src)
    if (token !== probeToken) return

    if (!reachable) {
      failLoad()
      return
    }

    startLoadWatchdog()
  },
  { immediate: true }
)

function syncSession() {
  if (props.sessionVisible == null) return

  const frame = iframeRef.value
  const visible = props.sessionVisible

  setIframeAudioMuted(frame, !visible)

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
  clearLoadWatchdog()
  syncSession()
}

onBeforeUnmount(() => {
  probeToken += 1
  clearLoadWatchdog()
})
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
