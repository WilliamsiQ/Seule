//cross origin resource sharing
const allowedOrigin = [
  
  "http://127.0.0.1:5500",
  "http://localhost:3500",
]; // domains that can access backend server of course the last two in the array should be omitted

module.exports = allowedOrigin;
