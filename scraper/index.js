const fs = require('fs')
const puppeteer = require('puppeteer');
const approvedCountries = require('./approvedCountries')
let worldUrl = 'https://www.worldometers.info/coronavirus/';
let homenationsUrl = 'https://www.arcgis.com/apps/opsdashboard/index.html#/f94c3c90da5b4e9f9a0b19484dd4bb14';
var path = require('path');


(async () => {
    const browser = await puppeteer.launch({ headless: true });
    let worldData = []
    let homeNationsData = []



    /**
     * World Data
     */

    try {
      const page = await browser.newPage();
      await page.goto(worldUrl);

    const pageData = await page.evaluate(() => {

      const data = []

        const parseRow = (row) => {
          const _td = Array.from(row.querySelectorAll('td')).map(el => el.innerText)
          console.log(_td[0])
          return _td;
        }
        
        const allRows = document.querySelectorAll('tr');
        
        for(const tr of allRows) {
            const _cells = parseRow(tr);
            const country = _cells[0];
            const cases = _cells[1];
            const deaths = _cells[3];
            
            if (typeof country !== 'undefined' && !country.includes('Total')) {
                data.push({
                    country: country.toLowerCase(),
                    cases:  parseFloat(cases.length === 0 ? "0" : cases.replace(/,/g, '').trim(), 10),
                    deaths: parseFloat(deaths.length === 0 ? "0" : deaths.replace(/,/g, '').trim(), 10)
                })
            }
        }

        return data
      });

      // do work here 
      const filtered = pageData
        .filter(el => {
          return approvedCountries.hasOwnProperty(el.country)
        })
      .reduce((acc, cur) => {

        const lookup = approvedCountries[cur.country]

          return [
              ...acc,
              {
                  rank: 0,
                  country: cur.country,
                  population: lookup.population,
                  cases: cur.cases,
                  deaths: cur.deaths,
                  gdp: lookup.gpd,
                  mortality: parseFloat(((cur.deaths / cur.cases) * 100).toFixed(2), 10),
                  casesPerMillion: Math.round(cur.cases / lookup.population),
                  deathsPerMillion: Math.round(cur.deaths / lookup.population),
              }
          ]
      }, [])

      filtered.forEach(el => {
        const uniqHasAlready = worldData.some(_el => _el.country === el.country)

        if (!uniqHasAlready) {
            worldData.push(el)
        }
      })




      /**
       * Home nations
       */

      try {
        const homenationsPage = await browser.newPage();
        await homenationsPage.goto(homenationsUrl, {waitUntil: 'networkidle0'});

    
        const homenationsPageData = await homenationsPage.evaluate(() => {
          return Array.from(document.querySelectorAll('text')).map(el => el.innerHTML).slice(4, 12)
        });

        console.log({homenationsPageData})
    
        const englandPopulation = 55.98
        const englandCases = parseFloat(homenationsPageData[0].replace(/,/g, '').trim(), 2)
        const englandDeaths = parseFloat(homenationsPageData[1].replace(/,/g, '').trim(), 2)
        
        const scotlandPopulation = 5.45
        const scotlandCases = parseFloat(homenationsPageData[2].replace(/,/g, '').trim(), 2)
        const scotlandDeaths = parseFloat(homenationsPageData[3].replace(/,/g, '').trim(), 2)
        
        
        const walesPopulation = 3.13
        const walesCases = parseFloat(homenationsPageData[4].replace(/,/g, '').trim(), 2)
        const walesDeaths = parseFloat(homenationsPageData[5].replace(/,/g, '').trim(), 2)
        
        const niPopulation = 1.88
        const niCases = parseFloat(homenationsPageData[6].replace(/,/g, '').trim(), 2)
        const niDeaths = parseFloat(homenationsPageData[7].replace(/,/g, '').trim(), 2)
    
        homeNationsData = [
          {
            "rank": "",
            "country": "england",
            "population": englandPopulation,
            "cases": englandCases,
            "deaths": englandDeaths,
            "mortality": parseFloat(((englandDeaths / englandCases) * 100).toFixed(2), 10),
            casesPerMillion: Math.round(englandCases / englandPopulation),
            deathsPerMillion: Math.round(englandDeaths / englandPopulation),
          },
          {
          "rank": "",
          "country": "scotland",
          "population": scotlandPopulation,
          "cases": scotlandCases,
          "deaths": scotlandDeaths,
          "mortality": parseFloat(((scotlandDeaths / scotlandCases) * 100).toFixed(2), 10),
          casesPerMillion: Math.round(scotlandCases / scotlandPopulation),
          deathsPerMillion: Math.round(scotlandDeaths/ scotlandPopulation)
        },
        {
          "rank": "",
          "country": "wales",
          "population": walesPopulation,
          "cases": walesCases,
          "deaths": walesDeaths,
          "mortality": parseFloat(((walesDeaths / walesCases) * 100).toFixed(2), 10),
          casesPerMillion: Math.round(walesCases / walesPopulation),
          deathsPerMillion: Math.round(walesDeaths / walesPopulation),
        },
        {
          "rank": " ireland",
          "country": "northern ireland",
          "population": niPopulation,
          "cases": niCases,
          "deaths": niDeaths,
          "mortality": parseFloat(((niDeaths / niCases) * 100).toFixed(2), 10),
          casesPerMillion: Math.round(niCases / niPopulation),
          deathsPerMillion: Math.round(niDeaths / niPopulation),
        }]

        const finalData = [...worldData, ...homeNationsData]
    
        console.log(JSON.stringify(finalData, null, 2))


          const _filePath = path.resolve(__dirname) + '/../src/data.json'

        fs.writeFile(_filePath, JSON.stringify(finalData, null, 2), function (err) {
            if (err) throw err;
            console.log('Saved!');
        })
    
        // end
        await browser.close()

        // home nations error
        } catch (error) {
          await browser.close()
        console.log({error})
      }

    // world error 
    } catch (error) {
        await browser.close()
        console.log({error})
    }
})();
