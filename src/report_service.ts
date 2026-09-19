export type BuildEvent = { commit: string; status: "passed" | "failed"; durationMs: number };
export type ReleaseOperation = { version: string; environment: "staging" | "production"; status: "deployed" | "rolled_back" };
export type Diagnostic = { code: string; severity: "info" | "warning" | "error"; message: string };
export type DevtoolsInput = { period: string; builds: BuildEvent[]; releases: ReleaseOperation[]; diagnostics: Diagnostic[] };

export function reportOrientation(input: DevtoolsInput): "portrait" | "landscape" {
  return input.diagnostics.some(item => item.severity === "error") ? "landscape" : "portrait";
}

export function renderReport(input: DevtoolsInput): string {
  const passed = input.builds.filter(build => build.status === "passed").length;
  const failed = input.builds.length - passed;
  const lines = [
    `# Developer tools report: ${input.period}`,
    "",
    `Builds: ${passed} passed, ${failed} failed`,
    `Releases: ${input.releases.length}`,
    "",
    "## Release operations",
    ...input.releases.map(release => `- ${release.version} ${release.environment}: ${release.status}`),
    "",
    "## Diagnostics",
    ...input.diagnostics.map(item => `- [${item.severity}] ${item.code}: ${item.message}`)
  ];
  return lines.join("\n");
}
