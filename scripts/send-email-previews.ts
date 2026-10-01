/**
 * Sends the email samples to a single recipient through the live Resend
 * transport, to eyeball every email in a real inbox.
 *
 * The emails are `EMAIL_SAMPLES` (test/fixtures/email-samples.ts): the
 * same list `src/common/email/email-templates.spec.ts` checks, so what
 * lands in the inbox is what the spec asserts on. To preview a new
 * email, add a sample there; nothing is built by hand in this file.
 *
 * Run:
 *   npx tsx scripts/send-email-previews.ts
 *   npx tsx scripts/send-email-previews.ts --locale ro
 *   npx tsx scripts/send-email-previews.ts --only group/invitation
 *   npx tsx scripts/send-email-previews.ts --locale en --only invoice
 *
 *   --locale en|ro|both   Language(s) to send. Default: both.
 *   --only <text>         Only samples whose name contains <text>
 *                         (names look like `group/member-left:no-names`).
 *
 * The sender reads from .env (RESEND_API_KEY, EMAIL_FROM,
 * EMAIL_FROM_NAME). Each subject is the real one prefixed with
 * "[MotionHive Test]" so the inbox is easy to filter.
 *
 * Mind the volume: every sample goes out once per language, and
 * Resend's free tier caps a day at 100 emails. Narrow a full run with
 * `--locale` or `--only`.
 */

import 'dotenv/config';
import { Resend } from 'resend';

import { Locale, SUPPORTED_LOCALES, isLocale } from '../src/common/i18n';
import { EMAIL_SAMPLES } from '../test/fixtures/email-samples';

const RECIPIENT = 'user@motionhive.fit';
const SUBJECT_PREFIX = '[MotionHive Test]';

interface Preview {
  name: string;
  subject: string;
  html: string;
}

interface Options {
  locales: readonly Locale[];
  only: string | null;
}

const USAGE =
  'Usage: npx tsx scripts/send-email-previews.ts [--locale en|ro|both] [--only <substring of sample name>]';

/** `--flag value` or `--flag=value`. */
function parseArgs(argv: string[]): Options {
  const options: Options = { locales: SUPPORTED_LOCALES, only: null };

  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s, 2);
    const value = inline ?? argv[++i];
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`${flag} needs a value`);
    }

    if (flag === '--locale') {
      if (value === 'both') options.locales = SUPPORTED_LOCALES;
      else if (isLocale(value)) options.locales = [value];
      else throw new Error(`Unknown locale "${value}"`);
    } else if (flag === '--only') {
      options.only = value;
    } else {
      throw new Error(`Unknown argument "${flag}"`);
    }
  }

  return options;
}

/** One preview per sample per language, a sample's languages side by side. */
function buildPreviews({ locales, only }: Options): Preview[] {
  return EMAIL_SAMPLES.filter(
    (sample) => only === null || sample.name.includes(only),
  ).flatMap((sample) =>
    locales.map((locale) => ({
      name: `${sample.name} [${locale}]`,
      subject: `${SUBJECT_PREFIX} ${sample.subject(locale)}`,
      html: sample.html(locale),
    })),
  );
}

async function main(): Promise<void> {
  let options: Options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`${(err as Error).message}\n${USAGE}`);
    process.exit(1);
  }

  const previews = buildPreviews(options);
  if (previews.length === 0) {
    console.error(
      `No sample name contains "${options.only}". Names:\n${EMAIL_SAMPLES.map((s) => `  ${s.name}`).join('\n')}`,
    );
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY missing in .env — aborting');
    process.exit(1);
  }
  const fromName = process.env.EMAIL_FROM_NAME || 'MotionHive';
  const fromEmail = process.env.EMAIL_FROM || 'noreply@motionhive.fit';
  const from = `${fromName} <${fromEmail}>`;
  const resend = new Resend(apiKey);

  console.log(`Sending ${previews.length} preview emails to ${RECIPIENT}`);
  console.log(`From: ${from}\n`);

  const results: Array<{ name: string; ok: boolean; info: string }> = [];

  for (const p of previews) {
    process.stdout.write(`  ${p.name.padEnd(56)} `);
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [RECIPIENT],
        subject: p.subject,
        html: p.html,
      });
      if (error) {
        console.log(`FAIL — ${error.message}`);
        results.push({ name: p.name, ok: false, info: error.message });
      } else {
        console.log(`OK    id=${data?.id}`);
        results.push({ name: p.name, ok: true, info: data?.id || '' });
      }
    } catch (err) {
      const reason = (err as Error).message;
      console.log(`THROW — ${reason}`);
      results.push({ name: p.name, ok: false, info: reason });
    }
    // Resend free tier is 2 req/sec — slow down enough that we never trip it.
    await new Promise((r) => setTimeout(r, 600));
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log(`\n${ok}/${results.length} sent. ${fail} failed.`);
  if (fail > 0) {
    console.log('\nFailures:');
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  - ${r.name}: ${r.info}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
