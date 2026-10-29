// Zero-network regression tests for the calculation shared by browser, REST and MCP.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filename = path.join(root, "lib/calculator-engine.ts");
const source = readFileSync(filename, "utf-8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = new Module(filename);
mod.filename = filename;
mod.paths = Module._nodeModulePaths(path.dirname(filename));
mod._compile(js, filename);
const { calculateFloorEstimate } = mod.exports;

const base = {
  area_m2: 45,
  surface: { id: "podstawowa", name: "Podstawowa", price_per_m2: 200 },
  color: { id: "ral7035", name: "RAL 7035", additional_price: 0 },
  services: [
    { id: "grunt", name: "Gruntowanie", price_per_m2: 8 },
    { id: "cokol", name: "Cokół", price_per_mb: 15 },
    { id: "uszczelnienie", name: "Uszczelnienie", price_per_mb: 8 },
  ],
};
const full = calculateFloorEstimate({ ...base, perimeter_m: 30 });
assert.equal(full.complete, true);
assert.equal(full.total_pln, 10050);
assert.equal(full.price_per_m2_pln, 223.33);
assert.equal(full.items.length, 4);
assert.equal(full.missing_information.length, 0);

const incomplete = calculateFloorEstimate(base);
assert.equal(incomplete.complete, false);
assert.equal(incomplete.total_pln, null);
assert.equal(incomplete.known_subtotal_pln, 9360);
assert.equal(incomplete.missing_information[0].field, "perimeter_m");

const flat = calculateFloorEstimate({
  ...base, area_m2: 30, services: [],
  surface: {
    ...base.surface, price_ranges: [
      { min_m2: 1, max_m2: 34, price_per_m2: 5000, is_flat_rate: true },
      { min_m2: 35, max_m2: null, price_per_m2: 200 },
    ],
  },
});
assert.equal(flat.total_pln, 5000);
assert.equal(flat.items[0].unit, "ryczalt");
const regular = calculateFloorEstimate({ ...base, area_m2: 35, services: [], surface: flat.items ? {
  ...base.surface, price_ranges: [
    { min_m2: 1, max_m2: 34, price_per_m2: 5000, is_flat_rate: true },
    { min_m2: 35, max_m2: null, price_per_m2: 200 },
  ],
} : base.surface });
assert.equal(regular.total_pln, 7000);

const included = calculateFloorEstimate({
  ...base, services: [{ id: "grunt", name: "Gruntowanie", price_per_m2: 8, is_included_in_floor_price: true }],
});
assert.equal(included.total_pln, 9000);
assert.equal(included.items[1].amount_pln, 0);

assert.throws(() => calculateFloorEstimate({ ...base, area_m2: -1 }), /Powierzchnia/);
assert.throws(() => calculateFloorEstimate({ ...base, perimeter_m: -10 }), /Obwód/);
console.log("Calculator engine tests passed.");
