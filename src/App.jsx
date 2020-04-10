import React, {useState, useEffect} from 'react';
import './App.scss';
import DATA from './data.json'
import key from 'weak-key';
import Social from './social';

var arraySort = require('array-sort');

const FLAGS = {
  "belgium": "/flags/belgium.png",
  "canada": "/flags/canada.png",
  "china": "/flags/china.png",
  "england": "/flags/england.png",
  "france": "/flags/france.png",
  "germany": "/flags/germany.png",
  "iran": "/flags/iran.png",
  "italy": "/flags/italy.png",
  "netherlands": "/flags/netherlands.png",
  "northern ireland": "/flags/northernireland.png",
  "scotland": "/flags/scotland.png",
  "spain": "/flags/spain.png",
  "switzerland": "/flags/switzerland.png",
  "turkey": "/flags/turkey.png",
  "uk": "/flags/uk.png",
  "usa": "/flags/usa.png",
  "wales": "/flags/wales.png",
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const COLUMNS = {
  FLAG: "",
  COUNTRY: "country",
  POPULATION: "population",
  CASES: "cases",
  DEATHS: "deaths",
  MORTALITY: "mortality rate",
  DEATHS_POP: "deaths per million",
  CASES_POP: "cases per million"
}

function App() {
  const [organisedData, setOrganisedData] = useState(DATA)
  const [filterValue, setFilterValue] = useState('DEATHS_POP')
  const [direction, setDirection] = useState('desc')

  useEffect(() => {
    const value = COLUMNS[filterValue]
    const organisedData = direction === 'desc' 
    ? arraySort(DATA, value, {reverse: true})
    : arraySort(DATA, value)

    console.log({DATA, organisedData, direction, value})

    setOrganisedData(organisedData)
  }, [direction, filterValue])

  const handleFilterSelection = (columnSelection) => {
    if (filterValue === columnSelection) {
      const otherDirection = direction === 'asc' ? 'desc' : 'asc'
      setDirection(otherDirection)
    } else {
      setDirection('desc')
      setFilterValue(columnSelection)
    }
  }

  return (
    <div className="App">
      <div className="header">
        <div className="title">
          <h1>COVID 19: Home Nations in the World</h1>
          <Social />
        </div>
        <p style={{fontSize: '1rem'}} >A detailed look at how the home nations of Scotland, England, Northern Ireland & Wales have dealt with the Coronavirus in relation to the rest of the world.</p>
      </div>
      <table className="table" /* cellspacing="0" */>
        <thead >
          <tr>
            {Object.entries(COLUMNS).map(el => {
              return (
                <th key={el[1]}
                  className="table-cell --header" 
                  onClick={() => handleFilterSelection(el[0])}>
                  {(filterValue === el[0] && direction === 'desc') && <span>&#x2191;</span>}
                  <p>{el[1]}</p>
                  {(filterValue === el[0] && direction === 'asc') && <span>&#x2193;</span>}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
            {organisedData.map(el => {
              const values = Object.values(el)
              const country = values[1]

              return (
                <tr className={`data-row --${country}`} key={key({el})} >
                  {values.map((val, idx) => {
                    const flagUrl = process.env.PUBLIC_URL + FLAGS[values[0]]

                    const content = idx === 0 
                      ? <div className="flag" style={{
                          backgroundImage: `url(${flagUrl})`,
                        }}>
                      </div>
                      : numberWithCommas(val)

                    return (
                      <td 
                        className="table-cell --data" 
                        key={key({val})}>{content}
                    </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
        <tfoot>
            <tr>
              <td colspan="8">
                <p>Created by <a className="about" href="https://www.linkedin.com/in/moaiii/" target="_blank" >Christopher Melville</a></p>
              </td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
