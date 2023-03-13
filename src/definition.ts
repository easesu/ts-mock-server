export interface MockConfig {
  port: number;
  dir: string;
  tsRoot: string;
  cacheSchema?: boolean;
  template: {
    success: string;
    error: string;
  };
}