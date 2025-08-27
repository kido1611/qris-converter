type PointOfMethod = "STATIC" | "DYNAMIC";

interface Tlv {
  tag: string;
  value: string;
  sub?: Record<number, Tlv>;
}

interface ParseResult {
  isValid: boolean;
  message?: string;
  data: Record<number, Tlv>;
}

export class Qris {
  private tlvs: Record<number, Tlv> = {};

  constructor(rawQris: string) {
    const result = Qris.parseAndValidate(rawQris);
    if (!result.isValid) {
      throw new Error(result.message);
    }

    this.tlvs = result.data;
  }

  public getType(): PointOfMethod | undefined {
    if (!this.tlvs[1]) {
      return undefined;
    }

    if (this.tlvs[1].value === "11") {
      return "STATIC";
    }

    return "DYNAMIC";
  }

  public getTransactionAmount(): number | undefined {
    if (!this.tlvs[54]) {
      return undefined;
    }

    return parseInt(this.tlvs[54].value);
  }

  public getTransactionCurrency(): string {
    return this.tlvs[53]!.value; // ISO 4217
  }

  public getCountryCode(): string {
    return this.tlvs[58]!.value;
  }

  public getMerchantName(): string {
    return this.tlvs[59]!.value;
  }

  public getMerchantCity(): string {
    return this.tlvs[60]!.value;
  }

  public setTransactionAmount(amount: number) {
    if (amount === 0) {
      delete this.tlvs["54"];

      this.tlvs[1] = {
        tag: "01",
        value: "11",
      };
      this.calculateCrc();

      return;
    }

    const amountString = amount.toString();
    this.tlvs[54] = {
      tag: "54",
      value: amountString,
    };

    this.tlvs[1] = {
      tag: "01",
      value: "12",
    };

    this.calculateCrc();
  }

  public clearTransactionAmount() {
    this.setTransactionAmount(0);
  }

  private calculateCrc() {
    this.tlvs[63] = {
      tag: "63",
      value: Qris._getCrc(this.tlvs),
    };
  }

  public getNationalMerchantId(): string | undefined {
    return this.tlvs[51]?.sub?.[2]?.value;
  }

  public getIssuer(): string | undefined {
    return this.tlvs[26]?.sub?.[0]?.value?.split(".").reverse().join(".");
  }

  public getRawTlv() {
    // TODO: only return values without keys
    return Object.values(this.tlvs);
  }

  public serialize(): string {
    let joinedData = "";

    for (const key in this.tlvs) {
      if (!this.tlvs[key]) {
        continue;
      }

      const lengthString = String(this.tlvs[key].value.length).padStart(2, "0");
      joinedData += this.tlvs[key].tag + lengthString + this.tlvs[key].value;
    }

    return joinedData;
  }

  public static parseAndValidate(rawQris: string): ParseResult {
    const qrisTlv = this.parse(rawQris);

    if (!this._isTagsValid(qrisTlv)) {
      return {
        isValid: false,
        message: "Missing required tags",
        data: {},
      };
    }

    if (!this._isChecksumValid(qrisTlv)) {
      return {
        isValid: false,
        message: "Checksum missmatch",
        data: {},
      };
    }

    return {
      isValid: true,
      data: qrisTlv,
    };
  }

  private static parse(qris: string) {
    const result: Record<number, Tlv> = {};

    let i = 0;
    while (i + 4 < qris.length) {
      const tag = qris.slice(i, i + 2);
      const length = qris.slice(i + 2, i + 4);
      const lengthNumber = parseInt(length);
      const value = qris.slice(i + 4, i + 4 + lengthNumber);

      const tagNumber = parseInt(tag);

      result[tagNumber] = {
        tag: tag,
        value: value,
      };

      if ((tagNumber >= 26 && tagNumber <= 51) || tagNumber === 62) {
        result[tagNumber].sub = this.parse(value);
      }

      i = i + 4 + lengthNumber;
    }

    return result;
  }

  private static _isChecksumValid(tlvs: Record<number, Tlv>): boolean {
    if (!(tlvs[63] ?? false)) {
      return false;
    }

    const checksum = this._getCrc(tlvs);
    return checksum === tlvs[63]!.value;
  }

  private static _isTagsValid(tlvs: Record<number, Tlv>): boolean {
    const requiredKeys = [0, 52, 53, 58, 59, 60, 63];
    const startOptionalKey = 2;
    const endOptionalKey = 51;

    const tlvKeys = Object.keys(tlvs).map((key) => Number(key));

    const missingRequired = requiredKeys.filter(
      (key) => !tlvKeys.includes(key),
    );

    const hasOptionalKeys = tlvKeys.some(
      (key) => key >= startOptionalKey && key <= endOptionalKey,
    );

    return missingRequired && hasOptionalKeys;
  }

  private static _getCrc(tlvs: Record<number, Tlv>) {
    let joinedData = "";

    for (const key in tlvs) {
      if (key === "63") {
        continue;
      }

      if (!tlvs[key]) {
        continue;
      }

      const lengthString = String(tlvs[key].value.length).padStart(2, "0");
      joinedData += tlvs[key].tag + lengthString + tlvs[key].value;
    }

    return this._calculateCrc16CcittFalse(joinedData + "6304"); // 6304 is tag 63 and length 4
  }

  private static _calculateCrc16CcittFalse(dataString: string): string {
    // CRC-16/CCITT-FALSE parameters
    const polynomial = 0x1021; // x^16 + x^12 + x^5 + 1
    let crc = 0xffff; // Initial value

    // Convert the input string to an array of character codes (bytes)
    // The EMVCo QR code payload uses ASCII characters, so charCodeAt is appropriate.
    for (let i = 0; i < dataString.length; i++) {
      const charCode = dataString.charCodeAt(i);
      // XOR the current byte with the CRC high byte shifted left by 8 bits
      crc ^= charCode << 8;

      // Perform the polynomial division bit by bit
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) > 0) {
          // Check if the MSB is 1
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
        // Ensure CRC remains a 16-bit value
        crc &= 0xffff;
      }
    }

    // The final CRC value is not XORed with an output mask (0x0000) and not reflected.
    // Convert the 16-bit CRC to a 4-character uppercase hexadecimal string.
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
}
