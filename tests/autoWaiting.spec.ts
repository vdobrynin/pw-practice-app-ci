import { test, expect } from '@playwright/test';

test.beforeEach(async({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
    await successButton.click()
    // const text = await successButton.textContent()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    await successButton.waitFor({ state: "attached" })    // variation for wait
    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.') // with diff assertion

    await expect(successButton)
        .toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })//--> overwriting to 20 sec
})

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //___ wait for element
    await page.waitForSelector('.bg-success')
    await successButton.click()

    //__ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //__ wait for network calls to be completed ('NOT RECOMMENDED')
    // await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async ({page}) => {
    // test.setTimeout(10000)
    test.slow()
    const successButton = page.locator('.bg-success')
    await successButton.click()
})