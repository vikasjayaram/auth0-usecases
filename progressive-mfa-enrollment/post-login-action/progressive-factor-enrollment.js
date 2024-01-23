/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
    const enrolledFactors = event.user.enrolledFactors || [];
    if (!event.user.email_verified || enrolledFactors.length === 0) {
      return api.access.deny("PLease verify your email before logging in");
    }
    // Progressive Enrollment
    const requiresEnrollment = event.transaction?.acr_values.includes(
        'http://schemas.openid.net/pape/policies/2007/06/multi-factor'
      );
    // Provides users with options to enroll, acr_values are sent from the app during /authorize call.
    if (requiresEnrollment) {
      return api.multifactor.enable('any', {allowRememberBrowser: true});
    }
    // Challenge for Email MFA
    const isEmailOnlyMFA = enrolledFactors.length === 1 && enrolledFactors[0].type === 'email';
    if (event.user.email_verified && isEmailOnlyMFA) {
      api.idToken.setCustomClaim("mfa_warning", true);
      api.authentication.challengeWith({ type: 'email' });
    } else {
      // Challenge with enrolled factors.
      api.multifactor.enable('any', {allowRememberBrowser: true});
    }
  };
  
  /**
  * Handler that will be invoked when this action is resuming after an external redirect. If your
  * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
  *
  * @param {Event} event - Details about the user and the context in which they are logging in.
  * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
  */
  // exports.onContinuePostLogin = async (event, api) => {
  // };
  