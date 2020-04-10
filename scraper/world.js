const puppeteer = require('puppeteer');

let scrapedUrl = 'https://www.worldometers.info/coronavirus/';



(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(scrapedUrl);
    await page.screenshot({path: 'example.png'});

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    const aHandle = await page.evaluateHandle(() => {
        const rows = document.querySelectorAll('[role="row"]')

        return rows
    });

    const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
    console.log(await resultHandle.jsonValue());
    await resultHandle.dispose();

    await browser.close();
})();