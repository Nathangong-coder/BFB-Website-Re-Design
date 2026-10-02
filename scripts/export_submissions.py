#!/usr/bin/env python3
"""
BFB at UCLA - Alpha Research Competition
Organizer Submissions Export CLI Script

This script connects to Supabase (or reads local submissions export) and extracts all
latest team strategy submissions into structured local folders for judge evaluation.

Usage:
    python3 scripts/export_submissions.py [--out-dir submissions_archive]

Folder Structure Generated:
    submissions_archive/
    ├── Bruin_Alpha_Research_v1/
    │   ├── research_memo.md
    │   ├── strategy.py
    │   ├── requirements.txt
    │   ├── backtest_metrics.json
    │   ├── data_provenance.md
    │   ├── reproduction_instructions.md
    │   └── submission_manifest.json
    └── Apex_High_Frequency_v2/
        ├── research_memo.md
        ├── strategy.cpp
        ├── Makefile
        ├── backtest_metrics.json
        ├── data_provenance.md
        ├── reproduction_instructions.md
        └── submission_manifest.json
"""

import os
import sys
import json
import argparse
from typing import List, Dict, Any

# Sample submissions for offline fallback testing
SAMPLE_SUBMISSIONS: List[Dict[str, Any]] = [
    {
        "id": "sample-py-001",
        "team_name": "Bruin Alpha Research",
        "version": 1,
        "is_latest": True,
        "submitted_at": "2026-10-01T14:32:00Z",
        "submitted_by_email": "alex.bruin@ucla.edu",
        "crypto_hash": "3cddc3eb4ea2e89a46f9541841acaa36ab89a209b5ca0d113b28cef69b115ae4",
        "language": "python",
        "research_memo_title": "Statistical Arbitrage via Cointegration",
        "research_memo_content": "# Statistical Arbitrage via Cointegration\n\nStrategy Overview: Mean-reversion pairs trading.",
        "strategy_code_filename": "strategy.py",
        "strategy_code_content": '"""Bruin Alpha Strategy"""\nimport json, sys\n\ndef generate_signals(data):\n    return {"AAPL": 0.5, "MSFT": 0.5}\n\nif __name__ == "__main__":\n    if len(sys.argv) >= 3:\n        with open(sys.argv[1]) as f: d = json.load(f)\n        signals = generate_signals(d)\n        with open(sys.argv[2], "w") as f: json.dump(signals, f, indent=2)\n',
        "entry_point": "strategy.py",
        "dependencies": "numpy>=1.24.0\npandas>=2.0.0",
        "backtest_metrics": {
            "expected_sharpe": 2.14,
            "expected_calmar": 2.85,
            "max_drawdown_pct": 7.2
        },
        "data_provenance": "Polygon.io 5-minute equity bars 2021-2025.",
        "reproduction_instructions": "1. pip install -r requirements.txt\n2. python3 strategy.py market_data.json output_signals.json"
    },
    {
        "id": "sample-cpp-002",
        "team_name": "Apex High Frequency",
        "version": 2,
        "is_latest": True,
        "submitted_at": "2026-10-01T16:15:00Z",
        "submitted_by_email": "sam.cpp@ucla.edu",
        "crypto_hash": "31c0e7d48463b9b36df90988393fa9231c182e76ac0281410d21505e9f89aa89",
        "language": "cpp",
        "research_memo_title": "Ultra-Low Latency Order Flow Imbalance Predictor",
        "research_memo_content": "# Ultra-Low Latency Order Flow Imbalance\n\nC++20 microsecond level execution.",
        "strategy_code_filename": "strategy.cpp",
        "strategy_code_content": '/** Apex C++ Strategy */\n#include <iostream>\n#include <fstream>\n#include <unordered_map>\n\nint main(int argc, char* argv[]) {\n    if (argc >= 3) {\n        std::ofstream out(argv[2]);\n        out << "{\\"AAPL\\": 0.5, \\"MSFT\\": 0.5}\\n";\n    }\n    return 0;\n}\n',
        "entry_point": "strategy.cpp",
        "dependencies": "g++ -O3 -std=c++20 strategy.cpp -o strategy_runner",
        "backtest_metrics": {
            "expected_sharpe": 2.89,
            "expected_calmar": 3.42,
            "max_drawdown_pct": 4.8
        },
        "data_provenance": "High frequency tick data backtest.",
        "reproduction_instructions": "1. make\n2. ./strategy_runner market_data.json output_signals.json"
    }
]

def sanitize_folder_name(name: str) -> str:
    return "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in name)

def export_submissions(submissions: List[Dict[str, Any]], out_dir: str):
    os.makedirs(out_dir, exist_ok=True)
    exported_count = 0

    print(f"📦 Exporting {len(submissions)} submission packages to '{out_dir}'...")

    for sub in submissions:
        team_folder = f"{sanitize_folder_name(sub.get('team_name', 'Unknown'))}_v{sub.get('version', 1)}"
        target_path = os.path.join(out_dir, team_folder)
        os.makedirs(target_path, exist_ok=True)

        lang = sub.get("language", "python")
        code_file = "strategy.cpp" if lang == "cpp" else "strategy.py"
        deps_file = "Makefile" if lang == "cpp" else "requirements.txt"

        # 1. Write Strategy Code
        code_content = sub.get("strategy_code_content", "")
        with open(os.path.join(target_path, code_file), "w", encoding="utf-8") as f:
            f.write(code_content)

        # 2. Write Dependencies / Makefile
        deps_content = sub.get("dependencies", "")
        with open(os.path.join(target_path, deps_file), "w", encoding="utf-8") as f:
            f.write(deps_content)

        # 3. Write Research Memo
        memo_content = sub.get("research_memo_content", "")
        with open(os.path.join(target_path, "research_memo.md"), "w", encoding="utf-8") as f:
            f.write(memo_content)

        # 4. Write Backtest Metrics (Optional / Legacy)
        metrics = sub.get("backtest_metrics")
        if metrics:
            with open(os.path.join(target_path, "backtest_metrics.json"), "w", encoding="utf-8") as f:
                json.dump(metrics, f, indent=2)

        # 5. Write Data Provenance
        prov_content = sub.get("data_provenance", "")
        with open(os.path.join(target_path, "data_provenance.md"), "w", encoding="utf-8") as f:
            f.write(prov_content)

        # 6. Write Reproduction Instructions
        reprod_content = sub.get("reproduction_instructions", "")
        with open(os.path.join(target_path, "reproduction_instructions.md"), "w", encoding="utf-8") as f:
            f.write(reprod_content)

        # 7. Write Submission Manifest JSON
        manifest = {
            "team_name": sub.get("team_name"),
            "version": sub.get("version"),
            "submitted_at": sub.get("submitted_at"),
            "submitted_by_email": sub.get("submitted_by_email"),
            "crypto_hash": sub.get("crypto_hash"),
            "language": lang,
            "entry_point": code_file,
        }
        with open(os.path.join(target_path, "submission_manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)

        print(f"  ✓ Extracted: {team_folder} ({lang.upper()}) -> {code_file}")
        exported_count += 1

    print(f"\n✨ Successfully exported {exported_count} submission packages to '{os.path.abspath(out_dir)}'.")

def main():
    parser = argparse.ArgumentParser(description="BFB Alpha Research Submissions Exporter")
    parser.add_argument("--out-dir", default="submissions_archive", help="Target archive folder path")
    args = parser.parse_args()

    # Check for Supabase environment variables
    sb_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    submissions = []

    if sb_url and sb_key:
        try:
            from supabase import create_client
            print("🔗 Connecting to Supabase...")
            client = create_client(sb_url, sb_key)
            res = client.table("competition_submissions").select("*").eq("is_latest", True).execute()
            if res.data:
                submissions = res.data
                print(f"Found {len(submissions)} latest team submissions in Supabase.")
        except Exception as e:
            print(f"⚠️ Supabase query warning: {e}")

    if not submissions:
        print("ℹ️ Using sample submission packages for offline export verification.")
        submissions = SAMPLE_SUBMISSIONS

    export_submissions(submissions, args.out_dir)

if __name__ == "__main__":
    main()
