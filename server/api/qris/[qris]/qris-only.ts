import type { H3Event } from "h3";
import * as v from "valibot";
import QrCode from "qrcode";
import { createCanvas } from "canvas";

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

  const qrisImageSource = await QrCode.toDataURL(qris.serialize(), {
    width: 512,
    // errorCorrectionLevel: "high",
    margin: 4,
  });

  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");

  const qrisImage = await createImage(qrisImageSource);
  ctx.drawImage(qrisImage, 0, 0);

  return canvas.createPNGStream();
});
