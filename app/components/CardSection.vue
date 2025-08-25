<script setup lang="ts">
const { title } = defineProps<{
  title: string;
}>();
</script>

<template>
  <UCard variant="subtle" as="section">
    <div class="mb-4 sm:mb-6">
      <h2 class="text-highlighted text-lg font-semibold">
        {{ title }}
      </h2>
    </div>

    <slot />
  </UCard>
</template>
