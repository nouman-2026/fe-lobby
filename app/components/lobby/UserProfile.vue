<script setup lang="ts">
import { getAvatarInitials, userProfile } from '~/data/profile'

defineProps<{
  compact?: boolean
}>()

const initials = computed(() => getAvatarInitials(userProfile.username))
</script>

<template>
  <div
    class="flex items-center"
    :class="
      compact
        ? 'gap-2'
        : 'gap-3 rounded-xl bg-zinc-900/60 px-3 py-2.5 ring-1 ring-zinc-800/80'
    "
  >
    <span
      class="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 font-bold uppercase text-black shadow-md shadow-amber-400/20"
      :class="compact ? 'h-8 w-8 text-[10px]' : 'h-9 w-9 text-xs'"
      aria-hidden="true"
    >
      {{ initials }}
    </span>

    <div class="min-w-0">
      <p
        class="truncate font-semibold text-white"
        :class="
          compact
            ? 'max-w-[6rem] text-xs sm:max-w-[8rem] sm:text-sm'
            : 'text-sm'
        "
      >
        {{ userProfile.username }}
      </p>
      <p v-if="!compact" class="text-[10px] text-zinc-500">Player</p>
    </div>
  </div>
</template>
