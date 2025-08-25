<script setup lang="ts">
const { qris, setTransactionAmount } = useQris();

const [DefineLabelValueTemplate, ReuseLabelValueTemplate] =
  createReusableTemplate<{
    label: string;
    value: string;
    valueClass?: string;
  }>();

function updateTransaction(amount: number) {
  if (qris.value) {
    setTransactionAmount(amount);
  }
}
</script>

<template>
  <DefineLabelValueTemplate v-slot="{ $slots, label, value, valueClass }">
    <div class="flex flex-col">
      <p class="text-sm text-toned">{{ label }}</p>
      <div class="min-h-8 flex flex-row justify-between items-center gap-x-4">
        <p class="text-lg text-highlighted" :class="valueClass">
          {{ value }}
        </p>
        <div v-if="$slots.default" class="flex-none">
          <component :is="$slots.default" />
        </div>
      </div>
    </div>
  </DefineLabelValueTemplate>

  <UCard v-if="qris" variant="subtle">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-col">
        <div class="mb-4">
          <UBadge
            size="md"
            :color="qris.getType() === 'STATIC' ? 'error' : 'secondary'"
            variant="soft"
            >{{ qris.getType() === "STATIC" ? "Statis" : "Dinamis" }}</UBadge
          >
        </div>
        <p class="text-2xl font-semibold text-highlighted">
          {{ qris.getMerchantName() }}
        </p>
        <p class="">{{ qris.getMerchantCity() }}</p>
      </div>

      <ReuseLabelValueTemplate
        label="Penerbit"
        :value="qris.getIssuer() ?? '-'"
      />
      <ReuseLabelValueTemplate
        label="NMID"
        :value="qris.getNationalMerchantId() ?? '-'"
      />

      <ReuseLabelValueTemplate
        label="Nominal Transaksi"
        :value="currencyFormatter(qris.getTransactionAmount() ?? 0)"
      >
        <template #default>
          <QrisTransactionAmountDialog
            :amount="qris.getTransactionAmount()"
            @submit="updateTransaction"
          />
        </template>
      </ReuseLabelValueTemplate>

      <ReuseLabelValueTemplate
        label="Tip"
        value="Dimatikan, tidak semua penerbit dan pemegang rekening bisa menggunakan tip."
        value-class="text-muted text-sm italic"
      />
    </div>
  </UCard>
</template>
