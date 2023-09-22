function inviteValidation(data) {
  try {
    const { username, email } = JSON.parse(data);

    // Check if username and email are provided
    if (!username || !email) {
      return {
        isValid: false,
        errorMessage: 'Username and email are required fields.',
      };
    }

    // Check username length (minimum 5 characters)
    if (username.length < 5) {
      return {
        isValid: false,
        errorMessage: 'Username must be at least 5 characters long.',
      };
    }

    // Check email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        errorMessage: 'Invalid email format.',
      };
    }

    // If all validations pass, return isValid as true
    return { isValid: true };
  } catch (error) {
    // Return error response if JSON parsing fails
    return {
      isValid: false,
      errorMessage: 'Invalid JSON format in the request body.',
    };
  }
}

module.exports.handler = inviteValidation;