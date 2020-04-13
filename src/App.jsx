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
  "saudi arabia": "/flags/saudiarabia.png",
  "mexico": "/flags/mexico.png",
  "serbia": "/flags/serbia.png",
  "indonesia": "/flags/indonesia.png",
  "algeria": "/flags/algeria.png",
  "peru": "/flags/peru.png",
  "dominican republic": "/flags/dominicanrepublic.png",
  "egypt": "/flags/egypt.png",
  "morocco": "/flags/morocco.png",
  "colombia": "/flags/colombia.png",
  "hungary": "/flags/hungary.png",
  "greece": "/flags/greece.png",
  "argentina": "/flags/argentina.png",
  "panama": "/flags/panama.png",
  "finland": "/flags/finland.png",
  "slovenia": "/flags/slovenia.png",
  "thailand": "/flags/thailand.png",
  "iraq": "/flags/iraq.png",
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
  CASES_POP: "casesPerMillion",
  DEATHS_POP: "deathsPerMillion",
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      rawData: DATA,
      organisedData: [],
      filterValue: null,
      direction: 'desc',
      isModalOpen: false
    }
  }

  componentDidMount() {
    this.setState({
      organisedData: arraySort(this.state.rawData, 'cases', {reverse: true}),
      filterValue: 'cases'
    })
  }

  updateData = (filterValue) => {
    const _reverse = filterValue === this.state.filterValue
    const _newDirection = _reverse && this.state.direction === 'desc' ? 'asc' : 'desc'

    this.setState({
      organisedData: arraySort(this.state.rawData, filterValue, {reverse: _newDirection === 'desc'}),
      filterValue,
      direction: _newDirection
    })
  }

  render() {
    const {
      organisedData,
      filterValue,
      direction,
      isModalOpen
    } = this.state

    const modalClassMod = isModalOpen ? '--open' : ''

    return (
      <div className="App">
        <div className={`modal ${modalClassMod}`}>
          <div className="inner">
            <div className="modal-header">
              <h2>More information</h2>
              <h3 onClick={() => this.setState({isModalOpen: false})}>CLOSE</h3>
            </div>
            <div className="item">
              <strong>Why?</strong>
              <p>Whilst data is collected for the constituent member countries of the UK, it is very rarely compared with the rest of the world. As I found it quite difficult to get an wholistic idea of these numbers I decided to make ths site and I hope you find it useful too.</p>
            </div>
            <div className="item">
              <strong>Population</strong>
              <p>Gathered from the latest wikipedia source</p>
            </div>
            <div className="item">
              <strong>UK Data</strong>
              <p>Figures for Scotland, England, Wales and Northern Ireland are collected from the UK government website <a href="https://www.arcgis.com/apps/opsdashboard/index.html#/f94c3c90da5b4e9f9a0b19484dd4bb14">here</a> automatically twice per day</p>
            </div>
            <div className="item">
              <strong>Worldwide Data</strong>
              <p>Figures for the rest of the world are collected from <a href="https://www.worldometers.info/coronavirus/">here</a> automatically twice per day</p>
            </div>
            <div className="item">
              <strong>Mortality rate</strong>
              <p>Calculated as a percentage of deaths / cases per day</p>
            </div>
            <div className="item">
              <strong>Deaths /m</strong>
              <p>Total deaths / population in millions</p>
            </div>
            <div className="item">
              <strong>cases /m</strong>
              <p>Total cases / population in millions</p>
            </div>
            <div className="item">
              <strong>Created by</strong>
              <a className="about" href="https://www.linkedin.com/in/moaiii/" target="_blank" >Christopher Melville</a>
            </div>
          </div>
        </div>
        <div className="header">
          <div className="title">
            <div className="lhs">
              <div className="flag" style={{
                backgroundImage: `url("/flags/uk.png")`,
              }} />
              <h1 style={{textTransform: 'uppercase'}}>COVID 19: Home Nations in the World</h1>

            </div>
            <Social />
          </div>
          <p style={{fontSize: '1rem'}} >A detailed look at how the home nations of Scotland, England, Northern Ireland & Wales have dealt with the Coronavirus in relation to the rest of the world. Updated daily. <strong>Click the column headers to explore the stats.</strong></p>
          <button className="more-info" onClick={() => this.setState({isModalOpen: true})}>More info</button>
        </div>
        <table className="table" /* cellspacing="0" */>
          <thead >
            <tr>
              {Object.entries(COLUMNS).map(el => {
                let headerContent = null;

                if (el[1] === 'population') {
                  const word = window.innerWidth > 450 ? 'population' : 'pop'

                  headerContent = (
                    <React.Fragment>
                      <p>{word}</p>
                      <p>(m)</p>
                    </React.Fragment>
                  )
                } else if (el[1] === 'deathsPerMillion') {
                  headerContent = (
                    <React.Fragment>
                      <p>deaths</p>
                      <p>(m)</p>
                    </React.Fragment>
                  )
                } else if (el[1] === 'casesPerMillion') {
                  headerContent = (
                    <React.Fragment>
                      <p>cases</p>
                      <p>(m)</p>
                    </React.Fragment>
                  )
                } else if (el[1] === 'mortality') {
                  headerContent = (
                    <React.Fragment>
                      <p>mortality</p>
                      <p>rate</p>
                    </React.Fragment>
                  )
                } else {
                  headerContent = (
                    <React.Fragment>
                      <p>{el[1]}</p>
                    </React.Fragment>
                  )
                }

                return (
                  <th key={el[1]}
                    className="table-cell --header" 
                    onClick={(e) => this.updateData(el[1])}>
                    {(filterValue === el[1] && direction === 'asc') && <span>&#x2191;</span>}
                    {headerContent}
                    {(filterValue === el[1] && direction === 'desc') && <span>&#x2193;</span>}
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
                      let flagUrl = process.env.PUBLIC_URL + FLAGS[values[1]]

                      if (values[1] === 'england') {
                        flagUrl = Object.values(FLAGS)[10]
                      }
  
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
                        const _val = numberWithCommas(val)
                        content = idx === 5 ? _val + " %" : _val
                      }

                      const countryMod = idx === 1 ? '--country' : ''
  
                      return (
                        <td 
                          className={`table-cell --data ${countryMod}`}
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
}



export default App;
