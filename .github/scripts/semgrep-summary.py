#!/usr/bin/env python3
"""Validate a Semgrep JSON report and print a Markdown summary.

Exits non-zero when the report is missing, malformed, or records scanner
errors. Findings themselves never affect the exit code (report-only policy).
"""
import json
import sys
from collections import Counter


def fail(message):
    print(f"::error::{message}", file=sys.stderr)
    sys.exit(1)


def main(path):
    try:
        with open(path, encoding="utf-8") as handle:
            report = json.load(handle)
    except FileNotFoundError:
        fail(f"Semgrep report not found: {path}")
    except json.JSONDecodeError as exc:
        fail(f"Semgrep report is not valid JSON: {exc}")

    if not isinstance(report, dict):
        fail("Semgrep report must be a JSON object")
    for key in ("results", "errors", "paths"):
        if key not in report:
            fail(f"Semgrep report missing required key: {key}")
    results, errors, paths = report["results"], report["errors"], report["paths"]
    if not isinstance(results, list) or not isinstance(errors, list) or not isinstance(paths, dict):
        fail("Semgrep report has unexpected types for results/errors/paths")
    scanned = paths.get("scanned")
    if not isinstance(scanned, list) or not scanned:
        fail("Semgrep scanned zero files")
    for finding in results:
        if not isinstance(finding, dict) or "check_id" not in finding or "extra" not in finding:
            fail("Semgrep finding is missing check_id or extra")
        if "severity" not in finding["extra"]:
            fail(f"Semgrep finding {finding['check_id']} is missing a severity")

    if errors:
        for error in errors:
            print(f"::error::Semgrep scanner error: {json.dumps(error)}", file=sys.stderr)
        fail(f"Semgrep reported {len(errors)} scanner error(s)")

    by_sev = Counter(finding["extra"]["severity"] for finding in results)
    print("## Semgrep findings (report-only)")
    print(f"Files scanned: {len(scanned)}")
    print(f"Total: {len(results)}")
    for severity, count in by_sev.most_common():
        print(f"- {severity}: {count}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        fail("usage: semgrep-summary.py <report.json>")
    main(sys.argv[1])
