const fs = require('fs');
const path = require('path');
const util = require('util')
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');



(async function() {
  try {

    const data = {
      name: 'Sean',
      total: '100',
      due_date: 'Tuesday'
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve('financials.html')
    var contents = fs.readFileSync(templatePath, 'utf8');

    const template = Handlebars.compile(contents)
    await page.setContent(template(data))
    //await page.setContent(contents)

    await page.emulateMedia('screen');
    await page.pdf({
      path: 'mypdf.pdf',
      format: 'a4',
      printBackground: true
    });

    console.log('done');
    browser.close();
    process.exit();

  } catch (e) {
    console.log(e);
  }
})();
