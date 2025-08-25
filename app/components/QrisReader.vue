<script setup lang="ts">
const { setQris } = useQris();
const { saveQris } = useSavedQris();

async function onSubmitScanner(code: string) {
  setQris(code);

  const qris = new Qris(code);

  saveQris(qris);

  await nextTick();

  document.querySelector("#qris-detail")?.scrollIntoView({
    behavior: "smooth",
  });
}
</script>

<template>
  <CardSection title="Scan QRIS">
    <!-- <QrisInput @submit="onSubmitScanner" /> -->

    <div class="flex flex-col sm:flex-row gap-4">
      <LazyQrisUpload hydrate-on-idle @submit="onSubmitScanner" />
      <span
        class="w-48 text-center self-start sm:self-center text-muted text-sm sm:w-auto"
        >atau</span
      >
      <LazyQrisCamera @success="onSubmitScanner" />
    </div>
  </CardSection>
</template>
