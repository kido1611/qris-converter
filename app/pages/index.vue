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
      <!-- <UButton -->
      <!--   to="#scan-qris" -->
      <!--   type="button" -->
      <!--   variant="soft" -->
      <!--   size="xl" -->
      <!--   icon="tabler:search" -->
      <!--   class="self-start mt-12" -->
      <!--   >Scan Sekarang</UButton -->
      <!-- > -->
    </div>
    <!-- <template v-if="!selectedQris"> -->
    <!--   <section class="min-h-[60vh] flex flex-col"> -->
    <!--     <div class="relative py-2 mb-4"> -->
    <!--       <h2 class="font-semibold text-2xl text-highlighted">Fitur</h2> -->
    <!---->
    <!--       <span -->
    <!--         class="absolute bottom-0 left-0 w-[calc(100%+8px)] h-0.25 bg-inverted" -->
    <!--       ></span> -->
    <!---->
    <!--       <span -->
    <!--         class="absolute right-0 top-1/5 h-[calc(80%+8px)] w-0.25 bg-inverted" -->
    <!--       ></span> -->
    <!--     </div> -->
    <!--     <div> -->
    <!--       <div> -->
    <!--         <p>Instan</p> -->
    <!--         <p>Kode QRIS langsung keluar</p> -->
    <!--       </div> -->
    <!--       <div> -->
    <!--         <p>Gratis</p> -->
    <!--         <p> -->
    <!--           Tidak ada biaya yang diperlukan untuk menambahkan nominal -->
    <!--           transaksi pada QRIS -->
    <!--         </p> -->
    <!--       </div> -->
    <!--       <div> -->
    <!--         <p>Aman</p> -->
    <!--         <p>QRIS yang di-scan hanya tersimpan diperangkat anda sendiri</p> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--   </section> -->
    <!---->
    <!-- </template> -->
    <!-- <section> -->
    <!--   <h2>Cara Menggunakan</h2> -->
    <!--   <div> -->
    <!--     <p>Unggah/scan gambar QRIS</p> -->
    <!--     <p>Ubah nominal transaksi</p> -->
    <!--     <p>Simpan gambar/tunjukkan ke customer</p> -->
    <!--   </div> -->
    <!-- </section> -->

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

    <LazyFaq hydrate-on-visible />
  </div>
</template>
