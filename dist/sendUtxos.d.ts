import type { SendUtxosConfig, SendUtxosResult } from "./types";
/**
 * Sends utxos to the given destination
 * @param {SendUtxosConfig} config - Configuration object for sending utxos
 * @param {Utxo[]} config.utxos - Utxos to spend (with base64 encoded scripts)
 * @param {PrivateKey} config.paymentPk - Private key to sign utxos
 * @param {Payment[]} config.payments - Array of payments with addresses and amounts
 * @param {number} [config.satsPerKb] - Satoshis per kilobyte for fee calculation. Default is DEFAULT_SAT_PER_KB
 * @param {string} [config.changeAddress] - Address to send change to. If not provided, defaults to paymentPk address
 * @returns {Promise<SendUtxosResult>} Transaction with utxo outputs
 */
export declare const sendUtxos: (config: SendUtxosConfig) => Promise<SendUtxosResult>;
