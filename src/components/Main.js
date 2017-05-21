import React, {PropTypes, Component } from "react";

import { connect } from "react-redux";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';
import { scroller } from 'react-scroll'

import * as Actions from "../actions/itemActions.js";
import 'react-big-calendar/lib/css/react-big-calendar.css';


import ItemForm from './ItemForm/ItemForm.js';
import ItemList from './ItemCards/ItemList.js';
import './styles.scss';

BigCalendar.momentLocalizer(moment);
const Main = class Main extends Component{
  constructor(props) {
    super(props)

    this.handleFormClose = this.handleFormClose.bind(this)

    this.state = {
      showCal: false,
      searchTerm: '',
      currentlyDisplayed: [],
      searching: false,
      adding: false
    }
  }

  handleClickToggle() {
    this.setState({
      showCal: !this.state.showCal
    })
  }

  handleSearchChange(){
    this.setState({
      searching: !this.state.searching,
      showCal: false
    })
  }

  handleAddChange(){
    this.setState({
      adding: !this.state.adding,
      showCal: false
    })
  }

  handleFormClose(e) {
    e.preventDefault()
    this.setState({
      adding: !this.state.adding
    })
  }

  onClickEvent(object){
    const elemId = 'item' + object.id;

    scroller.scrollTo(elemId, {
      duration: 1500,
      delay: 100,
      smooth: true
    })
  }

  getClosestDate(){
    const now = moment.utc();
    const data = this.props.items

    //sort our datetimes based on closest to now
    const sorted = data.sort(function(a, b) {
      var a1 = moment.utc(a.start);
      var b1 = moment.utc(b.start);
      var dA = Math.abs(a1 - now),
        dB = Math.abs(b1 - now);
      if (dA < dB) {
        return -1;
      } else if (dA > dB) {
        return 1;
      } else {
        return 0;
      }
    });
    return sorted[0];
  }

  handleScrollToNow() {
    const scrollID = this.getClosestDate();
    const elemId = 'item' + scrollID.id;

    scroller.scrollTo(elemId, {
      duration: 1500,
      delay: 100,
      smooth: true
    })
  }

  handleSearchUpdate(event) {
    let search = event.target.value.toLowerCase()
    var newlyDisplayed = _.filter(this.props.items, function(obj) {
      return ~obj.eventName.toLowerCase().indexOf(search) || ~obj.roomName.toLowerCase().indexOf(search);
    });

    this.setState({
      searchTerm: event.target.value,
      currentlyDisplayed: newlyDisplayed
    })
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Actions.fetchItems())
  }

  render(){
    const angleClassNames = classNames('icon', 'fa', {
      'fa-angle-down': !this.state.showCal,
      'fa-angle-up': this.state.showCal
    });
    return (
      <div className="appContainer">
        <nav className="logoHeader">
          <img src="https://www.emssoftware.com/getmedia/a82e6e15-ecc4-4873-8810-c7a5ee1e8067/EMS_Software_logo.png" />
        </nav>
        <section className="calendarContainer">
          <nav>
            {this.state.searching ?
              <div className="searchContainer">
                <input onChange={this.handleSearchUpdate.bind(this)} placeholder="Search Events"/>
                <button onClick={this.handleSearchChange.bind(this)}>Cancel</button>
                <i className="icon fa fa-search"/>
              </div>
            :
                <div>
                  { this.state.adding ?
                    <ItemForm handleFormClose={this.handleFormClose}{...this.props} />
                  :
                    <div className="mainNav">
                      <i className="icon fa fa-bars" />
                      <h2>{moment().format('MMMM YYYY')}</h2>
                      <a onClick={this.handleClickToggle.bind(this)}><i className={angleClassNames} /></a>
                      <i className="icon fa fa-search" onClick={this.handleSearchChange.bind(this)} />
                      <i className="icon fa fa-plus" onClick={this.handleAddChange.bind(this)}/>
                    </div>
                  }
                </div>
            }
          </nav>

          { this.state.showCal ?
            <BigCalendar
              events={this.props.items}
              startAccessor='start'
              endAccessor='end'
              toolbar={false}
              onSelectEvent={this.onClickEvent}
              weekdayFormat={'dd'}
              views={['month']}
              height='600px'
            />
          : null}

          <ItemList displayedItems={this.state.currentlyDisplayed}
                    searching={this.state.searching}
                    items={this.props.items}
                    dispatch={this.props.dispatch} />
        </section>

        <a className="nowButton" onClick={this.handleScrollToNow.bind(this)}>NOW</a>
      </div>
    )
  }
}

Main.propTypes = {
  items: PropTypes.array.isRequired,
  fetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    items: state.itemReducer.items,
    fetching: state.itemReducer.fetching,
  }
}

export default connect(mapStateToProps)(Main);
