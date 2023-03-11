import express from 'express';
import { pathExists } from 'fs-extra';
import { resolve } from 'path';
import { getProgramFromFiles, buildGenerator, Definition } from 'typescript-json-schema';
import { JSONSchemaFaker, Schema } from 'json-schema-faker';

let mockConfig: {
  port: number;
  dir: string;
  tsRoot: string;
  template: {
    success: string;
    error: string;
  }
};

const generateResponse = (response: {data?: any; message?: string}, templateType: string) => {
  const ctx = {
    $data: JSON.stringify(response.data),
    $message: JSON.stringify(response.message)
  }
  const template = mockConfig.template[templateType];
  if (!template) {
    return ctx.$data;
  }

  return template.replace(/\$data|\$message/g, ($0) => {
    return ctx[$0] || 'null';
  });
}

const buildDefinitionFilePath = (requestPath: string) => {
  if (requestPath.endsWith('/')) {
    requestPath += 'index';
  }
  const parts = requestPath.split('/').filter(i => i);
  if (parts.length === 0) {
    parts.push('index');
  }
  return parts.join('/') + '.ts';
}

const definitionFileExists = async (filePath: string) => {
  return await pathExists(filePath);
}

const generateSchame = (file: string, symbol: string) => {
  const program = getProgramFromFiles([file], {}, mockConfig.tsRoot);
  const generator = buildGenerator(program, {
    required: true
  }, [file]);
  return generator.getSchemaForSymbol(symbol);
}

const generateJSON = (schema: Definition) => {
  return JSONSchemaFaker.generate(schema as Schema)
}

const generate = async (method: string, requestPath: string) => {
  const filePath = buildDefinitionFilePath(requestPath);
  const fileFullPath = resolve(mockConfig.dir, filePath);
  const exists = await definitionFileExists(fileFullPath);
  if (!exists) {
    throw new Error('file not exist');
  }
  
  const schema = generateSchame(fileFullPath, method.toLowerCase());
  if (!schema) {
    throw new Error('definition not exist');
  }

  return generateJSON(schema);
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
        res.end(generateResponse({
          data
        }, 'success'));
      }).catch((err) => {
        res.set('Access-Control-Allow-Origin', req.get('origin'));
        res.end(generateResponse({
          message: err.message || ''
        }, 'error'));
        res.statusCode = 404;
      });
  });

  const port = mockConfig.port || 9876;
  app.listen(port);
  console.log(`server started at http://127.0.0.1:${port}`);
}

exports.start = (config) => {
  mockConfig = config;
  startServer();
}