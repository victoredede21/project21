// Base64 encoding/decoding
export function encodeBase64(input: string): string {
  try {
    return Buffer.from(input).toString('base64');
  } catch (error) {
    console.error("Error encoding to Base64:", error);
    throw new Error("Failed to encode to Base64");
  }
}

export function decodeBase64(input: string): string {
  try {
    return Buffer.from(input, 'base64').toString('utf-8');
  } catch (error) {
    console.error("Error decoding from Base64:", error);
    throw new Error("Failed to decode from Base64");
  }
}

// URL encoding/decoding
export function encodeURL(input: string): string {
  try {
    return encodeURIComponent(input);
  } catch (error) {
    console.error("Error encoding URL:", error);
    throw new Error("Failed to encode URL");
  }
}

export function decodeURL(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch (error) {
    console.error("Error decoding URL:", error);
    throw new Error("Failed to decode URL");
  }
}

// HTML encoding/decoding
export function encodeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function decodeHTML(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

// Hex encoding/decoding
export function toHex(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(16);
  }
  return result;
}

export function fromHex(input: string): string {
  const hex = input.toString();
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const hexChar = hex.substr(i, 2);
    const charCode = parseInt(hexChar, 16);
    if (!isNaN(charCode)) {
      result += String.fromCharCode(charCode);
    }
  }
  return result;
}
