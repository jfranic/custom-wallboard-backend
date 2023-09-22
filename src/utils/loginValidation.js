function loginValidation(data) {
  try {
      const { username, password } = JSON.parse(data);

      if (!username || !password) {
          return {
              isValid: false,
              errorMessage: 'Username and password are required fields.',
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

module.exports.handler = loginValidation;