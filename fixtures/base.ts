import { mergeTests } from '@playwright/test';
import { test as evidence } from './evidence';
import { test as pages } from './pages';

export const test = mergeTests(evidence, pages);

export { expect } from '@playwright/test';
