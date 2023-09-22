const customMessageTrigger = async (event) => {

  console.log(event)
  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    const message = `Welcome to the custom wallboard service. Your user name is ${event.request.usernameParameter}. Your temporary password is ${event.request.codeParameter}`;

    event.response.emailMessage = message;
    event.response.emailSubject = "Welcome - Custom Wallboard";
  }
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const message = `Hi ${event.userName}, use this code (${event.request.codeParameter}) to change your password.`;

    event.response.emailMessage = message;
    event.response.emailSubject = "Password Change - Custom Wallboard";
  }

  console.log(event)
  return event;
};

module.exports.handler = customMessageTrigger;