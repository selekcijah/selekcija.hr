import fs from "fs";
import path from "path";

const slicesDir = path.resolve("src/slices");
const bad = [];

for (const dir of fs.readdirSync(slicesDir)) {
  const modelPath = path.join(slicesDir, dir, "model.json");
  const mocksPath = path.join(slicesDir, dir, "mocks.json");
  if (!fs.existsSync(modelPath)) continue;

  const issues = [];
  let model;
  try {
    model = JSON.parse(fs.readFileSync(modelPath, "utf8"));
  } catch {
    issues.push("model JSON invalid");
    bad.push({ dir, issues });
    continue;
  }

  if (!fs.existsSync(mocksPath)) {
    issues.push("missing mocks.json");
  } else {
    let mocks;
    try {
      mocks = JSON.parse(fs.readFileSync(mocksPath, "utf8"));
    } catch {
      issues.push("mocks JSON invalid");
    }

    if (mocks && !Array.isArray(mocks)) {
      issues.push(`mocks is ${typeof mocks}, not array`);
    }

    if (Array.isArray(mocks)) {
      const modelVars = new Set(model.variations.map((v) => v.id));
      const mockVars = mocks.map((m) => m.variation);

      for (const v of modelVars) {
        if (!mockVars.includes(v)) issues.push(`missing mock for variation: ${v}`);
      }
      for (const v of mockVars) {
        if (!modelVars.has(v)) issues.push(`extra mock variation: ${v}`);
      }

      for (const mock of mocks) {
        if (mock.__TYPE__ !== "SharedSliceContent") issues.push("missing SharedSliceContent");
        if (Array.isArray(mock.items)) {
          for (let i = 0; i < mock.items.length; i++) {
            const item = mock.items[i];
            if (item.__TYPE__ === "GroupItemContent" && !item.key) {
              issues.push(`items[${i}] missing key UUID`);
            }
            if (!item.__TYPE__) issues.push(`items[${i}] plain object`);
          }
        }
      }
    }
  }

  for (const v of model.variations) {
    const pIds = Object.keys(v.primary || {});
    const iIds = Object.keys(v.items || {});
    const dup = pIds.filter((id) => iIds.includes(id));
    if (dup.length) issues.push(`variation ${v.id} duplicate ids: ${dup.join(",")}`);
    if (!/^[a-z][a-zA-Z0-9]*$/.test(v.id)) {
      issues.push(`variation ${v.id} invalid id format`);
    }
  }

  if (issues.length) bad.push({ dir, issues: [...new Set(issues)] });
}

const noMocks = fs
  .readdirSync(slicesDir)
  .filter((d) => fs.existsSync(path.join(slicesDir, d, "model.json")))
  .filter((d) => !fs.existsSync(path.join(slicesDir, d, "mocks.json")));

console.log(JSON.stringify({ bad, noMocks }, null, 2));
