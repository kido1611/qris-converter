import { useStorage } from "@vueuse/core";
import slugify from "slugify";

export function useSavedQris() {
  const savedQrisList = useStorage<{
    [key: string]: {
      merchantName: string;
      code: string;
    };
  }>("saved-qris", {});

  function saveQris(qris: Qris) {
    const qrisCode = qris.serialize();

    const merchantId =
      qris.getNationalMerchantId() ||
      slugify(qris.getMerchantName()).slice(0, 15);

    savedQrisList.value[merchantId] = {
      merchantName: qris.getMerchantName(),
      code: qrisCode,
    };
  }

  function removeQris(code: string) {
    const entries = Object.entries(savedQrisList.value);
    const updatedEntries = entries.filter(([, value]) => value.code !== code);
    savedQrisList.value = Object.fromEntries(updatedEntries);
  }

  return {
    savedQrisList,

    saveQris,
    removeQris,
  };
}
