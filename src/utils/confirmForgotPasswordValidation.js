function confirmForgotPasswordValidation(data) {
  try {
    const { username, password, confirmationCode } = JSON.parse(data);

    if (!username || !password || !confirmationCode) {
      return {
        isValid: false,
        errorMessage: 'Username, password and confirmation code are required fields.',
      };
    }
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: 'Invalid JSON format in the request body.',
    };
  }
}

module.exports.handler = confirmForgotPasswordValidation;