import { JSONSchemaFaker, Schema } from "json-schema-faker";
import { Definition } from "typescript-json-schema";

const generate = (schema: Definition) => {
  return JSONSchemaFaker.generate(schema as Schema);
};

export default {
  generate
}