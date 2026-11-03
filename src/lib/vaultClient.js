/**
 * SWAL XCB1 client-side encrypted vault.
 */

const MAGIC_HEADER = new TextEncoder().encode("XCB1");

/**
 * Derives the Key Encryption Key (KEK).
 * @param {string} passphrase
 * @param {string} salt
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 600000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"]
  );
}

/**
 * @param {CryptoKey} kek
 * @param {string} prefix
 * @param {string} packId
 * @returns {Promise<Uint8Array>}
 */
async function deriveFromKek(kek, prefix, packId) {
  const enc = new TextEncoder();
  const data = enc.encode(`${prefix}${packId}`);
  const signature = await crypto.subtle.sign("HMAC", kek, data);
  return new Uint8Array(signature);
}

/**
 * @param {CryptoKey} kek
 * @param {Uint8Array} plaintextBytes
 * @param {string} packId
 * @returns {Promise<Uint8Array>}
 */
export async function sealPack(kek, plaintextBytes, packId) {
  const dekBytes = await deriveFromKek(kek, "xcb1/pack-dek", packId);
  const nonceBytesFull = await deriveFromKek(kek, "xcb1/pack-nonce", packId);
  const nonce = nonceBytesFull.slice(0, 12);

  const dek = await crypto.subtle.importKey(
    "raw",
    dekBytes,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const aad = new TextEncoder().encode(`xcb1|${packId}`);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      additionalData: aad
    },
    dek,
    plaintextBytes
  );

  const cipherData = new Uint8Array(encrypted);

  // Format: [ "XCB1" (4b) | nonce (12b) | ciphertext + tag ]
  const blob = new Uint8Array(4 + 12 + cipherData.length);
  blob.set(MAGIC_HEADER, 0);
  blob.set(nonce, 4);
  blob.set(cipherData, 16);

  return blob;
}

/**
 * @param {CryptoKey} kek
 * @param {string} packId
 * @param {Uint8Array} blob
 * @returns {Promise<Uint8Array>}
 */
export async function openPack(kek, packId, blob) {
  if (blob.length < 16) {
    throw new Error("Invalid pack size");
  }

  for (let i = 0; i < 4; i++) {
    if (blob[i] !== MAGIC_HEADER[i]) {
      throw new Error("Invalid magic bytes, expected XCB1");
    }
  }

  const nonce = blob.slice(4, 16);
  const cipherData = blob.slice(16);

  const dekBytes = await deriveFromKek(kek, "xcb1/pack-dek", packId);
  const dek = await crypto.subtle.importKey(
    "raw",
    dekBytes,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const aad = new TextEncoder().encode(`xcb1|${packId}`);

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonce,
        additionalData: aad
      },
      dek,
      cipherData
    );
    return new Uint8Array(decrypted);
  } catch {
    throw new Error("Failed to decrypt pack (wrong key or corrupted data)");
  }
}

/**
 * @param {string} endpoint
 * @param {Uint8Array} packBlob
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function syncPackToCloud(endpoint, packBlob, token) {
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': `Bearer ${token}`
    },
    body: packBlob
  });

  if (!res.ok) {
    throw new Error(`Cloud sync failed: ${res.status}`);
  }
}
