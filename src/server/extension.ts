
// Import required modules
import { OAIBaseComponent, WorkerContext, OmniComponentMacroTypes, BlockCategory as Category } from 'omni-sockets';
import puppeteer from 'puppeteer';

// Create the WebScreenshotComponent
const webScreenshotComponent = OAIBaseComponent.create('webscreenshot', 'web-screenshot')
  .fromScratch()
  .set('title', 'Web Screenshot')
  .set('category', 'Data Extraction')
  .set('description', 'Capture a screenshot of a web page using Puppeteer.')
  .setMethod('X-CUSTOM')
  .setMeta({
    source: {
      summary: 'Capture a screenshot of a web page using Puppeteer.',
      links: {
        'Puppeteer Github': 'https://github.com/puppeteer/puppeteer',
      },
    },
  })
webScreenshotComponent
  .addInput(
    webScreenshotComponent.createInput('url', 'string')
      .set('title', 'URL')
      .set('description', 'The URL of the web page to capture.')
      .setRequired(true)
      .toOmniIO()
  )
  .addOutput(
    webScreenshotComponent.createOutput('screenshot', 'string', 'image')
      .set('title', 'Screenshot')
      .set('description', 'The captured screenshot as a base64 encoded image.')
      .toOmniIO()
  )
  .setMacro(OmniComponentMacroTypes.EXEC, async (payload: any, ctx: WorkerContext) => {
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1280,
        height: 2000,
      },
    });

    const page = await browser.newPage();
    await page.goto(payload.url);

    const screenshotBuffer = await page.screenshot();
    const screenshotBase64 = screenshotBuffer.toString('base64');

    await browser.close();

    return { screenshot: screenshotBase64 };
  });

// Export the extension
export default {
  createComponents: () => ({
    blocks: [webScreenshotComponent.toJSON()],
    patches: [],
  }),
};