const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider()
const generateResponse = require('../utils/generateResponse');

module.exports.handler = async (event) => {
    try {

        const { userPoolId, guestUserGroup } = process.env
        
        const params = {
            GroupName: guestUserGroup,
            UserPoolId: userPoolId
        }

        const userList = await cognito.listUsersInGroup(params).promise();

        return generateResponse.handler(200, { successMessage: 'Users retrieved successfully.', data: userList })

    }
    catch (error) {
        const errorMessage = error.message ? error.message : 'Internal server error.'
        return generateResponse.handler(500, { errorMessage });
    }
}
