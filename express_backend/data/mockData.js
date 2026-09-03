const USERS = [
  { id: "P001", email: "patient@example.com", password: "password123", name: "John Doe", role: "PATIENT" },
  { id: "C001", email: "caregiver@example.com", password: "password123", name: "Sarah Caregiver", role: "CAREGIVER" }
];

const MOCK_PATIENT = {
  id: "P001",
  name: "John Doe",
  age: 72,
  diagnosis: "Mild Cognitive Impairment",
  streak: 5,
  activitiesCompleted: 14
};

const MOCK_ACTIVITIES = [
  { id: "A101", title: "Pattern Match", category: "Pattern Recognition", durationMinutes: 5 },
  { id: "A102", title: "Daily Routine Recall", category: "Memory & Recall", durationMinutes: 10 }
];

const MOCK_MEDICATIONS = [
  { id: "M01", name: "Donepezil", dosage: "5mg", time: "08:00 AM", taken: true },
  { id: "M02", name: "Memantine", dosage: "10mg", time: "08:00 PM", taken: false }
];

const MOCK_REMINDERS = [
  { id: "R01", title: "Drink Water", time: "02:00 PM", status: "PENDING" },
  { id: "R02", title: "Evening Walk", time: "05:00 PM", status: "PENDING" }
];

const MOCK_HISTORY = [
  { date: "2026-09-02", activity: "Pattern Match", score: 90 },
  { date: "2026-09-03", activity: "Daily Routine Recall", score: 80 }
];

const MOCK_ALERTS = [
  { id: "ALT01", patient_id: "P001", type: "MISSED_ACTIVITY", message: "Missed 2:00 PM Hydration Reminder", timestamp: new Date().toISOString() }
];

module.exports = {
  USERS,
  MOCK_PATIENT,
  MOCK_ACTIVITIES,
  MOCK_MEDICATIONS,
  MOCK_REMINDERS,
  MOCK_HISTORY,
  MOCK_ALERTS
};