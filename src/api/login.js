const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const loginValidation = require('../utils/loginValidation');
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {
        const loginValidationResponse = loginValidation.handler(event.body);

        if (!loginValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: loginValidationResponse.errorMessage });
        }

        const { username, password } = JSON.parse(event.body)
        const { userPoolClientId } = process.env

        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: userPoolClientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        }

        const initiateAuthResponse = await cognito.initiateAuth(params).promise();

        console.log(initiateAuthResponse);

        if (initiateAuthResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            return generateResponse.handler(200, { successMessage: 'New password required.', session: initiateAuthResponse.Session })
        } else {
            return generateResponse.handler(200, { successMessage: 'Login successful.', accessToken: initiateAuthResponse.AuthenticationResult.AccessToken })
        }
    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage })
    }
}