<script setup lang="ts">
const { code } = defineProps<{
  code?: string;
}>();

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

watchEffect(async () => {
  if (code) {
    qrisImage.value = await generateQrisImage(code);
  }
});
</script>

<template>
  <UCard variant="subtle">
    <div class="flex flex-col">
      <div class="flex justify-center">
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
