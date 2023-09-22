const AWS = require('aws-sdk');
const generateResponse = require('../utils/generateResponse');
const generatePassword = require('../utils/generatePassword');

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {

    const adminUsername = process.env.adminUsername;
    const adminEmail = process.env.adminEmail;
    const userPoolId = process.env.userPoolId;
    const adminUserGroup = process.env.adminUserGroup;

    const passwordLength = 8;
    const adminPassword = generatePassword.handler(passwordLength);
    const params = {
      UserPoolId: userPoolId,
      Username: adminUsername,
      TemporaryPassword: adminPassword,
      UserAttributes: [
        {
          Name: 'email',
          Value: adminEmail
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ]
    }

    const response = await cognito.adminCreateUser(params).promise();

    if (response.User) {
      const paramsForAddToGroup = {
        GroupName: adminUserGroup,
        UserPoolId: userPoolId,
        Username: adminUsername
      };
      await cognito.adminAddUserToGroup(paramsForAddToGroup).promise();
    }

    return generateResponse.handler(200, { successMessage: 'Admin user created successfully.' })

  } catch (error) {
    const errorMessage = error.message ? error.message : 'Internal server error.'
    return generateResponse.handler(500, { errorMessage })
  }
};