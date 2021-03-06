const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.send('Please provide URL as GET parameter');
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url);
    // await page.waitFor(1000);
    let lances = await page.evaluate(() => window.lances);//document.head.innerHTML);

    var lances_Lances = [];
    for (var i=0; i<lances.length; i++) {
        var l = lances[i];
        if (l.tipoLance == "NORMAL" || l.tipoLance == "SUBSTITUICAO" || l.tipoLance == "IMPORTANTE") {
           var lance = {
               tempo: l.momento, 
               periodo: l.periodoLabel,
               titulo: l.titulo,
                text: l.corpo
           };
          lances_Lances.push(lance);
        }
    }
    browser.close();
    res.send(lances_Lances);
});

const server = app.listen(process.env.PORT || 8080, err => {
    if (err) return console.error(err);
    const port = server.address().port;
    console.info(`App listening on port ${port}`);
});
