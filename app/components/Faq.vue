<script setup lang="ts">
import type { AccordionItem } from "#ui/types";

const items: AccordionItem[] = [
  {
    label: "Bagaimana cara menggunakannya?",
    content:
      "Caranya cukup mudah, scan/unggah gambar QRIS anda, lalu ubah nominal transaksi untuk membuat QRIS menjadi dinamis.",
  },
  {
    label: "Apakah aplikasi ini gratis?",
    content: "Iya, aplikasi ini gratis.",
  },
  {
    label: "Apakah aplikasi ini open-source?",
    content: "Iya, aplikasi ini bersifat open-source.",
  },
  {
    label: "Apakah aplikasi ini menyimpan data di server?",
    content:
      "Tidak, aplikasi ini tidak menyimpan data apapun di server. Semua data QRIS hasil scan disimpan di perangkat yang anda gunakan.",
  },
  {
    label:
      "Saya ingin mengintegrasikan gambar QRIS ini di aplikasi kita. Apakah bisa?",
    content:
      "Untuk saat ini masih belum bisa. REST API untuk membuat gambar masih dalam tahap pengembangan.",
  },
];
</script>

<template>
  <CardSection title="FAQ">
    <UAccordion
      :items
      type="multiple"
      :ui="{ label: 'font-semibold text-highlighted' }"
    />
  </CardSection>
</template>
