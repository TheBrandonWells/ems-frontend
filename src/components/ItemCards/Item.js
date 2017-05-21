import React, {PropTypes} from "react";
import DateTime from 'react-datetime';
import { Element} from 'react-scroll'
import moment from 'moment';

import './styles.scss';

export default class Item extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      eventName: this.props.item.eventName,
      room: this.props.item.roomName,
      start: this.props.item.start,
      end: this.props.item.end
    }
  }

  onClickDelete() {
    const { item, deleteItem } = this.props;
    deleteItem(item.id)
  }

  onClickEdit() {
    this.setState({editing: true})
  }

  onUpdateTitle(e) {
    this.setState({
      eventName: e.target.value
    })
  }

  onUpdateRoom(e) {
    this.setState({
      room: e.target.value
    })
  }

  onUpdateStartTime(e) {
    this.setState({
      start: moment(e).format()
    })
  }

  onUpdateEndTime(e) {
    this.setState({
      end: moment(e).format()
    })
  }

  onClickCancel() {
    this.setState({editing: false});
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { item, updateItem } = this.props;

    updateItem(item.id, this.state.eventName, this.state.room, this.state.start, this.state.end)
    this.setState({editing: false});

  }

  render(){

    const { item } = this.props;

    return (
      <li>
        { this.state.editing ?
          <form className= "editForm" onSubmit={this.onFormSubmit.bind(this)}>

            <label>Title:</label>
            <input onChange={this.onUpdateTitle.bind(this)}
                  className="cardHeader"
                  defaultValue={item.eventName}/>

            <label>Room Name:</label>
            <input onChange={this.onUpdateRoom.bind(this)}
                   className="cardHeader"
                   defaultValue={item.roomName}/>

            <label>Start Time:</label>
            <DateTime onChange={this.onUpdateStartTime.bind(this)}
                      defaultValue={moment(item.start).format('MM-DD-YYYY hh:mm a')}
                      dateFormat="MM-DD-YYYY" />

            <label>End Time:</label>
            <DateTime onChange={this.onUpdateEndTime.bind(this)}
                      defaultValue={moment(item.end).format('MM-DD-YYYY hh:mm a')}
                      dateFormat="MM-DD-YYYY" />

            <div className="itemTools">
              <i className="fa fa-close" onClick={this.onClickCancel.bind(this)}/>
              <button type="Submit" className="fa fa-save" onClick={this.onFormSubmit.bind(this)}/>
            </div>

          </form>
        :
        <Element name={`item${item.id}`}>
          <div className="cardContainer">
            <div className="cardTime">
              <p>{moment(item.start).format('hh:mm a')}</p>
              <p>{moment(item.end).format('hh:mm a')}</p>
              <p>{item.duration}</p>
            </div>
            <div className="cardInfo">
              <p className="cardHeader">{item.eventName}</p>
              <p>{item.roomName}</p>
            </div>
            <div className="itemTools">
              <i className="fa fa-edit" onClick={this.onClickEdit.bind(this)}/>
                <i className="fa fa-trash" onClick={this.onClickDelete.bind(this)}/>
            </div>
          </div>
        </Element>
        }
      </li>
    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
}
