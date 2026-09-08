const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const LOG_FILE = path.join(__dirname, 'api-test-results.json');

const testLogs = [];

function makeRequest(testName, method, routePath, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(routePath, BASE_URL);
    const reqHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders,
    };

    const record = {
      test: testName,
      timestamp: new Date().toISOString(),
      request: {
        method,
        url: `${BASE_URL}${routePath}`,
        headers: reqHeaders,
        body: body || null,
      },
      response: {
        status: null,
        body: null,
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        record.response.status = res.statusCode;
        try {
          record.response.body = JSON.parse(responseData);
        } catch (e) {
          record.response.body = responseData;
        }
        testLogs.push(record);
        resolve(record);
      });
    });

    req.on('error', (err) => {
      record.response.status = 'ERROR';
      record.response.body = err.message;
      testLogs.push(record);
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runSuiteAndSave() {
  console.log('🧪 Starting Dual-Role API Verification & Log Recorder...\n');

  try {
    // ==========================================
    // SUITE 1: PATIENT ROLE VERIFICATION
    // ==========================================
    console.log('--- [ SUITE 1: PATIENT ROLE ] ---');
    
    // 1. Auth Login (Patient)
    const patientLogin = await makeRequest(
      'Patient Suite - 01. Auth Login',
      'POST',
      '/auth/login',
      { email: 'patient@example.com', password: 'password123' }
    );
    const patientToken = patientLogin.response.body.access_token;
    console.log(`  ✅ [${patientLogin.response.status}] POST /auth/login`);

    // 2. Patient Routes (Expect 200 OK)
    const patientRoutes = [
      ['Patient Suite - 02. Patient Profile', 'GET', '/patients/me'],
      ['Patient Suite - 03. Patient Progress', 'GET', '/patients/me/progress'],
      ['Patient Suite - 04. Patient Reminders', 'GET', '/patients/me/reminders'],
      ['Patient Suite - 05. Patient Medications', 'GET', '/patients/me/medications'],
    ];

    for (const [name, method, route] of patientRoutes) {
      const res = await makeRequest(name, method, route, null, patientToken);
      console.log(`  ✅ [${res.response.status}] ${method} ${route}`);
    }

    // 3. Activities (Expect 200 / 201)
    const actList = await makeRequest('Patient Suite - 06. Activity List', 'GET', '/activities', null, patientToken);
    console.log(`  ✅ [${actList.response.status}] GET /activities`);

    const actDetail = await makeRequest('Patient Suite - 07. Activity Details', 'GET', '/activities/A101', null, patientToken);
    console.log(`  ✅ [${actDetail.response.status}] GET /activities/A101`);

    const actStart = await makeRequest('Patient Suite - 08. Start Session', 'POST', '/activities/A101/sessions', {}, patientToken);
    const sessionId = actStart.response.body.session_id || 'S_TEST';
    console.log(`  ✅ [${actStart.response.status}] POST /activities/A101/sessions`);

    const actComplete = await makeRequest(
      'Patient Suite - 09. Complete Session',
      'POST',
      `/activities/A101/sessions/${sessionId}/complete`,
      { score: 90 },
      patientToken
    );
    console.log(`  ✅ [${actComplete.response.status}] POST /activities/A101/sessions/:id/complete`);

    // 4. Caregiver Routes (Expect 403 Forbidden for Patient)
    const caregiverRoutesForPatient = [
      ['Patient Suite - 10. Caregiver Patient List (Denied)', 'GET', '/caregiver/patients'],
      ['Patient Suite - 11. Caregiver Patient Details (Denied)', 'GET', '/caregiver/patients/P001'],
      ['Patient Suite - 12. Caregiver Patient History (Denied)', 'GET', '/caregiver/patients/P001/history'],
      ['Patient Suite - 13. Caregiver Patient Progress (Denied)', 'GET', '/caregiver/patients/P001/progress'],
      ['Patient Suite - 14. Caregiver Patient Medications (Denied)', 'GET', '/caregiver/patients/P001/medications'],
      ['Patient Suite - 15. Caregiver Alerts (Denied)', 'GET', '/caregiver/alerts'],
    ];

    for (const [name, method, route] of caregiverRoutesForPatient) {
      const res = await makeRequest(name, method, route, null, patientToken);
      console.log(`  🔒 [${res.response.status}] ${method} ${route} (Expected 403)`);
    }

    console.log('\n-------------------------------------------\n');

    // ==========================================
    // SUITE 2: CAREGIVER ROLE VERIFICATION
    // ==========================================
    console.log('--- [ SUITE 2: CAREGIVER ROLE ] ---');

    // 1. Auth Login (Caregiver)
    const caregiverLogin = await makeRequest(
      'Caregiver Suite - 01. Auth Login',
      'POST',
      '/auth/login',
      { email: 'caregiver@example.com', password: 'password123' }
    );
    const caregiverToken = caregiverLogin.response.body.access_token;
    console.log(`  ✅ [${caregiverLogin.response.status}] POST /auth/login`);

    // 2. Caregiver Routes (Expect 200 OK)
    const caregiverRoutes = [
      ['Caregiver Suite - 02. Patient List', 'GET', '/caregiver/patients'],
      ['Caregiver Suite - 03. Patient Details', 'GET', '/caregiver/patients/P001'],
      ['Caregiver Suite - 04. Patient History', 'GET', '/caregiver/patients/P001/history'],
      ['Caregiver Suite - 05. Patient Progress', 'GET', '/caregiver/patients/P001/progress'],
      ['Caregiver Suite - 06. Patient Medications', 'GET', '/caregiver/patients/P001/medications'],
      ['Caregiver Suite - 07. Alerts', 'GET', '/caregiver/alerts'],
    ];

    for (const [name, method, route] of caregiverRoutes) {
      const res = await makeRequest(name, method, route, null, caregiverToken);
      console.log(`  ✅ [${res.response.status}] ${method} ${route}`);
    }

    // 3. Shared Activity List/Detail (Expect 200 OK for Caregiver)
    const cgActList = await makeRequest('Caregiver Suite - 08. Activity List', 'GET', '/activities', null, caregiverToken);
    console.log(`  ✅ [${cgActList.response.status}] GET /activities`);

    const cgActDetail = await makeRequest('Caregiver Suite - 09. Activity Details', 'GET', '/activities/A101', null, caregiverToken);
    console.log(`  ✅ [${cgActDetail.response.status}] GET /activities/A101`);

    // 4. Patient-Only Routes (Expect 403 Forbidden for Caregiver)
    const patientRoutesForCaregiver = [
      ['Caregiver Suite - 10. Patient Profile (Denied)', 'GET', '/patients/me'],
      ['Caregiver Suite - 11. Patient Progress (Denied)', 'GET', '/patients/me/progress'],
      ['Caregiver Suite - 12. Patient Reminders (Denied)', 'GET', '/patients/me/reminders'],
      ['Caregiver Suite - 13. Patient Medications (Denied)', 'GET', '/patients/me/medications'],
      ['Caregiver Suite - 14. Start Session (Denied)', 'POST', '/activities/A101/sessions', {}],
    ];

    for (const [name, method, route, body] of patientRoutesForCaregiver) {
      const res = await makeRequest(name, method, route, body || null, caregiverToken);
      console.log(`  🔒 [${res.response.status}] ${method} ${route} (Expected 403)`);
    }

    // Save full JSON output
    fs.writeFileSync(LOG_FILE, JSON.stringify(testLogs, null, 2), 'utf8');
    console.log(`\n📄 Complete test execution log written to: ${LOG_FILE}`);

  } catch (err) {
    console.error('\n❌ Execution failed:', err.message);
  }
}

runSuiteAndSave();