import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();
const baseURL =
  process.env.DEV === '1'
    ? 'http://localhost:4201/'
    : process.env.STAGING === '1'
      ? 'http://localhost:4202/'
      : 'http://localhost:4200/';

export default defineConfig<TestOptions>({
  timeout: 40000,
  // globalTimeout: 60000,
  expect: {
    timeout: 2000,
    toMatchSnapshot: { maxDiffPixels: 50 }
  },
  retries: process.env.CI ? 2 : 1,  // --> from 0 change to 1 to make retries for local computer ***
  // retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
        // Set your Argos token (required if not using GitHub Actions)
        // token:"argos_388a5634fd688a8fed1ad01ee0dd323671",
      },
    ],
    ['json', { outputFile: 'test-results/jsonReport.json' }],
    ['junit', { outputFile: 'test-results/junitReport.xml' }],
    // ['allure-playwright'],
    ['html']
  ],
  use: {
    baseURL: 'http://localhost:4200/',
    // globalQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'      // #78
    //       : process.env.STAGING == '1' ? 'http://localhost:4202/'
    //       : 'http://localhost:4200/',
    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        video: {
          mode: 'off',
          size: { width: 1920, height: 1080 }
        }
      }
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120 * 1000,
  }
});
