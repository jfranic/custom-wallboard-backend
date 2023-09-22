const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const { accessToken, previousPassword, proposedPassword } = JSON.parse(event.body)

        const params = {
            AccessToken: accessToken,
            PreviousPassword: previousPassword,
            ProposedPassword: proposedPassword
        }

        await cognito.changePassword(params).promise();

        return generateResponse.handler(200, { successMessage: 'User password successfully changed.' })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage });
    }
}
