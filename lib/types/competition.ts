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
