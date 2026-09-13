import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../lib/products.ts", import.meta.url),
  "utf8",
);

const expectedAssetPaths = [
  "/flags/Lion_and_Sun_flag_(historical).svg.webp",
  "/flags/italy-flag.webp",
  "/flags/Flag_of_France.svg.webp",
  "/flags/Flag_of_Japan.svg.webp",
  "/flags/Flag_of_Germany.svg.webp",
  "/flags/Flag_of_Turkey.svg.webp",
  "/flags/Flag_of_the_United_States_(DDD-F-416E_specifications).svg.webp",
  "/flags/Flag_of_the_United_Kingdom_(1-2).svg.webp",
  "/flags/Flag_of_Brazil.svg.webp",
  "/flags/Flag_of_Saudi_Arabia.svg.webp",
  "/flags/Flag_of_Canada_(Pantone).svg.webp",
  "/flags/Flag_of_Australia_(converted).svg.webp",
];

test("product catalog uses existing static flag assets", () => {
  for (const asset of expectedAssetPaths) {
    assert.match(
      source,
      new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});
