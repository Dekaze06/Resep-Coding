async function testGoogleEndpoint() {
    try {
        const res = await fetch('http://localhost:4321/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInfo: {
                    email: 'dekaze08@gmail.com',
                    name: 'Dekaze Admin',
                    picture: 'https://api.dicebear.com/7.x/initials/svg?seed=Dekaze'
                }
            })
        });

        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

testGoogleEndpoint();
