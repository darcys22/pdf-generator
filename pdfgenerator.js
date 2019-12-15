const fs = require('fs');
const path = require('path');
const util = require('util')
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

const data = require('./output.json')

function commaFormat(number) {
	return (number/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function creditCommaFormat(number) {
	return (number/-100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


(async function() {
  try {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const templatePath = path.resolve('financials.html')
    var contents = fs.readFileSync(templatePath, 'utf8');

		Handlebars.registerHelper('commaFormat', function(number) {
			return commaFormat(number);
		});

		Handlebars.registerHelper('creditCommaFormat', function(number) {
			return creditCommaFormat(number);
		});

    Handlebars.registerHelper('if_eq', function(a, b, opts) {
				if (a == b) {
						return opts.fn(this);
				} else {
						return opts.inverse(this);
				}
    });

		Handlebars.registerHelper("debug", function(optionalValue) {
			console.log("Current Context");
			console.log("====================");
			console.log(this);

			if (optionalValue) {
				console.log("Value");
				console.log("====================");
				console.log(optionalValue);
			}
		});

    const template = Handlebars.compile(contents)
    await page.setContent(template({data}))

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
