/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */
import { OAIBaseComponent, WorkerContext, OmniComponentMacroTypes, BlockCategory as Category } from 'omni-sockets';
import puppeteer from 'puppeteer';

const component = OAIBaseComponent.create('puppeteerscraper', 'puppeteer-scraper')
  .fromScratch()
  .set('title', 'Web Scraper')
  .set('category', Category.DATA_EXTRACTION)
  .set('description', 'Scrape web content using Puppeteer.')
  .setMethod('X-CUSTOM')
  .setMeta({
    source: {
      summary: 'Scrape web content using Puppeteer.',
      links: {
        'Puppeteer Github': 'https://github.com/puppeteer/puppeteer',
      },
    },
  })
component
  .addInput(
    component.createInput('url', 'string')
      .set('title', 'URL')
      .set('description', 'The URL of the web page to scrape.')
      .setRequired(true)
      .toOmniIO()
  )
  .addInput(
    component.createInput('selector', 'string')
      .set('title', 'CSS Selector')
      .set('description', 'The CSS selector for the content to scrape.')
      .toOmniIO()
  )
  .addInput(
    component.createInput('onlyDocument', 'boolean')
      .set('title', 'Document Only')
      .set('description', 'Scrape only the HTML document without other resources e.g. images, CSS.')
      .setDefault(true)
      .toOmniIO()
  )


  .addOutput(
    component.createOutput('webContent', 'string')
      .set('title', 'Content')
      .set('description', 'The scraped web content.')
      .toOmniIO()
  )
  .setMacro(OmniComponentMacroTypes.EXEC, async (payload: any, ctx: WorkerContext) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(payload.url, { waitUntil: 'domcontentloaded' });

    

    let webContent;
    
    if (payload.selector) {
      await page.waitForSelector(payload.selector);
      webContent = await page.evaluate((selector: any) => {
        let results: { url: any; text: any; }[] = [];
        let items = document.querySelectorAll(selector);
        items.forEach((item) => {
          results.push({
            url: item.getAttribute('href'),
            text: item.innerText,
          });
        });
        webContent = results;
      }, payload.selector);
    } else {
      webContent = await page.content();
    }

    await browser.close();

    return { webContent };
  });

const WebScraperComponent = component.toJSON()
export default WebScraperComponent
