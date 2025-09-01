<script setup lang="ts">
const { qris: selectedQris } = useQris();

defineOgImageComponent("NuxtSeo", {
  theme: "#ff0000",
  colorMode: "dark",
});

useSeoMeta({
  title: "Ubah QRIS Statis Jadi Dinamis",
  ogTitle: "Ubah QRIS Statis Jadi Dinamis",
  twitterTitle: "Ubah QRIS Statis Jadi Dinamis",
  description:
    "Percepat transaksi, nominal langsung terisi otomatis tanpa input manual",
  ogDescription:
    "Percepat transaksi, nominal langsung terisi otomatis tanpa input manual",
  twitterDescription:
    "Percepat transaksi, nominal langsung terisi otomatis tanpa input manual",
});
useHead({
  htmlAttrs: {
    lang: "id",
  },
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="py-10 flex flex-col justify-center">
      <h1 class="font-light text-4xl md:text-5xl text-highlighted">
        QRIS Converter
      </h1>
      <p class="text-xl md:text-2xl text-toned mt-6 md:max-w-xl">
        Percepat Transaksi Tanpa Mengisi Nominal Pada QRIS Statis Merchant
      </p>
    </div>

    <QrisReader id="scan-qris" class="scroll-mt-8" />

    <section v-if="selectedQris">
      <h2 class="sr-only">Detail QRIS</h2>
      <div
        id="qris-detail"
        class="grid grid-cols-1 md:grid-cols-[1fr_288px] gap-8 scroll-mt-8"
      >
        <QrisDetail />

        <QrisImage :code="selectedQris?.serialize()" />
      </div>
    </section>

    <LazySavedQris />

    <LazyApiSection />

    <LazyFaqSection hydrate-on-visible />
  </div>
</template>
