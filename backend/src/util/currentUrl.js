// setting sever url
const development = "http://localhost:8000/";
const production = "";
const currentUrl = process.env.NODE_ENV ? production : development;

module.exports = currentUrl;
