// Minimal hand-written DB types so the generic clients are typed.
// Regenerate later with: npx supabase gen types typescript --project-id <id>

export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "bodyweight"
  | "machine";

export type WorkoutCategory = "Strength" | "Hypertrophy" | "Endurance";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          streak_count: number;
          weekly_workout_goal: number;
          daily_calorie_goal: number;
          body_weight_kg: number | null;
          height_cm: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          streak_count?: number;
          weekly_workout_goal?: number;
          daily_calorie_goal?: number;
          body_weight_kg?: number | null;
          height_cm?: number | null;
          created_at?: string;
        };
        Update: Partial<{
          name: string | null;
          streak_count: number;
          weekly_workout_goal: number;
          daily_calorie_goal: number;
          body_weight_kg: number | null;
          height_cm: number | null;
        }>;
        Relationships: [];
      };
      nutrition_entries: {
        Row: {
          id: string;
          user_id: string;
          consumed_at: string;
          label: string | null;
          calories: number;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          consumed_at?: string;
          label?: string | null;
          calories: number;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
        };
        Update: Partial<{
          consumed_at: string;
          label: string | null;
          calories: number;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
        }>;
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group: MuscleGroup;
          equipment: Equipment | null;
        };
        Insert: {
          id?: string;
          name: string;
          muscle_group: MuscleGroup;
          equipment?: Equipment | null;
        };
        Update: Partial<{
          name: string;
          muscle_group: MuscleGroup;
          equipment: Equipment | null;
        }>;
        Relationships: [];
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: WorkoutCategory | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: WorkoutCategory | null;
          started_at: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          notes?: string | null;
        };
        Update: Partial<{
          name: string;
          category: WorkoutCategory | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          notes: string | null;
        }>;
        Relationships: [];
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          order_index: number;
        };
        Update: Partial<{
          exercise_id: string;
          order_index: number;
        }>;
        Relationships: [];
      };
      sets: {
        Row: {
          id: string;
          workout_exercise_id: string;
          set_number: number;
          weight_kg: number | null;
          reps: number | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          workout_exercise_id: string;
          set_number: number;
          weight_kg?: number | null;
          reps?: number | null;
          completed?: boolean;
        };
        Update: Partial<{
          set_number: number;
          weight_kg: number | null;
          reps: number | null;
          completed: boolean;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
