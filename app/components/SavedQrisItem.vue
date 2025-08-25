<script setup lang="ts">
import QrCode from "qrcode";

const { code } = defineProps<{
  code: string;
}>();

const { qris: selectedQris, setQris } = useQris();
const { removeQris } = useSavedQris();

const qris = shallowRef<Qris>();
const qrisImage = shallowRef<string>();

async function changeQris() {
  setQris(code);

  await nextTick();

  document.querySelector("#qris-detail")?.scrollIntoView({
    behavior: "smooth",
  });
}

watch(
  () => code,
  async function (newValue) {
    await updateQris(newValue);
  },
);

async function updateQris(code: string) {
  try {
    qris.value = new Qris(code);

    qrisImage.value = await QrCode.toDataURL(code, {
      width: 512,
      margin: 4,
    });
  } catch (error: any) {
    removeQris(code);
  }
}

onMounted(async () => {
  await updateQris(code);
});
</script>

<template>
  <div class="ring ring-default p-4 rounded-md bg-elevated shadow-sm">
    <div v-if="qris">
      <div class="flex flex-row space-x-3">
        <img
          alt="QRIS image"
          :src="qrisImage"
          class="size-18 lg:size-24 rounded-lg flex-none"
        />
        <div class="flex flex-col w-full">
          <p class="text-highlighted font-medium">
            {{ qris.getMerchantName() }}
          </p>
          <p class="text-sm text-muted mt-1">
            NMID: {{ qris.getNationalMerchantId() }}
          </p>

          <UButton
            @click="changeQris"
            class="mt-3 self-start"
            icon="tabler:replace"
            size="lg"
            variant="subtle"
            :color="
              selectedQris?.getNationalMerchantId() ===
              qris.getNationalMerchantId()
                ? 'neutral'
                : 'primary'
            "
            :disabled="
              selectedQris?.getNationalMerchantId() ===
              qris.getNationalMerchantId()
            "
            >Pakai</UButton
          >
        </div>
      </div>
    </div>
    <div v-else>bukan kode qris</div>
  </div>
</template>
