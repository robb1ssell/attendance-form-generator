import React, { Component } from 'react';
import { PulseLoader } from 'react-spinners';

class FormPreview extends Component {
  render() {
    return (
      <div>
        <h3>Discussion Type: {this.props.discussionType}</h3>
          <div>Tech UID: {this.props.techUid}</div>
          <div id='techInfo'></div>
          <PulseLoader
            sizeUnit={"px"}
            size={10}
            margin={'2px'}
            color={'#aaaaaa'}
            loading={this.props.techLoading}
          />
        
        <h5>Date(s) of Absence</h5>
          <div>Start Date: {this.props.absenceStartDate.format('MM/DD/YYYY')}</div>
          <div>End Date: {this.props.absenceEndDate.format('MM/DD/YYYY')}</div>
        
        <h5>Return to Work Date</h5>
          <div>{this.props.rtwDate.format('MM/DD/YYYY')}</div>
        
        {/* AT&T’s expectation on Attendance (SW OP45 “RTW” verbiage). */}
        <h5>AT&T's Expectation for Attendance</h5>
          <p>
            Good attendance is not only expected, it is a condition of employment. 
            The Company's position on attendance is that good attendance and punctuality are basic 
            requirements of a satisfactory employee. While it is recognized that an occasional 
            absence is sometimes unavoidable, the Company expects its employees to maintain reasonable 
            health standards, take intelligent precautions against illnesses/accidents, and not allow 
            inconveniences to keep them away from the job. Good attendance means a demonstrated ability 
            to be on the job on time over sustained periods of time.
          </p>

        <h5>Active Steps of Discipline</h5>
          <div id='discipline'></div>
          <PulseLoader
            sizeUnit={"px"}
            size={10}
            margin={'2px'}
            color={'#aaaaaa'}
            loading={this.props.discLoading}
          />
        
        <h5>Date(s) of Previous Absence(s)</h5>
          <div id='occurrences'></div>
          <PulseLoader
            sizeUnit={"px"}
            size={10}
            margin={'2px'}
            color={'#aaaaaa'}
            loading={this.props.occLoading}
          />
        
        <h5>Current Attendance Rating</h5>
          <div>{this.props.attendRating}</div>

        <h5>Next Action if No Improvement</h5>
          <div>{this.props.consequence}</div>

        <h5>FMLA</h5>
          <div>Eligible? {this.props.fmlaEligible}</div>
          <div>Refused FMLA? {this.props.fmlaRefuse}</div>
          <div>Reason: {this.props.fmlaReason}</div>
          <div>{this.props.fmlaNote}</div>

        <h5>EAP/Lifecare</h5>
          <div>{this.props.eapDisplay}</div>
          <div>{this.props.lifecareDisplay}</div>
        
        <h5>Employee Commitment / Steps for Improvement</h5>
          <div>{this.props.commitment}</div>
          
        <div id="sigs">
          <p className='signature-line'>______________________________________________________________________</p>
          <p className='signature-line'>Technician Signature _________________________________________</p>
          <p className='signature-line'>Manager Signature ___________________________________________</p>
          <p className='signature-line'>Date Given To Employee _______________________</p>
        </div>
      </div>
    );
  }
}

export default FormPreview;