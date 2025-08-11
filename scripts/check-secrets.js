import 'dotenv/config';

const missing = [];
if (!process.env.OPENAI_API_KEY) missing.push('OPENAI_API_KEY');

if (missing.length) {
  console.error(`Missing required secrets: ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log('Secrets OK for development.');
}
