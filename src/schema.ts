import { pathExists } from 'fs-extra';
import { resolve } from 'path';
import { getProgramFromFiles, buildGenerator } from 'typescript-json-schema';
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

const generateSchame = (file: string, symbol: string) => {
  const program = getProgramFromFiles([file], {}, configure.get('tsRoot'));
  const generator = buildGenerator(program, {
    required: true
  }, [file]);
  return generator.getSchemaForSymbol(symbol);
}

const generate = async (method: string, requestPath: string) => {
  const filePath = buildDefinitionFilePath(requestPath);
  const fileFullPath = resolve(configure.get('dir'), filePath);
  const exists = await definitionFileExists(fileFullPath);
  if (!exists) {
    throw new Error('file not exist');
  }
  
  const schema = generateSchame(fileFullPath, method.toLowerCase());
  if (!schema) {
    throw new Error('definition not exist');
  }

  return schema;
};

export default {
  generate
}