const fetch = require('node-fetch')

async function testLogin() {
  try {
    console.log('🔄 Test de connexion...')
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
      })
    })
    
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Response:', data)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

testLogin()



