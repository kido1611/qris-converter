<script setup lang="ts">
import * as v from "valibot";
import {
  QrcodeStream,
  type DetectedBarcode,
  type EmittedError,
} from "vue-qrcode-reader";

const emit = defineEmits<{
  success: [code: string];
}>();

const toast = useToast();

const isVisible = ref<boolean>(false);
const error = ref<string>("");
const selectedConstraints = ref<MediaTrackConstraints>({
  facingMode: "environment",
});

function onError(err: EmittedError) {
  error.value = `[${err.name}]: `;

  if (err.name === "NotAllowedError") {
    error.value += "perlu dijinkan untuk menggunakan kamera";
  } else if (err.name === "NotFoundError") {
    error.value += "tidak ada kamera diperangkat ini";
  } else if (err.name === "NotSupportedError") {
    error.value += "secure context required (HTTPS, localhost)";
  } else if (err.name === "NotReadableError") {
    error.value += "apakah kamera sedang digunakan aplikasi lain?";
  } else if (err.name === "OverconstrainedError") {
    error.value += "kamera yang terpasang tidak bisa digunakan";
  } else if (err.name === "StreamApiNotSupportedError") {
    error.value += "Stream API tidak bisa digunakan dibrowser ini";
  } else if (err.name === "InsecureContextError") {
    error.value +=
      "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
  } else {
    error.value += err.message;
  }
}

async function onCameraReady() {
  error.value = "";
}

function onDetect(detectedCodes: DetectedBarcode[]) {
  if (detectedCodes.length > 0) {
    const result = v.safeParse(CreateSchema, {
      code: detectedCodes[0]?.rawValue,
    });

    if (result.success) {
      emit("success", result.output.code);

      isVisible.value = false;
    } else {
      toast.add({
        color: "error",
        title: "Invalid",
        description: "Kode QRIS tidak ditemukan.",
      });
    }
  }
}

watch(isVisible, (newValue) => {
  if (!newValue) {
    error.value = "";
  }
});
</script>

<template>
  <UModal v-model:open="isVisible" title="Kamera">
    <UButton
      type="button"
      variant="subtle"
      icon="tabler:camera"
      class="self-start sm:self-center w-48 justify-center sm:w-auto"
      >Gunakan Kamera</UButton
    >

    <template #body>
      <div v-if="error" class="text-error text-sm">
        {{ error }}
      </div>
      <QrcodeStream
        v-if="isVisible"
        @error="onError"
        :constraints="selectedConstraints"
        :formats="['qr_code']"
        @detect="onDetect"
        @camera-on="onCameraReady"
      />
    </template>
  </UModal>
</template>
