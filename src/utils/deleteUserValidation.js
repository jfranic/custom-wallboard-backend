function deleteUserValidation(data) {
  try {
      const { username } = JSON.parse(data);

      if (!username) {
          return {
              isValid: false,
              errorMessage: 'Username is required field.',
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

module.exports.handler = deleteUserValidation;