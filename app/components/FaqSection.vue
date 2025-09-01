<script setup lang="ts">
import type { AccordionItem } from "#ui/types";

const items: AccordionItem[] = [
  {
    label: "Bagaimana cara menggunakannya?",
    content:
      "Caranya cukup mudah, scan/unggah gambar QRIS anda, lalu ubah nominal transaksi untuk membuat QRIS menjadi dinamis. Gambar QRIS dinamis akan muncul beserta nama merchant dan nominal transaksi (jika nominal transaksi > 0).",
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
    content: "Bisa, cek bagian API untuk mengetahui cara aksesnya.",
  },
  {
    label:
      "Saya coba iseng mengubah nominal transaksi pada generated QRIS dinamis (contoh mengubah QRIS pada pembayaran e-commerce atau media sawer online). Apa yang akan terjadi?",
    content:
      "Saya belum pernah mencobanya. Menurut saya akan terjadi 2 hal: 1). Transaksi gagal; 2). Uang anda hilang.",
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
