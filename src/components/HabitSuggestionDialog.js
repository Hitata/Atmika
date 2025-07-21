import React from 'react';

export default function HabitSuggestionDialog({ habit, onAccept, onDecline }) {
  if (!habit) return null;

  return (
    <div className="habit-suggestion-overlay">
      <div className="habit-suggestion-dialog">
        <h3>New Habit Suggestion</h3>
        <p>You've frequently added the task: <strong>{habit.name}</strong>.</p>
        <p>Would you like to add it as a habit?</p>
        <div className="habit-suggestion-buttons">
          <button onClick={onAccept} className="accept-btn">
            ✅ Yes, add it
          </button>
          <button onClick={onDecline} className="decline-btn">
            ❌ No, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
