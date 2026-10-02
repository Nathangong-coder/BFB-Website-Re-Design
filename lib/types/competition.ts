export type ClassYear =
  | "2025"
  | "2026"
  | "2027"
  | "2028"
  | "2029"
  | "Graduate / Other"
  | "Freshman"
  | "Sophomore"
  | "Junior"
  | "Senior"
  | "Graduate";

export interface CompetitionRegistration {
  id: string;
  full_name: string;
  email: string;
  class_year: ClassYear;
  team_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  full_name: string;
  email: string;
  class_year: ClassYear;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  classYear: ClassYear;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface BacktestMetrics {
  expected_sharpe?: number;
  expected_calmar?: number;
  max_drawdown_pct?: number;
  gross_exposure_pct?: number;
  net_exposure_pct?: number;
  annual_turnover_pct?: number;
  trade_count?: number;
  win_rate_pct?: number;
  benchmark_name?: string;
}

export type LanguageType = "python" | "cpp";

export interface SubmissionDeliverables {
  research_memo_title: string;
  research_memo_content: string;
  research_memo_file_name?: string;
  research_memo_file_data?: string;

  language: LanguageType;
  strategy_code_filename: string;
  strategy_code_content: string;
  entry_point: string;
  dependencies: string;

  backtest_metrics?: BacktestMetrics;

  data_provenance: string;

  reproduction_instructions: string;
  signed_confirmation: boolean;
}

export interface CompetitionSubmission extends SubmissionDeliverables {
  id: string;
  team_name: string;
  submitted_by_id: string;
  submitted_by_email: string;
  version: number;
  is_latest: boolean;
  submitted_at: string;
  crypto_hash: string;
  created_at?: string;
  updated_at?: string;
}
