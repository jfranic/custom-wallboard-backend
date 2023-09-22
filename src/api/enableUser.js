const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const { username } = JSON.parse(event.body)
        const { userPoolId } = process.env
        
        const params = {
            Username: username,
            UserPoolId: userPoolId
        }

        await cognito.adminEnableUser(params).promise();

        return generateResponse.handler(200, { successMessage: 'Guest user successfully enabled.' })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage });
    }
}
