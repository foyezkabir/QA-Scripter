export interface ApiTestResult {
  status: 'passed' | 'failed' | 'blocked';
  comment: string;
}

/** Every API-automated TestRail case exports one of these as `run`. */
export type ApiTestFn = () => Promise<ApiTestResult>;
