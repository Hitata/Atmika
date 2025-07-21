/**
 * @file This file defines the database schema for the Voice Task Manager application.
 * It uses a JavaScript object-based format that can be used for documentation,
 * validation, or as a blueprint for database migration scripts (e.g., with an ORM).
 */

// --- Core Entity Tables ---

export const User = {
  name: 'User',
  columns: {
    user_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the user.' },
    name: { type: 'VARCHAR(255)', description: 'User's display name.' },
    device_id: { type: 'VARCHAR(255)', description: 'Unique identifier for the user's primary device.' },
    mood_state: { type: "ENUM('happy', 'neutral', 'sad', 'motivated', 'stressed')", description: 'The user's current mood state.' },
    created_at: { type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP', description: 'Timestamp of account creation.' },
  },
};

export const TaskType = {
  name: 'TaskType',
  columns: {
    task_type_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the task type.' },
    name: { type: 'VARCHAR(255)', description: 'Name of the task type (e.g., 'Work', 'Exercise').' },
    example: { type: 'TEXT', description: 'An example of this type of task.' },
  },
};

export const Set = {
  name: 'Set',
  columns: {
    set_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the set.' },
    name: { type: 'VARCHAR(255)', description: 'Name of the set (e.g., 'Morning Routine').' },
    description: { type: 'TEXT', description: 'A brief description of the set.' },
  },
};

export const Goal = {
  name: 'Goal',
  columns: {
    goal_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the goal.' },
    name: { type: 'VARCHAR(255)', description: 'Name of the goal (e.g., 'Learn Guitar').' },
    purpose: { type: 'TEXT', description: 'The underlying purpose or "why" of the goal.' },
  },
};

export const ContextTag = {
  name: 'ContextTag',
  columns: {
    context_tag_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the context tag.' },
    name: { type: 'VARCHAR(255)', description: 'Name of the context (e.g., 'At Home', 'Commuting').' },
    start_time: { type: 'TIME', nullable: true, description: 'The start of the time window for this context.' },
    end_time: { type: 'TIME', nullable: true, description: 'The end of the time window for this context.' },
  },
};

export const EmotionTag = {
  name: 'EmotionTag',
  columns: {
    emotion_tag_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the emotion tag.' },
    name: { type: 'VARCHAR(255)', description: 'Name of the emotion (e.g., 'Stressed', 'Motivated').' },
    description: { type: 'TEXT', description: 'A brief description of the emotion.' },
  },
};

export const Task = {
  name: 'Task',
  columns: {
    task_id: { type: 'SERIAL PRIMARY KEY', description: 'Unique identifier for the task.' },
    user_id: { type: 'INTEGER', isForeignKey: true, references: 'User(user_id)', description: 'The user who owns the task.' },
    task_type_id: { type: 'INTEGER', isForeignKey: true, references: 'TaskType(task_type_id)', description: 'The type of the task.' },
    title: { type: 'VARCHAR(255)', description: 'The title of the task.' },
    description: { type: 'TEXT', nullable: true, description: 'A detailed description of the task.' },
    duration_minutes: { type: 'INTEGER', description: 'Estimated duration to complete the task in minutes.' },
    created_at: { type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP', description: 'Timestamp of when the task was created.' },
    completed_at: { type: 'TIMESTAMP', nullable: true, description: 'Timestamp of when the task was completed.' },
    is_logged_by_voice: { type: 'BOOLEAN', default: false, description: 'Whether the task was logged via voice input.' },
  },
};


// --- Junction Tables for Many-to-Many Relationships ---

export const Task_Goals = {
  name: 'Task_Goals',
  columns: {
    task_id: { type: 'INTEGER', isForeignKey: true, references: 'Task(task_id)', partOfPrimaryKey: true },
    goal_id: { type: 'INTEGER', isForeignKey: true, references: 'Goal(goal_id)', partOfPrimaryKey: true },
  },
  description: 'Links tasks to the goals they are part of.',
};

export const Task_Sets = {
  name: 'Task_Sets',
  columns: {
    task_id: { type: 'INTEGER', isForeignKey: true, references: 'Task(task_id)', partOfPrimaryKey: true },
    set_id: { type: 'INTEGER', isForeignKey: true, references: 'Set(set_id)', partofPrimaryKey: true },
  },
  description: 'Links tasks to the sets they belong to.',
};

export const Task_ContextTags = {
  name: 'Task_ContextTags',
  columns: {
    task_id: { type: 'INTEGER', isForeignKey: true, references: 'Task(task_id)', partOfPrimaryKey: true },
    context_tag_id: { type: 'INTEGER', isForeignKey: true, references: 'ContextTag(context_tag_id)', partOfPrimaryKey: true },
  },
  description: 'Links tasks to various contexts.',
};

export const Task_EmotionTags = {
  name: 'Task_EmotionTags',
  columns: {
    task_id: { type: 'INTEGER', isForeignKey: true, references: 'Task(task_id)', partOfPrimaryKey: true },
    emotion_tag_id: { type: 'INTEGER', isForeignKey: true, references: 'EmotionTag(emotion_tag_id)', partOfPrimaryKey: true },
  },
  description: 'Links tasks to the emotions felt when creating them.',
};