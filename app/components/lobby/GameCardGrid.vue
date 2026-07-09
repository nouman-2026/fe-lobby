<script setup lang="ts">
import { filterGamesByCategory } from "~/data/games";

const props = defineProps<{
  layoutMode: "grid" | "list";
  category: string;
}>();

const emit = defineEmits<{
  select: [gameId: string];
}>();

const filteredGames = computed(() =>
  filterGamesByCategory(props.category as "all" | "new" | "slots" | "crash"),
);

const gridClass = computed(() =>
  props.layoutMode === "grid"
    ? "grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    : "flex flex-col gap-2",
);

function thumbnailFormat(url: string) {
  return url.endsWith(".gif") ? "gif" : "webp";
}

function launch(gameId: string) {
  emit("select", gameId);
}
</script>

<template>
  <div :class="gridClass">
    <button
      v-for="game in filteredGames"
      :key="game.id"
      type="button"
      class="group relative overflow-hidden rounded-lg border border-slate-800 bg-zinc-900 text-left transition hover:border-slate-600 hover:shadow-lg hover:shadow-black/40 sm:rounded-xl"
      :class="
        layoutMode === 'list'
          ? 'flex items-center gap-3 p-2 sm:gap-4 sm:p-3'
          : 'aspect-[4/3]'
      "
      @click="launch(game.id)"
    >
      <template v-if="layoutMode === 'list'">
        <div
          class="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28"
        >
          <NuxtImg
            preset="gameCard"
            :src="game.thumbnail"
            :alt="game.title"
            :format="thumbnailFormat(game.thumbnail)"
            width="112"
            height="80"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-bold text-white sm:text-base">
            {{ game.title }}
          </h3>
          <p class="text-xs capitalize text-zinc-400">{{ game.category }}</p>
        </div>

        <span
          v-if="game.isNew"
          class="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400"
        >
          New
        </span>
      </template>

      <template v-else>
        <NuxtImg
          preset="gameCard"
          :src="game.thumbnail"
          :alt="game.title"
          :format="thumbnailFormat(game.thumbnail)"
          class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />

        <div class="relative flex h-full flex-col justify-end p-3 sm:p-4">
          <span
            v-if="game.isNew"
            class="mb-auto inline-flex w-fit rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400"
          >
            New
          </span>

          <h3 class="text-xs font-bold text-white sm:text-sm md:text-base">
            {{ game.title }}
          </h3>
          <p class="text-[10px] capitalize text-white/70 sm:text-xs">
            {{ game.provider }}
          </p>
        </div>
      </template>
    </button>
  </div>
</template>
