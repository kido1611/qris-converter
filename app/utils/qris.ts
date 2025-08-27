export async function generateQrisImage(code: string): Promise<string> {
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

  await drawImage(ctx, code);

  return canvas.toDataURL("image/png");
}

async function loadFont(font: string) {
  return new Promise<void>((resolve, reject) => {
    document.fonts
      .load(font)
      .then(() => resolve())
      .catch(() => reject());
  });
}
