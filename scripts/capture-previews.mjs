import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets', 'portfolio', 'previews');

const demos = [
    'example-vizitka',
    'example-landing',
    'example-corporate',
    'example-shop',
    'example-wordpress',
    'example-telegram-bot',
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const slug of demos) {
    const filePath = path.join(root, 'portfolio', `${slug}.html`);
    const url = pathToFileURL(filePath).href;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(800);
    await page.screenshot({
        path: path.join(outDir, `${slug}.jpg`),
        type: 'jpeg',
        quality: 82,
        fullPage: false,
    });
    console.log('Captured', slug);
}

await browser.close();
