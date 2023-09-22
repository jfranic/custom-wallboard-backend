const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const forgotPasswordValidation = require('../utils/forgotPasswordValidation');
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const forgotPasswordValidationResponse = forgotPasswordValidation.handler(event.body);

        if (!forgotPasswordValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: forgotPasswordValidationResponse.errorMessage });
        }

        const { username } = JSON.parse(event.body)
        const { userPoolClientId } = process.env
        const params = {
            ClientId: userPoolClientId,
            Username: username,
        }

        await cognito.forgotPassword(params).promise();

        return generateResponse.handler(200, { successMessage: 'Forgot password email has been sent.' })
    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage })
    }
}
