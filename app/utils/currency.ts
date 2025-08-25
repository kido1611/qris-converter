export function currencyFormatter(value: number) {
  return Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
    currencySign: "standard",
    maximumFractionDigits: 0,
  }).format(value);
}
