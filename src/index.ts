import express from 'express';
import schema from './schema';
import faker from "./faker";
import response from "./response";
import configure from "./configure";

const generate = async (method: string, requestPath: string) => {
  const res = await schema.generate(method, requestPath);
  return faker.generate(res);
};

const startServer = () => {
  const app = express();
  app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', req.get('origin'));
    res.set('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.set('Access-Control-Max-Age', 86400);
    res.end();
  });
  app.use('*', (req, res) => {
    generate(req.method, req.baseUrl)
      .then((data) => {
        res.set('Access-Control-Allow-Origin', req.get('origin'));
        res.end(response.generate({
          data
        }, 'success'));
      }).catch((err) => {
        res.set('Access-Control-Allow-Origin', req.get('origin'));
        res.end(response.generate({
          message: err.message || ''
        }, 'error'));
        res.statusCode = 404;
      });
  });

  const port = configure.get('port') || 9876;
  app.listen(port);
  console.log(`server started at http://127.0.0.1:${port}`);
}

exports.start = (config) => {
  configure.init(config);
  startServer();
}