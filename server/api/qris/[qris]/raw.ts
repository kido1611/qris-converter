import type { H3Event } from "h3";
import * as v from "valibot";

export default defineEventHandler(async (event: H3Event) => {
  const result = await getValidatedRouterParams(event, (parameters) =>
    v.safeParse(QrisRouteParameterSchema, parameters),
  );

  if (!result.success) {
    setResponseStatus(event, 422);
    return {
      error: true,
      message: "Encoded QRIS/kode QRIS salah.",
    };
  }

  const queries = getQuery(event);
  const validatedResultQueries = v.safeParse(
    UpdateTransactionAmountServerSchema,
    queries,
  );
  if (!validatedResultQueries.success) {
    setResponseStatus(event, 422);
    return {
      message: "Kueri `transaction-amount` salah atau belum diisi.",
    };
  }

  const transactionAmount = validatedResultQueries.output["transaction-amount"];
  const qris = new Qris(result.output.qris);
  qris.setTransactionAmount(transactionAmount);

  return {
    merchant_name: qris.getMerchantName(),
    merchant_city: qris.getMerchantCity(),
    nmid: qris.getNationalMerchantId(),
    transaction_amount: qris.getTransactionAmount(),
    code: qris.serialize(),
  };
});
