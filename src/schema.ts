import { pathExists } from 'fs-extra';
import { resolve } from 'path';
import { getProgramFromFiles, buildGenerator, Definition } from 'typescript-json-schema';
import configure from './configure';

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

const generateSchameByFile = (file: string, symbol: string) => {
  const program = getProgramFromFiles([file], {}, configure.get('tsRoot'));
  const generator = buildGenerator(program, {
    required: true
  }, [file]);
  return generator.getSchemaForSymbol(symbol);
}

const generateSchemaByRequest = async (method: string, requestPath: string) => {
  const filePath = buildDefinitionFilePath(requestPath);
  const fileFullPath = resolve(configure.get('dir'), filePath);
  const exists = await definitionFileExists(fileFullPath);
  if (!exists) {
    throw new Error('file not exist');
  }
  
  const schema = generateSchameByFile(fileFullPath, method.toLowerCase());
  if (!schema) {
    throw new Error('definition not exist');
  }

  return schema;
};

const schemaCache: {
  [path: string]: {
    [method: string]: Definition;
  }
} = {};

const pickFromCache = (method: string, requestPath: string) => {
  if (schemaCache[requestPath] && schemaCache[requestPath][method]) {
    return schemaCache[requestPath][method];
  }
  return null;
};

const saveToCache = (method: string, requestPath: string, schema: Definition) => {
  if (!schemaCache[requestPath]) {
    schemaCache[requestPath] = {};
  }
  schemaCache[requestPath][method] = schema;
};

const generate = async (method: string, requestPath: string) => {
  const cacheSchema = configure.get('cacheSchema');
  let res: Definition;
  if (cacheSchema) {
    res = pickFromCache(method, requestPath);
    if (res) {
      return res;
    }
  }
  res = await generateSchemaByRequest(method, requestPath);
  if (cacheSchema) {
    saveToCache(method, requestPath, res);
  }
  return res;
};


export default {
  generate
}