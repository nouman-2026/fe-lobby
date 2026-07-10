<script setup lang="ts">
defineProps<{
  variant?: 'card' | 'pill'
}>()

const walletBalance = '₺ 38,763.30'
</script>

<template>
  <div
    v-if="variant === 'pill'"
    class="wallet-pill relative flex shrink-0 items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-amber-400/15 to-zinc-900 px-1.5 py-1 ring-1 ring-amber-400/25"
  >
    <span
      class="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-transparent"
    />
    <span
      class="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm shadow-amber-400/30"
    >
      <Icon name="mdi:wallet" size="12" class="text-black" />
    </span>
    <span
      class="relative whitespace-nowrap font-mono text-[10px] font-bold leading-none tabular-nums text-amber-50"
    >
      {{ walletBalance }}
    </span>
  </div>

  <div
    v-else
    class="wallet-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/20 via-zinc-900 to-zinc-900 p-px shadow-lg shadow-amber-400/10"
  >
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 px-4 py-3.5"
    >
      <div
        class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-400/15 blur-2xl"
      />
      <div
        class="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full bg-amber-500/10 blur-2xl"
      />

      <p
        class="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/90"
      >
        Wallet Balance
      </p>

      <div class="relative mt-1.5 flex items-center gap-2">
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 shadow-md shadow-amber-400/30"
        >
          <Icon name="mdi:wallet" size="14" class="text-black" />
        </span>
        <span
          class="whitespace-nowrap bg-gradient-to-r from-white to-amber-100 bg-clip-text font-mono text-sm font-bold tabular-nums text-transparent"
        >
          {{ walletBalance }}
        </span>
      </div>
    </div>
  </div>
</template>
