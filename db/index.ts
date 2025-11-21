import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: any;

if (Platform.OS === 'web') {
  db = {
    execSync: () => { },
    runSync: () => ({ lastInsertRowId: 1 }),
    getAllSync: () => [],
    withTransactionSync: (cb: () => void) => cb(),
  };
} else {
  db = SQLite.openDatabaseSync('gym_tracker.db');
}

export { db };

export const initDatabase = () => {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      weight REAL,
      height REAL,
      goal TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      muscle_group TEXT,
      is_custom INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      set_order INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts (id),
      FOREIGN KEY (exercise_id) REFERENCES exercises (id)
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts (id),
      FOREIGN KEY (exercise_id) REFERENCES exercises (id)
    );

    CREATE TABLE IF NOT EXISTS workout_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS template_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (template_id) REFERENCES workout_templates (id),
      FOREIGN KEY (exercise_id) REFERENCES exercises (id)
    );
  `);

  // Seed initial exercises if empty
  const result = db.getAllSync('SELECT count(*) as count FROM exercises');
  // @ts-ignore
  if (result[0].count === 0) {
    const exercises = [
      ['Bench Press', 'Chest'],
      ['Squat', 'Legs'],
      ['Deadlift', 'Back'],
      ['Overhead Press', 'Shoulders'],
      ['Pull Up', 'Back'],
      ['Dumbbell Curl', 'Biceps'],
      ['Tricep Extension', 'Triceps'],
      ['Lat Pulldown', 'Back'],
      ['Leg Press', 'Legs'],
      ['Lunge', 'Legs']
    ];

    exercises.forEach(([name, muscle]) => {
      db.runSync('INSERT INTO exercises (name, muscle_group) VALUES (?, ?)', [name, muscle]);
    });
  }
};
