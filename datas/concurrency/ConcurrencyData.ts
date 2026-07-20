import { faker } from '@faker-js/faker';

export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

export const newConcurrentMessage = (label: string) => `QA concurrent ${label} ${faker.string.alphanumeric(8)}`;
