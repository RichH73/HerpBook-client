import date from 'date-and-time';
import "./ViewShame.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../../../actions/index";
import React, { Component, useRef } from "react";
import { get, cloneDeep } from 'lodash';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import ReactGA from "react-ga";
import ReactHtmlParser from 'react-html-parser';
import HtmlParser from 'react-html-parser';
class ViewShame extends Component {
  state = {
    styles: {
      zIndex: 300,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      position: 'relative',
      left: 0,
      top: 0,
      display: 'none'
    },
    image: {
      name: '',
      address: ''
    }
    
  }

editorProps = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['emoji'], ['clean']
    ],
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  },
  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'emoji'
  ],
  readOnly: false,
  type: 'write'
}

  componentDidMount() {
    //ReactGA.pageview("/welcome");
  }

  imgFloatingDiv = (image) => {
    const imgAddress = `https://www.herpbook.com/wall_of_shame/${image}`
    this.props.newFloatingImage(imgAddress)
  }

  hideFloatingImage = () => {
    this.props.hideFloatingImage()
  }

  displayImages = (imgs) => {
    return(
      imgs.map(image => (
        <div className='wall-of-shame-images'><img src={`https://www.herpbook.com/wall_of_shame/${image}`} onClick={()=> this.imgFloatingDiv(image)} alt={image}/></div>
      ))
    )
  }

  submitHandler = (data) => {
    const { uid, username, first_name, last_name} = this.props.user
    const commentBox = this.refs.commentBox
    let commentData = {
      reportId: get(data, '_id'),
      uid: uid,
      username: username,
      firstName: first_name,
      lastName: last_name,
      comment: this.props.comment,
      date: Date()
    }
        
    axios({
      method: 'post',
      url: `${this.props.server_address}/shame/new_report_comment`,
      headers: {
        Authorization: `bearer ${localStorage.token}`
      },
      data: commentData
    })
    .then((response) => {
      console.log({
        commentData: commentData,
        responseData: response.data
      })
      if(response.status === 201) {
        this.props.shameReportComment(commentData)
        this.props.clearRichText()
      // commentBox.value = ''
      //this.props.history.push('/user_reports')
      }
    })
  }

commentMapper = (comments) => {
  return comments.map(comment => (
    <React.Fragment>
      <div className='wall-of-shame-user-report-comment'>Comment by: {comment.username}<br/><small>{date.format(new Date(comment.date), 'dddd MMMM DD h:mmA')}</small><br/>
      {/* <ReactQuill className='right-column-news-body'
                value={comment.comment}
                readOnly={true}
                style={{fontSize: '.9em', backgroundColor: 'transparent'}}
                theme='bubble'>
                <div className="my-editing-area" style={{fontSize: '1em'}} />
              </ReactQuill> */}
      </div>
    </React.Fragment>
  ))
}

onChangeHandler = (event, report) => {
  event.preventDefault();
  this.props.fileNewReport([event.target.name], event.target.value);
  this.props.fileNewReport('testing', report)
}

  render() {
    const pattern = date.compile('MMM D YYYY h:m:s A');
    const myDate = date.parse('Mar 22 2019 2:54:21 PM', pattern);
    console.log('my date', myDate)
    if(this.props.location.reportId === undefined)this.props.history.push('/user_reports')
    const report = this.props.shames.filter(shame => shame._id === this.props.location.reportId)
    const { username } = this.props.user
    return (
    <React.Fragment>
      {
        report.map(report => (
      <div className='wall-of-shame-user-reports'>
        <div className='wall-of-shame-user-report'>

      <div className='wall-of-shame-user-reports-business-name'><h3>{report.business_name}</h3>{<div style={{float: 'right', cursor: 'pointer'}}>{console.log(report)}...</div>}</div>

      <div className='wall-of-shame-user-reports-business-owner-name'>
            <label className='wall-of-shame-user-reports-label'>Business Owners Name:</label>
            <div className='wall-of-shame-user-reports-business-owner wall-of-shame-attribute'>{report.business_owner}</div>
      </div>

      <div className='wall-of-shame-user-reports-website'>
            <label className='wall-of-shame-user-reports-label'>Website URL:</label>
            <div className='wall-of-shame-attribute'>{report.business_website}</div>
      </div>

      <div className='wall-of-shame-user-reports-email'>
            <label className='wall-of-shame-user-reports-label'>Email Address:</label>
            <div className='wall-of-shame-attribute'>{report.business_email}</div>
      </div>

      <div className='wall-of-shame-user-reports-business-phone-number'>
            <label className='wall-of-shame-user-reports-label'>Phone Number:</label>
            <div className='wall-of-shame-attribute'>{report.business_phone}</div>
      </div>

      <div className='wall-of-shame-user-reports-incident-desription'>
            <label className='wall-of-shame-user-reports-label'>Description of issue:</label>
            <div className='wall-of-shame-user-reports-incident-description'>
              {HtmlParser(report.incident_description)}
              </div>
      </div>

    {report.images ? <div className='wall-of-shame-user-report-images'>{this.displayImages(report.images)}</div> : ''}

    {report.shameComments ? <div className='wall-of-shame-user-report-comments'>{this.commentMapper(report.shameComments)}</div> : ''}
      <div className='wall-of-shame-user-report-leave-comment'>
          <label>Leave a comment:</label>
          <div>
            <button onClick={()=> this.submitHandler(report)}>Submit</button>
          </div>
        </div>
    {
    this.props.floatImage ? <div style={this.props.displayFloatingImage.styles} onClick={this.hideFloatingImage}>
    <div className='wall-of-shame-user-report-imgFl'>
    <img src={this.props.imgAddress} alt=''/>
    </div>
    </div> : ''
    }
    </div>
        </div>
        ))
  }
    </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  //displayFloatingImage: state.floatingImage,
  //floatImage: state.floatingImage.displayFloatingImage,
  //imgAddress: state.floatingImage.image,
  server_address: state.config.server_address,
  shames: state.wallOfShame.newReports,
  registeredUser: state.userLoggedIn,
  user: state.user,
  comment: state.richText.text
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewShame);
