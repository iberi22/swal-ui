/**
 * Derives the Key Encryption Key (KEK) using PBKDF2.
 * @param passphrase The passphrase to derive from.
 * @param salt The salt for derivation.
 * @returns A promise resolving to the HMAC SHA-256 CryptoKey (KEK).
 */
export declare function deriveKey(passphrase: string, salt: string): Promise<CryptoKey>;

/**
 * Seals (encrypts) the given plaintext bytes into an XCB1 pack.
 * @param kek The Key Encryption Key.
 * @param plaintextBytes The data to encrypt.
 * @param packId The identifier of the pack.
 * @returns A promise resolving to the encrypted blob.
 */
export declare function sealPack(kek: CryptoKey, plaintextBytes: Uint8Array, packId: string): Promise<Uint8Array>;

/**
 * Opens (decrypts) the given XCB1 pack.
 * @param kek The Key Encryption Key.
 * @param packId The identifier of the pack.
 * @param blob The encrypted blob.
 * @returns A promise resolving to the decrypted plaintext.
 */
export declare function openPack(kek: CryptoKey, packId: string, blob: Uint8Array): Promise<Uint8Array>;

/**
 * Syncs an opaque sealed pack blob to the cloud endpoint.
 * @param endpoint The API endpoint to send the pack to.
 * @param packBlob The encrypted blob.
 * @param token The bearer token for authorization.
 * @returns A promise that resolves when the upload completes.
 */
export declare function syncPackToCloud(endpoint: string, packBlob: Uint8Array, token: string): Promise<void>;
