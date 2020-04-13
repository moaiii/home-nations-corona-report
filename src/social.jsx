import React, { Component } from 'react';
import {ReactComponent as FacebookIcon} from './assets/facebook.svg';
import {ReactComponent as TwitterIcon} from './assets/twitter.svg';
import {ReactComponent as InfoLogo} from './assets/info.svg';


export default class Social extends Component {
  constructor() {
    super();

    this.state = {
      animate: ''
    };
  }

  handleInfoModalOpen = (e) => {
    e.preventDefault();
    this.props.openWalkThroughInfo(true);
  }

  handleSocialClick = (e) => {
    e.preventDefault();
    let network = e.currentTarget.getAttribute('data-network'); 
    let description = "How has the Home Nation's response to COVID19 compared with the world?" 
    let href;

    switch (network) {
      case 'facebook':
        href = 'https://www.facebook.com/sharer/sharer.php?u=' 
        + `https://homenationsintheworld.com`;
        break;
      
      case 'twitter':
        href = 'https://twitter.com/intent/tweet?text=' 
        + description 
        + '&url=' + `https://homenationsintheworld.com`;
        break;
      
      default: 
        alert('Oops social sharing isnt working at present');
    }

    window.open(
      href,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=253,width=600'
    );
  }

  handleInfoClick = (e) => {
    e.preventDefault();
    // store.dispatch(actions.showModal(true));
  }

  handleHomeClick = () => {
    window.open(process.env.PUBLIC_URL);
  }

  render() {
    const { classMod } = this.props;
    const { animate } = this.state;

    return (
      <div className={`Social__container ${animate} ${classMod}`}>
        <div className="Social__icons">
          <p>SHARE: </p>
          {/* <div className="social__link --info"
            onClick={e => this.handleInfoClick(e)}>
            <a href="">
              <InfoLogo />
            </a>
          </div> */}
          <div className="social__link --facebook"
            onClick={e => this.handleSocialClick(e)}
            data-network="facebook" >
            <a href="">
              <FacebookIcon />
            </a>
          </div>
          <div className="social__link --twitter"
            onClick={e => this.handleSocialClick(e)}
            data-network="twitter" >
            <a href="">
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    );
  }
}