const { resolve } = require('path');

const successTemplate = `
{
  "errcode": 0,
  "data": $data
}
`;

const errorTemplate = `
{
  "errcode": 999999,
  "errmsg": $message,
}
`;

module.exports = {
  port: 9876,
  dir: resolve(__dirname, './mock'),
  tsRoot: __dirname,
  template: {
    success: successTemplate,
    error: errorTemplate
  }
}