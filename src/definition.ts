export interface MockConfig {
  port: number;
  dir: string;
  tsRoot: string;
  template: {
    success: string;
    error: string;
  };
}