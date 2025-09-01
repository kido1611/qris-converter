<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{
  submit: [code: string];
}>();
const state = reactive<Partial<CreateType>>({
  code: "",
});

function onSubmit(event: FormSubmitEvent<CreateType>) {
  emit("submit", event.data.code);
}
</script>

<template>
  <UForm :schema="CreateSchema" :state @submit.prevent="onSubmit">
    <UFormField label="Kode QRIS" required name="code">
      <UInput v-model="state.code" type="text" required name="code" />
    </UFormField>

    <UButton type="submit">Cek</UButton>
  </UForm>
</template>
