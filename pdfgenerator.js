const fs = require('fs');
const path = require('path');
const util = require('util')
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

function commaFormat(number) {
	return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/\B(?=(\d{2})+(?!\d))/g, ".");
}


(async function() {
  try {

    const data = {
      total: '100',
      income: [
        {account: "Sales", amount: "1000000"},
        {account: "Other Income", amount: "12000"}
      ],
      expense: [
        {account: "Operations", amount: "100000"},
        {account: "Sales and Marketing", amount: "200000"},
        {account: "Research and Development", amount: "120000"},
        {account: "Depreciation and Amortisation", amount: "150000"},
        {account: "Stuff", amount: "90000"},
        {account: "Useless Expense", amount: "10000"},
      ],
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve('financials.html')
    var contents = fs.readFileSync(templatePath, 'utf8');

		Handlebars.registerHelper('commaFormat', function(number) {
			return commaFormat(number);
		});

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
