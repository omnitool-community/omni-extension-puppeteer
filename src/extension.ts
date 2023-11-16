/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import WebScraperComponent from "./components/WebScraperComponent"
import WebScreenshotComponent from "./components/WebScreenshotComponent"
let components = [

  // WebScraperComponent,
  WebScreenshotComponent
]

export default {
  createComponents: () => ({
    blocks: components,
    patches: []
  })
}