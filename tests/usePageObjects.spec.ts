import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to form page', async({page}) => {                            // #78
// test('navigate to form page @smoke @regression', async({page}) => {      // #78
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
// test('parametrized methods @smoke', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName() // #63 --> will replace ALL SPACES that found in text: (/\s+/g, '')                                 
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com` // #63

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage()
        .submitUsingTheGridFormWithCredentialsAndSelectedOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    // await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    // const buffer = await page.screenshot()
    // console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage()
        .submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    // await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
    // await pm.navigateTo().datepickerPage()
    // await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    // await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 10)
})

test.only('testing with argos ci', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page");
    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, "datepicker page");
})