const bcrypt = require('bcryptjs');

const password = 'karta123'; // The password to hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    console.log('Hashed Password:', hash);
});
