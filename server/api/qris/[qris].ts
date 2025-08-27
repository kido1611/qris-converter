import { H3Event } from "h3";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  drawImage,
} from "@@/shared/utils/qris-image";
import * as v from "valibot";

import { createCanvas } from "canvas";
import { UpdateTransactionAmountServerSchema } from "~~/shared/types/qris";

export default defineEventHandler(async (event: H3Event) => {
  const rawPath = getRouterParam(event, "qris");
  if (!rawPath) {
    setResponseStatus(event, 404);
    return {
      message: "Invalid path",
    };
  }

  const qrisRaw = Buffer.from(rawPath, "base64").toString();
  const validateResultRouteParam = v.safeParse(CreateSchema, {
    code: qrisRaw,
  });

  if (!validateResultRouteParam.success) {
    setResponseStatus(event, 400);
    return {
      message: validateResultRouteParam.issues[0].message,
    };
  }

  const queries = getQuery(event);
  const validatedResultQueries = v.safeParse(
    UpdateTransactionAmountServerSchema,
    queries,
  );
  if (!validatedResultQueries.success) {
    setResponseStatus(event, 400);
    return {
      message: "Kueri `transaction-amount` salah atau belum diisi.",
    };
  }

  const transactionAmount = validatedResultQueries.output["transaction-amount"];

  const canvas = await generateQrisImageServer(qrisRaw, transactionAmount);

  return canvas.createPNGStream();
});

export async function generateQrisImageServer(code: string, amount: number) {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  await drawImage(ctx, code, amount);

  return canvas;
}
