const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const deleteUserValidation = require('../utils/deleteUserValidation');
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const deleteUserValidationResponse = deleteUserValidation.handler(event.body);

        if (!deleteUserValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: deleteUserValidationResponse.errorMessage });
        }

        const { username } = JSON.parse(event.body)
        const { userPoolId } = process.env
        
        const params = {
            UserPoolId: userPoolId,
            Username: username
        }

        await cognito.adminDeleteUser(params).promise();

        return generateResponse.handler(200, { successMessage: 'Guest user deleted successfully.' })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage });
    }
}
