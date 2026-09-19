import { generatePdf } from "./infrai_pdf_client.ts";
import { renderReport, reportOrientation, type DevtoolsInput } from "./report_service.ts";

const report: DevtoolsInput = {
  period: new Date().toISOString().slice(0, 10),
  builds: [{ commit: "a1b2c3d", status: "passed", durationMs: 42000 }, { commit: "d4e5f6a", status: "failed", durationMs: 18000 }],
  releases: [{ version: "2026.09.08", environment: "staging", status: "deployed" }],
  diagnostics: [{ code: "TYPECHECK", severity: "warning", message: "One deprecated API use" }]
};

const result = await generatePdf(renderReport(report), reportOrientation(report));
console.log(JSON.stringify({ archived: true, orientation: reportOrientation(report), result }, null, 2));
