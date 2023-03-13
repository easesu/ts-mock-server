import { MockConfig } from "./definition";

let mockConfig: MockConfig;

const init = (config: MockConfig) => {
  mockConfig = {...config};
};

const get = (key: string) => {
  if (!mockConfig) {
    return undefined;
  }
  if (!key) {
    return { ...mockConfig };
  }
  return mockConfig[key];
}

export default {
  init,
  get,
}