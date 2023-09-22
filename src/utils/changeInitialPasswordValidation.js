function changeInitialPasswordValidation(data) {
  try {
      const { username, password, session } = JSON.parse(data);

      if (!username || !password || !session) {
          return {
              isValid: false,
              errorMessage: 'Username, password and session are required fields.',
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

module.exports.handler = changeInitialPasswordValidation;