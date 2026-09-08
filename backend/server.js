const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { PORT, JWT_SECRET } = require('./config/constants.js');

// 1. Destructure BOTH middleware functions here
const { authenticateToken, requireRole } = require('./middleware/auth.middleware');

const {
  USERS,
  MOCK_PATIENT,
  MOCK_ACTIVITIES,
  MOCK_MEDICATIONS,
  MOCK_REMINDERS,
  MOCK_HISTORY,
  MOCK_ALERTS
} = require('./data/mockData');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Helper function to format patient data consistently to snake_case
const formatPatient = (patient) => ({
  id: patient.id,
  name: patient.name,
  email: patient.email,
  age: patient.age,
  diagnosis: patient.diagnosis,
  activities_completed: patient.activitiesCompleted ?? patient.activities_completed ?? 0,
  current_streak: patient.streak ?? patient.current_streak ?? 0
});

// Helper function to format activity data to snake_case
const formatActivity = (activity) => ({
  id: activity.id,
  title: activity.title,
  category: activity.category,
  duration_minutes: activity.durationMinutes ?? activity.duration_minutes ?? 0,
  difficulty_level: activity.difficultyLevel ?? activity.difficulty_level ?? "EASY"
});

// ==========================================
// 1. AUTHENTICATION (PUBLIC)
// ==========================================
app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  let user = USERS.find(u => u.email === email);

  if (!user) {
    const role = email && email.includes('caregiver') ? 'CAREGIVER' : 'PATIENT';
    user = {
      id: role === 'PATIENT' ? 'P001' : 'C001',
      email: email || 'user@example.com',
      name: email ? email.split('@')[0] : 'Demo User',
      role: role
    };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    access_token: token,
    token_type: "bearer",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ==========================================
// 2. PATIENT ROUTES (PROTECTED - PATIENT ONLY)
// ==========================================
app.get('/patients/me', authenticateToken, requireRole('PATIENT'), (req, res) => {
  res.json(formatPatient(MOCK_PATIENT));
});

app.get('/patients/me/progress', authenticateToken, requireRole('PATIENT'), (req, res) => {
  res.json({
    activities_completed: MOCK_PATIENT.activitiesCompleted ?? MOCK_PATIENT.activities_completed ?? 0,
    current_streak: MOCK_PATIENT.streak ?? MOCK_PATIENT.current_streak ?? 0
  });
});

app.get('/patients/me/reminders', authenticateToken, requireRole('PATIENT'), (req, res) => {
  res.json(MOCK_REMINDERS);
});

app.get('/patients/me/medications', authenticateToken, requireRole('PATIENT'), (req, res) => {
  res.json(MOCK_MEDICATIONS);
});

// ==========================================
// 3. ACTIVITIES (PROTECTED - PATIENT & CAREGIVER)
// ==========================================
app.get('/activities', authenticateToken, requireRole('PATIENT', 'CAREGIVER'), (req, res) => {
  res.json(MOCK_ACTIVITIES.map(formatActivity));
});

app.get('/activities/:id', authenticateToken, requireRole('PATIENT', 'CAREGIVER'), (req, res) => {
  const activity = MOCK_ACTIVITIES.find(a => a.id === req.params.id) || MOCK_ACTIVITIES[0];
  res.json(formatActivity(activity));
});

app.post('/activities/:id/sessions', authenticateToken, requireRole('PATIENT'), (req, res) => {
  res.status(201).json({
    session_id: "S_" + Date.now(),
    activity_id: req.params.id,
    status: "STARTED",
    started_at: new Date().toISOString()
  });
});

app.post('/activities/:id/sessions/:session_id/complete', authenticateToken, requireRole('PATIENT'), (req, res) => {
  const { score } = req.body;

  res.json({
    session_id: req.params.session_id,
    status: "COMPLETED",
    score: typeof score === 'number' ? score : (parseInt(score, 10) || 0),
    adaptation_next_level: "MEDIUM"
  });
});

// ==========================================
// 4. CAREGIVER ROUTES (PROTECTED - CAREGIVER ONLY)
// ==========================================
app.get('/caregiver/patients', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json([formatPatient(MOCK_PATIENT)]);
});

app.get('/caregiver/patients/:id', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json(formatPatient(MOCK_PATIENT));
});

app.get('/caregiver/patients/:id/history', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json(MOCK_HISTORY);
});

app.get('/caregiver/patients/:id/progress', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json({ 
    weekly_completion_rate: "85%", 
    memory_trend: "Stable" 
  });
});

app.get('/caregiver/patients/:id/medications', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json(MOCK_MEDICATIONS);
});

app.get('/caregiver/alerts', authenticateToken, requireRole('CAREGIVER'), (req, res) => {
  res.json(MOCK_ALERTS);
});



// ==========================================
// 5. AI ENGINE ADAPTATION ROUTE
// ==========================================
app.post('/activities/evaluate-session', async (req, res) => {
  const { patient_id, recent_sessions } = req.body;

  // Use imported MOCK_PATIENT or default object
  let patient = (MOCK_PATIENT && MOCK_PATIENT.id === patient_id) 
    ? MOCK_PATIENT 
    : { id: patient_id, current_difficulty: 1 };

  try {
    // Forward payload to FastAPI Python engine running on 8000
    const pyResponse = await fetch('http://127.0.0.1:8000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: {
          patient_id: patient.id,
          current_difficulty: patient.current_difficulty || 1
        },
        sessions: recent_sessions || []
      })
    });

    if (!pyResponse.ok) {
      throw new Error(`FastAPI returned status ${pyResponse.status}`);
    }

    const adaptation = await pyResponse.json();

    // Mutate in-memory state
    patient.current_difficulty = adaptation.new_difficulty;
    patient.last_performance_score = adaptation.performance_score;

    res.json({
      status: 'success',
      adaptation,
      updated_mock_patient: patient
    });
  } catch (err) {
    res.status(500).json({ error: 'FastAPI engine unreachable', details: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n Express Server running cleanly on port ${PORT}`);
});
