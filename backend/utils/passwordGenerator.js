// Generate a secure random password
export const generatePassword = (length = 12) => {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  let password = '';
  
  // Ensure at least one character from each category
  password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];
  
  // Fill the rest with random characters
  const allChars = charset.lowercase + charset.uppercase + charset.numbers + charset.symbols;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to make it more random
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate a temporary password for password reset
export const generateTemporaryPassword = () => {
  return generatePassword(8);
};

