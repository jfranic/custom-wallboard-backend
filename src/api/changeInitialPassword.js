const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const changeInitialPasswordValidation = require('../utils/changeInitialPasswordValidation');
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {
        const changeInitialPasswordValidationResponse = changeInitialPasswordValidation.handler(event.body);

        if (!changeInitialPasswordValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: changeInitialPasswordValidationResponse.errorMessage });
        }

        const { username, password, session } = JSON.parse(event.body)
        const { userPoolId, userPoolClientId } = process.env

        const params = {
            UserPoolId: userPoolId,
            ClientId: userPoolClientId,
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ChallengeResponses: {
                'USERNAME': username,
                'NEW_PASSWORD': password
            },
            Session: session
        }

        const adminRespondToAuthChallengeResponse = await cognito.adminRespondToAuthChallenge(params).promise();

        const adminUpdateUserAttributesParams = {
            UserPoolId: userPoolId,
            Username: username,
            UserAttributes: [
                {
                    Name: 'email_verified',
                    Value: 'true'
                }
            ]
        }

        const adminUpdateUserAttributesParamsResponse = await cognito.adminUpdateUserAttributes(adminUpdateUserAttributesParams).promise();

        return generateResponse.handler(200, { successMessage: 'Login successful.', accessToken: adminRespondToAuthChallengeResponse.AuthenticationResult.AccessToken })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage })
    }
}