const testPatient = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1990-01-01',
        email: 'john@test.com',
        phone_number: '1234567890',
        gender: 'Male',
        address: '123 Test St',
        blood_type: 'A+',
        emergency_contact_name: 'Jane Doe',
        emergency_contact_phone: '0987654321',
        allergies: 'None',
        medical_history: 'None',
        insurance: 'Test Insurance'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testPatient(); 