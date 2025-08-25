import QrCode from "qrcode";

export async function generateQrisImage(code: string): Promise<string> {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 1024;
  const SEPARATOR_HEIGHT = 32;

  let latestHeightComponent = SEPARATOR_HEIGHT + SEPARATOR_HEIGHT / 2;

  const qris = new Qris(code);

  const qrisImageSource = await QrCode.toDataURL(code, {
    width: 512,
    // errorCorrectionLevel: "high",
    margin: 4,
  });

  await Promise.all([
    loadFont("bold 40px Plus Jakarta Sans"),
    loadFont("bold 32px Plus Jakarta Sans"),
    loadFont("30px Plus Jakarta Sans"),
    loadFont("16px Plus Jakarta Sans"),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const [qrisImage, qrisLogoImage] = await Promise.all([
    loadImage(qrisImageSource),
    loadImage("/qris-logo.png"),
  ]);

  // ------------------------------------------------------------- QRIS Logo
  const qrisLogoPosX = CANVAS_WIDTH / 2 - qrisLogoImage.width / 2;
  ctx.drawImage(qrisLogoImage, qrisLogoPosX, latestHeightComponent);
  latestHeightComponent +=
    qrisLogoImage.height + SEPARATOR_HEIGHT + SEPARATOR_HEIGHT / 2;

  // ------------------------------------------------------------- Merchant Name
  ctx.font = "Bold 40px Plus Jakarta Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.textBaseline = "top";
  ctx.fillText(
    `${qris.getMerchantName()}`,
    CANVAS_WIDTH / 2,
    latestHeightComponent,
  );

  latestHeightComponent = latestHeightComponent + 40 * 1.2 + 8;

  // ------------------------------------------------------------- NMID
  ctx.font = "30px Plus Jakarta Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    `NMID: ${qris.getNationalMerchantId()}`,
    CANVAS_WIDTH / 2,
    latestHeightComponent,
  );

  latestHeightComponent = latestHeightComponent + SEPARATOR_HEIGHT + 30 * 1.2;

  // ------------------------------------------------------------- NMID
  const qrisPosX = CANVAS_WIDTH / 2 - qrisImage.width / 2;
  ctx.drawImage(qrisImage, qrisPosX, latestHeightComponent);

  latestHeightComponent =
    latestHeightComponent + qrisImage.height + SEPARATOR_HEIGHT;

  // ------------------------------------------------------------- NMID
  if (qris.getTransactionAmount()) {
    ctx.font = "30px Plus Jakarta Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(`Nominal Transaksi:`, CANVAS_WIDTH / 2, latestHeightComponent);

    latestHeightComponent = latestHeightComponent + 30 * 1.2 + 10;
  }

  // ------------------------------------------------------------- NMID
  if (qris.getTransactionAmount()) {
    ctx.font = "bold 32px Plus Jakarta Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      `${currencyFormatter(qris.getTransactionAmount() ?? 0)}`,
      CANVAS_WIDTH / 2,
      latestHeightComponent,
    );

    latestHeightComponent = latestHeightComponent + SEPARATOR_HEIGHT + 30 * 1.2;
  }

  // ------------------------------------------------------------- Generated timestamp
  const now = new Date();
  ctx.font = "16px Plus Jakarta Sans";
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.fillText(`Generated: ${now.toISOString()}`, 10, 1024 - 5 - 16 * 1.2);

  return canvas.toDataURL("image/png");
}

async function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = source;
  });
}

async function loadFont(font: string) {
  return new Promise<void>((resolve, reject) => {
    document.fonts
      .load(font)
      .then(() => resolve())
      .catch(() => reject());
  });
}
