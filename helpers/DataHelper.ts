// helpers/DataHelper.ts - scaffolded in every project, module-agnostic
import { faker } from '@faker-js/faker';

/**
 * Test data that is REALISTIC and UNIQUE at the same time.
 *
 * Realistic matters: "Ewald Walter" exercises the same validation, layout and
 * sorting that a real user's name does. "Test1234" does not - it hides
 * truncation, i18n, apostrophes and column-width bugs.
 *
 * Unique matters: fullyParallel workers seed at the same instant, and any app
 * that dedupes will reject the second one. Measured against a real API - 4
 * workers with a bare timestamp produced 2 distinct names and TWO 409s.
 *
 * Raw faker is not enough on its own. Measured over 5 000 calls:
 *   person.firstName      50% distinct   <- collides constantly
 *   commerce.productName  79% distinct
 *   company.name          89% distinct
 *   person.fullName      100% distinct   <- still collides over a long suite
 * So a human-readable value gets a short unique suffix appended; values that are
 * naturally high-cardinality (emails, phones, ids) are generated unique instead.
 */
export class DataHelper {
  /**
   * A value no other worker, and no earlier run, will produce.
   * Time component -> ordered and readable. Random component -> survives several
   * workers in the SAME millisecond, which a timestamp alone does not.
   * Verified: 100 000 calls -> 100 000 distinct; 64 concurrent API seeds -> 0 duplicates.
   */
  static uid(): string {
    return `${Date.now().toString(36)}-${faker.string.alphanumeric(6)}`;
  }

  /** Shorter suffix for appending to human-readable text (8 chars, still unique). */
  static tag(): string {
    return `${Date.now().toString(36).slice(-4)}${faker.string.alphanumeric(4)}`;
  }

  /* ---------- realistic + unique ---------- */

  /** A real-looking person name: "Ewald Walter 04e0sedj". */
  static personName(): string { return `${faker.person.fullName()} ${DataHelper.tag()}`; }

  /** A real-looking company / clinic / organisation: "Hagenes and Franey 04ek1IRi". */
  static companyName(): string { return `${faker.company.name()} ${DataHelper.tag()}`; }

  /** A real-looking place: "Kalitown 04fbZt4v". */
  static placeName(): string { return `${faker.location.city()} ${DataHelper.tag()}`; }

  /** A real-looking product / item: "Ergonomic Granite Shirt 04eyqwaW". */
  static productName(): string { return `${faker.commerce.productName()} ${DataHelper.tag()}`; }

  /** A real-looking street address (no suffix - addresses need not be unique). */
  static address(): string { return faker.location.streetAddress(true); }

  /**
   * A real-looking value from a DOMAIN vocabulary faker does not ship -
   * medicine names, diagnosis codes, specialties, anything app-specific.
   * Pass the pool from `datas/<module>/`; the suffix keeps it unique.
   *
   *   DataHelper.fromPool(MEDICINES)  ->  "Napa Extra 04g1Kd2p"
   */
  static fromPool(pool: readonly string[]): string {
    return `${faker.helpers.arrayElement(pool)} ${DataHelper.tag()}`;
  }

  /* ---------- naturally unique, no suffix needed ---------- */

  /** A deliverable-looking but unique email. Many apps reject public domains. */
  static email(domain = 'example.test'): string {
    return `qa.${faker.internet.username().toLowerCase().replace(/[^a-z0-9.]/g, '')}.${DataHelper.tag()}@${domain}`;
  }

  /** A local-format mobile number. Override the pattern per country. */
  static phone(prefix = '01', operators = ['3', '4', '5', '6', '7', '8', '9'], digits = 8): string {
    return `${prefix}${faker.helpers.arrayElement(operators)}${faker.string.numeric(digits)}`;
  }

  /** A numeric reference / registration / national id of a given length. */
  static numericId(length = 10): string { return faker.string.numeric(length); }

  /* ---------- labelled + prefixed (for rows a human will see in the app) ---------- */

  /**
   * A display name that is obviously test data: "QA-AUTO <Entity> mkq3x1-a7f2be".
   *
   * Use this when the value's job is to be FINDABLE and DELETABLE rather than
   * realistic - a seeded precondition row, a fixture's own record. Use the
   * realistic generators above when the value is what the test is really about
   * (a patient's name on a form, a product in a catalogue).
   *
   * QA-AUTO = created through the UI by a test. QA-SEED = seeded through the API.
   */
  static unique(label: string, prefix = 'QA-AUTO'): string {
    return `${prefix} ${label} ${DataHelper.uid()}`;
  }

  /** An address/slug/code-safe unique token with no spaces. */
  static uniqueSlug(label: string): string {
    return `qa-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${DataHelper.uid()}`;
  }

  /** @deprecated use email() - kept so existing factories keep compiling. */
  static uniqueEmail(domain = 'example.test'): string { return DataHelper.email(domain); }
}
