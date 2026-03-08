import puppeteer from 'puppeteer';

const dir = 'c:/Users/omerz/Documents/projectsz/myPortfolio/temporary screenshots';
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: `${dir}/screenshot-projects-live.png` });
await browser.close();
console.log('Done');
