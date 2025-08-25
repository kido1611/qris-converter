<script setup lang="ts">
const { savedQrisList } = useSavedQris();
</script>

<template>
  <CardSection title="Riwayat">
    <div
      v-if="Object.entries(savedQrisList).length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <SavedQrisItem
        v-for="(qris, key) in savedQrisList"
        :key
        :code="qris.code"
      />
    </div>
    <div v-else class="flex items-center justify-center h-64">
      <p class="text-muted text-lg italic">Belum ada QRIS yang di-scan.</p>
    </div>
  </CardSection>
</template>
