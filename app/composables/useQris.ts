export function useQris() {
  const qris = useState<Qris | undefined>("selected-qris", () => undefined);

  const { saveQris } = useSavedQris();

  function setQris(code: string) {
    qris.value = new Qris(code);
  }

  function setTransactionAmount(amount: number) {
    if (qris.value) {
      qris.value.setTransactionAmount(amount);
      saveQris(qris.value);
    }
  }

  return {
    qris: readonly(qris),

    setQris,
    setTransactionAmount,
  };
}
