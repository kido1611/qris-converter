<script setup lang="ts">
import { BarcodeDetector, prepareZXingModule } from "barcode-detector/ponyfill";
import * as v from "valibot";
import zxingWasmUrl from "zxing-wasm/reader/zxing_reader.wasm?url";

const emit = defineEmits<{
  submit: [code: string];
}>();

const toast = useToast();

const inputFile = ref<File>();

let barcodeDetector: BarcodeDetector | undefined = undefined;

watch(inputFile, async (newFile) => {
  if (newFile && barcodeDetector) {
    const qrResult = await barcodeDetector.detect(newFile);
    if (qrResult.length > 0) {
      const code = qrResult[0]?.rawValue ?? "";

      const parseResult = v.safeParse(CreateSchema, {
        code,
      });

      if (parseResult.success) {
        emit("submit", qrResult[0]?.rawValue ?? "");
      } else {
        toast.add({
          color: "error",
          title: "Invalid",
          description: "Kode QRIS tidak ditemukan.",
        });
      }
    } else {
      toast.add({
        color: "error",
        title: "Invalid",
        description: "Kode QR tidak ditemukan.",
      });
    }
  }
});

onMounted(() => {
  prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) => {
        if (path.endsWith(".wasm")) {
          return zxingWasmUrl;
        }
        return prefix + path;
      },
    },
  });
  barcodeDetector = new BarcodeDetector({
    formats: ["qr_code"],
  });
});
</script>

<template>
  <div>
    <UFormField label="Pilih gambar QRIS">
      <UFileUpload v-model="inputFile" accept="image/*" class="size-48" />
    </UFormField>
  </div>
</template>
