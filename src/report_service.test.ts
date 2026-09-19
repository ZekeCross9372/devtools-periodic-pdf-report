import assert from "node:assert/strict";
import { reportOrientation, renderReport, type DevtoolsInput } from "./report_service.ts";

const input: DevtoolsInput = {
  period: "2026-W36",
  builds: [{ commit: "x", status: "passed", durationMs: 1 }],
  releases: [],
  diagnostics: [{ code: "SECURITY", severity: "error", message: "Secret scan failed" }]
};
assert.equal(reportOrientation(input), "landscape");
assert.match(renderReport(input), /1 passed, 0 failed/);
console.log("report decision test passed");
