const testExamination = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/examinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: 2,
        doctor_id: 2,
        examination_type: 'Physical',
        findings: 'Normal',
        recommendations: 'Continue current treatment',
        notes: 'Test examination'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testExamination(); 