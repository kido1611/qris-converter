import type { H3Event } from "h3";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  drawImage,
} from "@@/shared/utils/qris-image";
import * as v from "valibot";
import path from "node:path";

import { createCanvas, registerFont } from "canvas";
import { UpdateTransactionAmountServerSchema } from "~~/shared/types/qris";

export default defineEventHandler(async (event: H3Event) => {
  const rawPath = getRouterParam(event, "qris");
  if (!rawPath) {
    setResponseStatus(event, 404);
    return {
      message: "Invalid path",
    };
  }

  // validate rawPath with v.base64

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
  registerLocalFont("PlusJakartaSans-Bold.ttf", "Plus Jakarta sans", "700");
  registerLocalFont("PlusJakartaSans-Regular.ttf", "Plus Jakarta sans", "400");

  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  await drawImage(ctx, code, amount);

  return canvas;
}

function registerLocalFont(
  fileName: string,
  familyName: string,
  fontWeight: string,
) {
  const path = getFontPath(fileName);

  registerFont(path, {
    family: familyName,
    weight: fontWeight,
  });
}

function getFontPath(fileName: string): string {
  if (import.meta.dev) {
    return path.join(process.cwd(), "public", "fonts", fileName);
  }

  if (import.meta.preset === "vercel") {
    return path.join(process.cwd(), "public", "fonts", fileName);
  }

  if (import.meta.preset === "node-server") {
    return path.join(process.cwd(), "public", "fonts", fileName);
  }

  throw Error("Not supported preset");
}
