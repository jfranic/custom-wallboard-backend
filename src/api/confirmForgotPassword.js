const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const confirmForgotPasswordValidation = require('../utils/confirmForgotPasswordValidation');
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const confirmForgotPasswordValidationResponse = confirmForgotPasswordValidation.handler(event.body);

        if (!confirmForgotPasswordValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: confirmForgotPasswordValidationResponse.errorMessage });
        }

        const { username, password, confirmationCode } = JSON.parse(event.body)
        const { userPoolClientId } = process.env
        const params = {
            ClientId: userPoolClientId,
            Username: username,
            ConfirmationCode: confirmationCode,
            Password: password
        }

        await cognito.confirmForgotPassword(params).promise();

        return generateResponse.handler(200, { successMessage: 'Password changed successfully.' })
    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage })
    }
}
