import React, {PropTypes} from "react";
import uuid from "uuid";
import _ from 'lodash';
import moment from 'moment';

import { bindActionCreators } from 'redux'

import * as Actions from "../../actions/itemActions.js"

import Item from './Item.js'
import './styles.scss';

export default class ItemList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 1
    }
  }

  searchItems(items){
    items.map((individualItem, index) => {
      const nextItem = items[index + 1];

      // when checking for next item make sure we have an id to avoid the items we are pushing into the array
      if(nextItem && individualItem && nextItem.id) {
        const thisStart = moment(individualItem.start);
        const nextStart = moment(nextItem.start);
        items.push(this.getBetweenDates(thisStart, nextStart))
      }
    })
    const temp = [];
    for(let i of items)
        i && temp.push(i); // copy each non-empty value to the 'temp' array

    items = temp;
    return items;
  }

  getBetweenDates(originalItem, nextItem) {
      originalItem.add(1, 'days');

      // if start date is the same as the previous day start time then skip or if is in the future.
      const yesterday = moment().subtract(2, "day").format("YYYY-MM-DD");
      if (moment(originalItem.startOf('day')).isSame(moment(nextItem.startOf('day'))) || moment(originalItem, "YYYY-MM-DD", true).isAfter(yesterday)) {
          return null;
      }

      const getTheDiff = Math.abs(nextItem.diff(originalItem, 'days', true) - 1);

      return {
        type: 'range',
        start: moment(originalItem),
        end: moment(originalItem.add(getTheDiff, 'days'))
      };
  }

  render(){
    let { dispatch } = this.props;
    let boundActionCreators = bindActionCreators(Actions, dispatch)

    //use items props unless we are searching then use our filtered state.
    let useItems = this.props.searching || this.props.displayedItems.length > 0 ? this.props.displayedItems : this.props.items;

    //clone our items
    const copyOfItems = _.clone(useItems)

    //add our blank days
    useItems = this.searchItems(copyOfItems)

    // Use lodash to group by date.
    let result = _.chain(useItems)
      .groupBy(datum => moment(datum.start).format("MMM DD YYYY").toLocaleUpperCase() )
      .map((meetings, date) => ({ date, meetings })) //using ES6 shorthand to add the objects into "meetings"
      .value();

      //sort our list after adding blanks to the array
      result.sort(function(a, b){
        const c = new Date(a.date);
        const d = new Date(b.date);
        return c - d;
      });

    return (
      <div className="bookingsContainer">
        {this.props.items === 0 ?
          <p className="none">
            No Events yet.  Please add one above.
          </p>
        :
          <ul className="itemCards">
            {
              result.map(function(item){
                return (
                  <li key={uuid.v4()} className="day">

                    {item.meetings[0].type ?
                      <div className="missingDate">
                        <h2>{moment(item.meetings[0].start).format("MMM DD YYYY")} - {moment(item.meetings[0].end).format("MMM DD YYYY")}</h2>
                        <ul>
                          <li>You have no bookings for these dates.</li>
                        </ul>
                      </div>
                    :
                    <div>
                      <h2>{item.date}</h2>
                      <ul>
                        {
                          item.meetings.map((individualItem) => {
                            return <Item key={uuid.v4()} item={individualItem} {...boundActionCreators}/> ;
                          })
                        }
                      </ul>
                      </div>
                    }
                  </li>
                )})
            }

          </ul>
        }
      </div>
    )
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  displayedItems: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired
}
