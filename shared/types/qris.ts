import * as v from "valibot";
import { Qris } from "../utils/qris";

const QrisSchema = v.custom<`${string}`>((input) => {
  if (typeof input !== "string") {
    return false;
  }

  const result = Qris.parseAndValidate(input);
  return result.isValid;
}, "Bukan kode QRIS.");

export const CreateSchema = v.object({
  code: v.pipe(
    v.string("Harus string."),
    v.nonEmpty("Harus diisi."),
    QrisSchema,
  ),
});
export type CreateType = v.InferOutput<typeof CreateSchema>;

export const UpdateTransactionAmountSchema = v.object({
  amount: v.union([
    v.pipe(v.number("Harus angka."), v.minValue(0, "Minimal 0.")),
    v.literal(""),
  ]),
});
export type UpdateTransactionAmountType = v.InferOutput<
  typeof UpdateTransactionAmountSchema
>;
