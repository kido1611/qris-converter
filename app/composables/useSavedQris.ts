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
    let selectedKey = undefined;
    for (const [key, value] of Object.entries(savedQrisList.value)) {
      if (value.code === code) {
        selectedKey = key;
        break;
      }
    }

    if (selectedKey) {
      delete savedQrisList.value[selectedKey];
    }
  }

  return {
    savedQrisList,

    saveQris,
    removeQris,
  };
}
