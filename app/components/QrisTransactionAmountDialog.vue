<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  UpdateTransactionAmountSchema,
  type UpdateTransactionAmountType,
} from "~~/shared/types/qris";

const { amount = 0 } = defineProps<{ amount?: number }>();
const emit = defineEmits<{
  submit: [amount: number];
}>();

const inputAmountRef = useTemplateRef("input-amount");
onStartTyping(() => {
  if (
    isVisible.value &&
    inputAmountRef.value?.inputRef !== document.activeElement
  ) {
    inputAmountRef.value?.inputRef?.focus();
  }
});

const isVisible = ref(false);
const state = reactive<Partial<UpdateTransactionAmountType>>({
  amount: 0,
});

function onSubmit(event: FormSubmitEvent<UpdateTransactionAmountType>) {
  if (event.data.amount === "") {
    emit("submit", 0);
  } else {
    emit("submit", event.data.amount);
  }

  isVisible.value = false;
}

watch(isVisible, async (newValue) => {
  if (newValue) {
    state.amount = amount ?? 0;

    await nextTick();

    inputAmountRef.value?.inputRef?.focus();
  }
});
</script>

<template>
  <UModal v-model:open="isVisible" title="Nominal Transaksi">
    <UButton
      class="-mr-2"
      icon="i-tabler-pencil"
      square
      color="neutral"
      variant="ghost"
      type="button"
    />

    <template #body>
      <UForm
        :schema="UpdateTransactionAmountSchema"
        :state
        class="flex flex-col gap-y-5"
        @submit.prevent="onSubmit"
      >
        <UFormField
          label="Nominal"
          name="amount"
          help="Kosongi atau isi dengan nol (0) untuk menghapus nominal transaksi."
        >
          <UInput
            ref="input-amount"
            v-model="state.amount"
            type="number"
            name="amount"
            :min="0"
          />
        </UFormField>

        <UButton type="submit" class="self-end" icon="i-tabler-check"
          >Simpan</UButton
        >
      </UForm>
    </template>
  </UModal>
</template>
