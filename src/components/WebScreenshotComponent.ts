/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */
import { OAIBaseComponent, WorkerContext, OmniComponentMacroTypes, BlockCategory as Category } from 'omni-sockets';
import puppeteer from 'puppeteer';

const component = OAIBaseComponent.create('webscreenshot', 'web-screenshot')
  .fromScratch()
  .set('title', 'Web Screenshot')
  .set('category', Category.DATA_EXTRACTION)
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
component
  .addInput(
    component.createInput('url', 'string')
      .set('title', 'URL')
      .set('description', 'The URL of the web page to capture.')
      .setRequired(true)
      .toOmniIO()
  )
  // Add viewport width input
  .addInput(
    component.createInput('viewportWidth', 'number')
      .set('title', 'Viewport Width')
      .set('description', 'The width of the viewport in pixels.')
      .setDefault(1280) // Set default width if you like
      .toOmniIO()
  )
  // Add viewport height input
  .addInput(
    component.createInput('viewportHeight', 'number')
      .set('title', 'Viewport Height')
      .set('description', 'The height of the viewport in pixels.')
      .setDefault(2000) // Set default height if you like
      .toOmniIO()
  )
  // Add device scale factor input
  .addInput(
    component.createInput('deviceScaleFactor', 'number')
      .set('title', 'Device Scale Factor')
      .set('description', 'Specify the device scale factor (such as 1 for no scaling or 2 for retina).')
      .setDefault(1) // Set default device scale factor if you like
      .toOmniIO()
  )
  // Add is mobile input
  .addInput(
    component.createInput('isMobile', 'boolean')
      .set('title', 'Is Mobile')
      .set('description', 'Whether the meta viewport tag is set to mobile.')
      .setDefault(false)
      .toOmniIO()
  )
  .addInput(
    component.createInput('fullPage', 'boolean')
      .set('title', 'Full Page')
      .set('description', 'Automatically scrolls the webpage to capture all dynamically loaded and lazy-loaded content in screenshots, ideal for pages that reveal additional content on scroll.')
      .setDefault(true)
      .toOmniIO()
  )
  .addInput(
    component.createInput('autoscroll', 'boolean')
      .set('title', 'Auto Scroll')
      .set('description', 'Capture the entire scrollable page as a screenshot.')
      .setDefault(true)
      .toOmniIO()
  )
  .addInput(
    component.createInput('delay', 'number')
      .set('title', 'Scroll Delay')
      .set('description', 'The delay in milliseconds between each scroll step. A higher value results in slower scrolling, allowing more time for page content to load and animations to complete.')
      .setDefault(100)
      .toOmniIO()
  )
  .addInput(
    component.createInput('distance', 'number')
      .set('title', 'Scroll Distance')
      .set('description', 'The distance in pixels the page will scroll on each step. Smaller values create smoother, more gradual scrolling.')
      .setDefault(100)
      .setConstraints(10, 500, 10)
      .toOmniIO()
  )
  
  .addOutput(
    component.createOutput('screenshot', 'string', 'image')
      .set('title', 'Screenshot')
      .set('description', 'The captured screenshot as a base64 encoded image.')
      .toOmniIO()
  )
  .setMacro(OmniComponentMacroTypes.EXEC, async (payload: any, ctx: WorkerContext) => {
    
    // Auto-scroll function
    async function autoScroll(page: puppeteer.Page, distance: number, delay: number): Promise<void> {
      await page.evaluate(async (distance: number, delay: number) => {
          await new Promise<void>((resolve, reject) => {
              var totalHeight = 0;
  
              function step() {
                  window.scrollBy(0, distance);
                  totalHeight += distance;
  
                  if (totalHeight < document.body.scrollHeight) {
                      setTimeout(() => {
                          window.requestAnimationFrame(step);
                      }, delay);
                  } else {
                      resolve();
                  }
              }
  
              window.requestAnimationFrame(step);
          });
      }, distance, delay); // Pass distance and delay as arguments
    }
    
    // Validate the URL
    if (!payload.url || typeof payload.url !== 'string') {
      throw new Error('Invalid or missing URL');
    }

    const viewportOptions = {
      width: payload.viewportWidth,
      height: payload.viewportHeight,
      deviceScaleFactor: payload.deviceScaleFactor,
      isMobile: payload.isMobile
    };

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.setViewport(viewportOptions);
      await page.goto(payload.url, { waitUntil: 'networkidle2' });

      if (payload.autoscroll){
        await autoScroll(page, payload.distance, payload.delay);
      }        
      await page.waitForTimeout(200);
      const screenshotBuffer = await page.screenshot({ fullPage: !!payload.fullPage });
      const screenshotBase64 = screenshotBuffer.toString('base64');

      return { screenshot: screenshotBase64 };
    } catch (error) {
      // Handle potential errors like navigation issues
      console.error('Error occurred during page operation:', error);
      throw error;
    } finally {
      // Ensure the browser is closed even if an error occurs
      await browser.close();
    }
  });

const WebScreenshotComponent = component.toJSON()
export default WebScreenshotComponent