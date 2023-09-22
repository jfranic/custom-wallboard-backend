const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const inviteValidation = require('../utils/inviteValidation');
const generateResponse = require('../utils/generateResponse');
const generatePassword = require('../utils/generatePassword');

module.exports.handler = async (event) => {
    try {

        const inviteValidationResponse = inviteValidation.handler(event.body);

        if (!inviteValidationResponse.isValid) {
            return generateResponse.handler(400, { errorMessage: inviteValidationResponse.errorMessage });
        }

        const { username, email } = JSON.parse(event.body)
        const { userPoolId, guestUserGroup } = process.env

        const passwordLength = 8;
        const guestPassword = generatePassword.handler(passwordLength);
        const params = {
            UserPoolId: userPoolId,
            Username: username,
            TemporaryPassword: guestPassword,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'false'
                }
            ]
        }

        const response = await cognito.adminCreateUser(params).promise();

        if (response.User) {
            const paramsForAddToGroup = {
                GroupName: guestUserGroup,
                UserPoolId: userPoolId,
                Username: username
            };
            await cognito.adminAddUserToGroup(paramsForAddToGroup).promise();
        }

        return generateResponse.handler(200, { successMessage: 'Guest user created successfully.' })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage });
    }
}
