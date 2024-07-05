import { PrivateKey, Utils } from "@bsv/sdk";
import { deployBsv21Token, type DeployBsv21TokenConfig } from "./deployBsv21";
import type { Utxo, IconInscription } from "./types";
import { ErrorIconProportions, ErrorOversizedIcon } from "./utils/icon";

describe("deployBsv21Token", () => {
  const paymentPk = PrivateKey.fromWif("KzwfqdfecMRtpg65j2BeRtixboNR37fSCDr8QbndV6ySEPT4xibW");
  const address = paymentPk.toAddress().toString();

  const insufficientUtxos: Utxo[] = [{
    satoshis: 6,
    txid: "ecb483eda58f26da1b1f8f15b782b1186abdf9c6399a1c3e63e0d429d5092a41",
    vout: 0,
    script: Buffer.from(Utils.fromBase58Check(address).data).toString("base64")
  }];

  const exactUtxos: Utxo[] = [{
    satoshis: 7,
    txid: "ecb483eda58f26da1b1f8f15b782b1186abdf9c6399a1c3e63e0d429d5092a41",
    vout: 0,
    script: Buffer.from(Utils.fromBase58Check(address).data).toString("base64")
  }];

  const sufficientUtxos: Utxo[] = [{
    satoshis: 10,
    txid: "ecb483eda58f26da1b1f8f15b782b1186abdf9c6399a1c3e63e0d429d5092a41",
    vout: 0,
    script: Buffer.from(Utils.fromBase58Check(address).data).toString("base64")
  }];

  const initialDistribution = {
    address: address,
    amt: "1000000000"
  };

  const symbol = "TEST";
  const svgIcon: IconInscription = {
    dataB64: Buffer.from('<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>').toString('base64'),
    contentType: "image/svg+xml"
  };

  const baseConfig: DeployBsv21TokenConfig = {
    symbol,
    icon: svgIcon,
    utxos: sufficientUtxos,
    initialDistribution,
    paymentPk,
    destinationAddress: address,
  };

  test("deploy BSV21 token with a sufficient utxo", async () => {
    const { tx } = await deployBsv21Token(baseConfig);

    expect(tx).toBeDefined();
    expect(tx.toHex()).toBeTruthy();
    // expect change
    expect(tx.outputs.length).toBe(3);
    console.log({ txHex: tx.toHex() });
  });

  test("deploy BSV21 token with an exact utxo", async () => {
    const config = { ...baseConfig, utxos: exactUtxos };
    const { tx } = await deployBsv21Token(config);

    expect(tx).toBeDefined();
    expect(tx.toHex()).toBeTruthy();
    // expect no change output
    expect(tx.outputs.length).toBe(2);
    console.log({ txHex: tx.toHex() });
  });

  test("deploy BSV21 token with a insufficient utxo", async () => {
    const config = { ...baseConfig, utxos: insufficientUtxos };
    // expect this to throw an error
    await expect(deployBsv21Token(config)).rejects.toThrow();
  });

  test("deploy BSV21 token with sufficient utxos", async () => {
    const { tx } = await deployBsv21Token(baseConfig);

    expect(tx).toBeDefined();
    expect(tx.toHex()).toBeTruthy();
    console.log({ txHex: tx.toHex() });
  });

  test("deploy BSV21 token with incorrect image proportion", async () => {
    const nonSquareIcon: IconInscription = {
      dataB64: Buffer.from('<svg width="200" height="100"><rect width="200" height="100" style="fill:rgb(0,0,255);" /></svg>').toString('base64'),
      contentType: "image/svg+xml"
    };
    const config = { ...baseConfig, icon: nonSquareIcon };

    await expect(deployBsv21Token(config)).rejects.toThrow(ErrorIconProportions.message);
  });

  test("deploy BSV21 token with oversized image", async () => {
    const oversizedIcon: IconInscription = {
      dataB64: Buffer.from('<svg width="500" height="500"><circle cx="250" cy="250" r="200" stroke="black" stroke-width="3" fill="blue" /></svg>').toString('base64'),
      contentType: "image/svg+xml"
    };
    const config = { ...baseConfig, icon: oversizedIcon };

    await expect(deployBsv21Token(config)).rejects.toThrow(ErrorOversizedIcon.message);
  });
});