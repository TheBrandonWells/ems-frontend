import React, {PropTypes} from "react";

import DateTime from 'react-datetime';
import moment from 'moment';

import * as Actions from "../../actions/itemActions.js"

import './styles.scss';

export default class ItemForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      newTitle: '',
      newRoom: '',
      newStart: '',
      newEnd: ''
    }
  }

  onTitleChange(e) {
    this.setState({newTitle: e.target.value})
  }

  onRoomChange(e) {
    this.setState({newRoom: e.target.value})
  }

  onStartChange(e) {
    console.log(e);
    this.setState({newStart: moment(e).format()})
  }

  onEndChange(e) {
  this.setState({newEnd: moment(e).format()})
  }

  onCancel(e) {
    e.preventDefault();
    this.props.handleFormClose(e)
  }

  onFormSubmit(e) {
    e.preventDefault();
    console.log('sending:', this.state)
    const { dispatch } = this.props;
    if (this.state.newTitle && this.state.newRoom && this.state.newStart && this.state.newEnd) {
      dispatch(Actions.addItem(this.state.newTitle, this.state.newRoom, this.state.newStart, this.state.newEnd))
    }
    this.props.handleFormClose(e)
  }
  render(){
    return (
      <div>
        <h2>Add a new Booking:</h2>
        <form className="newItemForm" onSubmit={this.onFormSubmit.bind(this)}>
          <div className="formRow">
            <label>Title:</label>
            <input type="text"
                   value={this.state.newTitle}
                   placeholder="Title (required)"
                   onChange={this.onTitleChange.bind(this)}
                   required/>
          </div>

          <div className="formRow">
            <label>Room Name:</label>
            <input type="text"
                   value={this.state.newRoom}
                   placeholder="Room Name (required)"
                   onChange={this.onRoomChange.bind(this)}
                   required/>
          </div>

          <div className="formRow">
           <label>Start Time:</label>
           <DateTime onChange={this.onStartChange.bind(this)}
                     dateFormat="MM-DD-YYYY"
                     required/>
          </div>

          <div className="formRow">
            <label>End Time:</label>
             <DateTime onChange={this.onEndChange.bind(this)}
                       dateFormat="MM-DD-YYYY"
                       required/>
          </div>

          <div className="formRow">
            <button type="submit" className="submitButton" disabled={!this.state.newTitle || !this.state.newRoom || !this.state.newEnd || !this.state.newStart }>Submit</button>
          </div>

          <div className="formRow">
            <a onClick={this.onCancel.bind(this)}>Cancel</a>
          </div>
        </form>
      </div>
    )
  }
}

ItemForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  handleFormClose: PropTypes.func.isRequired
}
