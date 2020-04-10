import React, {useState, useEffect, useCallback} from 'react';
import './App.scss';
import DATA from './data.json'
import key from 'weak-key';
import Social from './social';

var arraySort = require('array-sort');

const FLAGS = {
  "australia": "/flags/australia.png",
  "austria": "/flags/austria.png",
  "belgium": "/flags/belgium.png",
  "brazil": "/flags/brazil.png",
  "canada": "/flags/canada.png",
  "chile": "/flags/chile.png",
  "china": "/flags/china.png",
  "czech republic": "/flags/czech.png",
  "denmark": "/flags/denmark.png",
  "ecuador": "/flags/ecuador.png",
  "england ": "/flags/england.png",
  "france": "/flags/france.png",
  "germany": "/flags/germany.png",
  "india": "/flags/india.png",
  "iran": "/flags/iran.png",
  "ireland": "/flags/ireland.png",
  "israel": "/flags/israel.png",
  "italy": "/flags/italy.png",
  "japan": "/flags/japan.png",
  "luxembourg": "/flags/luxembourg.png",
  "malaysia": "/flags/malaysia.png",
  "netherlands": "/flags/netherlands.png",
  "northern ireland": "/flags/northernireland.png",
  "norway": "/flags/norway.png",
  "pakistan": "/flags/pakistan.png",
  "philippines": "/flags/philippines.png",
  "poland": "/flags/poland.png",
  "portugal": "/flags/portugal.png",
  "romania": "/flags/romania.png",
  "russia": "/flags/russia.png",
  "scotland": "/flags/scotland.png",
  "south korea": "/flags/southkorea.png",
  "spain": "/flags/spain.png",
  "sweden": "/flags/sweden.png",
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
  MORTALITY: "mortality",
  DEATHS_POP: "deathsPerMillion",
  CASES_POP: "casesPerMillion"
}

const App = () => {
  const [organisedData, setOrganisedData] = useState([])
  const [filterValue, setFilterValue] = useState()
  const [direction, setDirection] = useState('desc')

  useEffect(() => {
    console.log('FiLTERING >>> ', filterValue)
    const value = COLUMNS[filterValue]
    const organisedData = arraySort(DATA, value).reverse()
    setOrganisedData(organisedData)
    setOrganisedData(organisedData)
  }, [filterValue])

  console.log({organisedData})
  console.log({filterValue})
  console.log({direction})
  
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
                  data-value={el[0]}
                  className="table-cell --header" 
                  onClick={(e) => setFilterValue(el[0])}>
                  {(filterValue === el[0] && direction === 'asc') && <span>&#x2191;</span>}
                  <p>{el[1]}</p>
                  {(filterValue === el[0] && direction === 'desc') && <span>&#x2193;</span>}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
            {organisedData.length > 0 && organisedData.map((el, ridx) => {
              const values = Object.values(el)
              const country = values[1]

              return (
                <tr className={`data-row --${country}`} key={key({el})} >
                  {values.map((val, idx) => {
                    const flagUrl = process.env.PUBLIC_URL + FLAGS[values[1]]

                    let content = null

                    if (idx === 0) {
                      content = (<p className="flag" style={{
                       fontWeight: 'bold'
                      }}>{ridx + 1}
                    </p>)
                    } else if (idx === 1) {
                      content = (
                        <div style={{display: 'flex'}}>
                          <div className="flag" style={{
                            marginRight: '1rem',
                            backgroundImage: `url(${flagUrl})`,
                          }} />
                          <p >{val}</p>
                        </div>
                      )
                    } else {
                      content = numberWithCommas(val)
                    }

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
              <td colSpan="8">
                <p>Created by <a className="about" href="https://www.linkedin.com/in/moaiii/" target="_blank" >Christopher Melville</a></p>
              </td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
