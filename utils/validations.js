export const validateSignupRequest = (email, password) => {
  // Regular expression for validating an Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate email
  const isEmailValid = emailRegex.test(email);

  // Password validation criteria
  const minLength = 6;
  const maxLength = 25;

  // Validate password
  const isPasswordValid =
    password.length >= minLength && password.length <= maxLength;
  //  /[A-Z]/.test(password) && // Contains uppercase
  // /[a-z]/.test(password) && // Contains lowercase
  // /\d/.test(password) && // Contains digit
  // /[!@#$%^&*()_+[\]{}|;:,.<>?/~`]/.test(password); // Contains special character

  return {
    isEmailValid,
    isPasswordValid,
  };
};
