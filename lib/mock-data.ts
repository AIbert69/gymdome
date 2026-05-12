export type WorkoutCategory = "All" | "Strength" | "Hypertrophy" | "Endurance";

export type FigureVariant = "push" | "pull" | "leg" | "upper" | "full";

export type Workout = {
  id: string;
  name: string;
  category: Exclude<WorkoutCategory, "All">;
  muscles: string[];
  when: string;
  duration: string;
  figure: FigureVariant;
};

export const workoutCategories: WorkoutCategory[] = [
  "All",
  "Strength",
  "Hypertrophy",
  "Endurance",
];

export const workouts: Workout[] = [
  {
    id: "push-day",
    name: "Push Day",
    category: "Strength",
    muscles: ["Chest", "Shoulders", "Triceps"],
    when: "Today",
    duration: "60 min",
    figure: "push",
  },
  {
    id: "pull-day",
    name: "Pull Day",
    category: "Strength",
    muscles: ["Back", "Biceps"],
    when: "Yesterday",
    duration: "55 min",
    figure: "pull",
  },
  {
    id: "leg-day",
    name: "Leg Day",
    category: "Hypertrophy",
    muscles: ["Quadriceps", "Hamstrings", "Calves"],
    when: "May 18",
    duration: "70 min",
    figure: "leg",
  },
  {
    id: "upper-body",
    name: "Upper Body",
    category: "Strength",
    muscles: ["Chest", "Back", "Shoulders", "Arms"],
    when: "May 16",
    duration: "65 min",
    figure: "upper",
  },
  {
    id: "full-body",
    name: "Full Body",
    category: "Endurance",
    muscles: ["Full Body"],
    when: "May 14",
    duration: "60 min",
    figure: "full",
  },
];

export const dashboardData = {
  user: {
    name: "Athlete",
    streak: 12,
    tagline: ["Track smarter.", "Train harder.", "Be better."],
    hasNotifications: true,
  },
  weekSummary: { workouts: 5, kgLifted: 12450, durationHours: 4.6 },
  metrics: {
    progress: 87,
    consistency: 92,
  },
  muscleFocus: {
    weeklyProgress: 82,
    groups: [
      { name: "Chest", percent: 92 },
      { name: "Back", percent: 88 },
      { name: "Legs", percent: 85 },
      { name: "Shoulders", percent: 76 },
      { name: "Arms", percent: 70 },
    ],
  },
  strength: { changePercent: 18, trend: [40, 45, 42, 55, 58, 62, 68] },
  calories: { consumed: 842, goal: 2000 },
  recentWorkout: {
    name: "Push Day",
    when: "Today",
    duration: "60 min",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
  },
};
