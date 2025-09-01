<script setup lang="ts">
const { code } = defineProps<{
  code?: string;
}>();

const isLoading = ref<boolean>(false);
const qrisImage = shallowRef("");

function download() {
  if (!qrisImage.value) {
    return;
  }

  const a = document.createElement("a");
  a.href = qrisImage.value;
  a.download = "qris.png";
  a.click();
}

watch(
  () => code,
  async (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      loadQris(newValue);
    }
  },
);

async function loadQris(code: string) {
  if (!qrisImage.value) {
    isLoading.value = true;
  }

  qrisImage.value = await generateQrisImage(code);

  if (isLoading.value) {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (code) {
    await loadQris(code);
  }
});
</script>

<template>
  <UCard variant="subtle">
    <div class="flex flex-col">
      <USkeleton v-if="isLoading" class="aspect-5/8" />
      <div v-else class="flex justify-center aspect-5/8">
        <img
          alt="QRIS image"
          v-if="code"
          :src="qrisImage"
          class="w-60 min-h-60 rounded-lg"
        />
      </div>

      <UButton
        icon="tabler:download"
        size="lg"
        class="mt-4 mx-auto"
        @click.prevent="download"
        >Unduh</UButton
      >
    </div>
  </UCard>
</template>
