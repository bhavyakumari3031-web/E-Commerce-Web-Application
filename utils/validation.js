function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

module.exports = { isValidEmail, required };
