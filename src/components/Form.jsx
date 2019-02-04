import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Form extends Component {

  render() {
    return (
      <div>
        <form name='attendanceForm'>

          {/* Discussion Type selection - could add more later */}
          <div>
            <label htmlFor="type-of-discussion"><span>Type of Discussion</span></label>
            <select id='type-of-discussion' onChange={(e) => this.props.updateDiscussionType(e.target.value)}>
              <option value=""></option>
              <option value="Return to Work">Return to Work</option>
              <option value="FMLA Denial">FMLA Denial</option>
            </select>
          </div>

          {/* Tech UID entry - queries hierarchy table to gather some tech info */}
          <div>
            <label htmlFor='tech-uid-input'><span>Tech UID</span></label>
            <input
              id='tech-uid-input'
              type='text'
              maxLength='6'
              value=''
              onChange={(e) => this.props.updateTechUid(e.target.value)}
            />
            <span><button onClick={this.props.clearTech}>Clear</button></span>
          </div>

          <div>
            <h5>Date(s) of Absence</h5>
            <label htmlFor='absence-start-date-picker'>Start Date</label>
            <DatePicker
              id='absence-start-date-picker'
              placeholderText='Start Date'
              selected={this.props.absenceStartDate}
              selectsStart
              startDate={this.props.absenceStartDate}
              endDate={this.props.absenceEndDate}
              onChange={this.props.handleAbsenceStartChange}
            />

            <label htmlFor='absence-end-date-picker'>End Date</label>
            <DatePicker
              id='absence-end-date-picker'
              placeholderText='End Date'
              selected={this.props.absenceEndDate}
              selectsEnd
              startDate={this.props.absenceStartDate}
              endDate={this.props.absenceEndDate}
              onChange={this.props.handleAbsenceEndChange}
            />
          </div>

          <div>
            <label htmlFor=""><h5>Return to Work Date</h5></label>
            <DatePicker
              selected={this.props.rtwDate}
              onChange={this.props.handleRtwDateChange}
            />
          </div>

          {/* Attendance rating - subject to manager discretion */}
          <div>
            <h5>Attendance Rating</h5>
              <ul className='form-radio-list'>
                <li>
                  <input 
                    type="radio"
                    name='attendRating'
                    id='satisfactory'
                    value='Satisfactory'
                    onClick={(e) => this.props.updateAttendRating(e.target.value)}
                  />
                  <label htmlFor="satisfactory">Satisfactory</label>
                </li>

                <li>
                  <input 
                    type="radio"
                    name='attendRating'
                    id='unsatisfactory'
                    value='Unsatisfactory'
                    onClick={(e) => this.props.updateAttendRating(e.target.value)}
                  />
                <label htmlFor="unsatisfactory">Unsatisfactory</label>
              </li>
            </ul>
          </div>

          {/* List of discipline recommendations for SW */}
          <div>
            <label htmlFor="reccomend-action"><h5>Next Action if No Improvement</h5></label>
            <select id='reccomend-action' onChange={(e) => this.props.updateConsequence(e.target.value)}>
              <option value=""></option>
              <optgroup label='CWA'>
                <option value="Employee Discussion">Employee Discussion</option>
                <option value="Performance Notice">Performance Notice</option>
                <option value="Written Reminder">Written Reminder</option>
                <option value="Decision-Making Leave">Decision-Making Leave</option>
                <option value="Separation Proposal">Separation Proposal</option>
              </optgroup>
              <optgroup label='IBEW'>
                <option value="Coaching Discussion">Coaching Discussion</option>
                <option value="Verbal Warning">Verbal Warning</option>
                <option value="First Written Warning">First Written Warning</option>
                <option value="Second Written Warning/1-Day Suspension">Second Written Warning/1-Day Suspension</option>
                <option value="Final Written Warning/3-Day Suspension">Final Written Warning/3-Day Suspension</option>
                <option value="Suspension Pending Dismissal">Suspension Pending Dismissal</option>
              </optgroup>
            </select>
          </div>

          {/* Radio button selections for FMLA eligibility
              Input options change based on active selection
              using css class 'reveal-if-active'
          */}
          <div>
            <h5>Is Employee FMLA Eligible?</h5>
            <ul className='form-radio-list'>
              <li>
                <input 
                  type="radio"
                  name='fmla-eligible'
                  id='fmla-eligible-yes'
                  value='Yes'
                  onClick={(e) => this.props.updateFmlaEligible(e.target.value)}
                />
                <label htmlFor="fmla-eligible-yes">Yes</label>
                <div className='reveal-if-active'>
                  <p>Did Employee Refuse FMLA?</p>
                  <ul className='form-radio-list'>
                    <li>
                      <input 
                        type="radio"
                        name='fmla-refuse'
                        id='fmla-refuse-yes'
                        value='Yes'
                        onClick={(e) => this.props.updateFmlaRefuse(e.target.value)}
                        />
                      <label htmlFor="fmla-refuse-yes">Yes</label>
                      <div className='reveal-if-active'>
                        <p>Reason?</p>
                        <textarea 
                          name="fmla-refuse-input" 
                          id="fmla-refuse-input" 
                          cols="60" 
                          rows="3"
                          onChange={(e) => this.props.updateFmlaReason(e.target.value)}
                        >
                        </textarea>
                      </div>
                    </li>

                    <li>
                      <input 
                        type="radio" 
                        name="fmla-refuse" 
                        id="fmla-refuse-no"
                        value={`Management is aware that you may be eligible for FMLA protection 
                               and that FMLA has been/will be submitted via LeaveLink for your 
                               recent absence on ${this.props.absenceStartDate.format('MM/DD/YYYY')} 
                               to ${this.props.absenceEndDate.format('MM/DD/YYYY')}. You are responsible for submitting 
                               your LeaveLink request within 48 hours of your return to work date 
                               (the 48hrs includes the first day you return and the next day after. Therefore, 
                               your claim must be submitted by close of business the day AFTER your return to work date). 
                               The Employer Response Packet will be emailed to you by LeaveLink. Be advised that you are 
                               responsible for ensuring that the Certification of Health Care Provider form is completed 
                               and uploaded by you to LeaveLink or mailed to the Corporate Attendance Leave Management 
                               (CALM) Processing Center by the form due date. Failure to submit the Certification of Health 
                               Care Provider form on time will result in a FMLA Final Denial of the FMLA claim.
                               Leave link url: 
                               https://www.e-access.att.com/usersvcs/cspsaml/?service=sedgwickrr&servicetype=prod`}
                        onClick={(e) => this.props.addFmlaNote(e.target.value)}
                      />
                      <label htmlFor="fmla-refuse-no">No</label>
                      {/*
                      <div className='reveal-if-active'>
                        <p>Reason?</p>
                        <textarea 
                          name="fmla-refuse-input" 
                          id="fmla-refuse-input" 
                          cols="60" 
                          rows="3"
                          onChange={(e) => this.props.updateFmlaReason(e.target.value)}
                        >
                        </textarea>
                      </div>
                      */}
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <input 
                  type="radio"
                  name='fmla-eligible'
                  id='fmla-eligible-no'
                  value='No'
                  onClick={(e) => this.props.updateFmlaEligible(e.target.value)}
                />
                <label htmlFor="fmla-eligible-no">No</label>
                <div className='reveal-if-active'>
                  <p>Reason?</p>
                  <textarea 
                    name="fmla-not-eligible-input" 
                    id="fmla-not-eligible-input" 
                    cols="60" 
                    rows="3"
                    onChange={(e) => this.props.updateFmlaReason(e.target.value)}
                  >
                  </textarea>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h5>EAP or Lifecare Offered?</h5>
            <ul className="form-radio-list">
              <li>
                <input 
                  type="radio" 
                  name="eap-lifecare" 
                  id="eap-lifecare-yes"
                  value='Yes'
                />
                <label htmlFor="eap-lifecare-yes">Yes</label>
                <div className="reveal-if-active">
                  <input 
                    type="checkbox" 
                    name="eap" 
                    id="eap-checkbox"
                    value="EAP-Employee Assistance Program - The Employee 
                      Assistance Program (EAP) provides professional and 
                      confidential assistance to employees and their families 
                      who are experiencing personal or work-related problems 
                      that may affect the quality of your personal or professional 
                      life. ValueOptions administers the EAP programs, and can 
                      be reached at 800-554-6701."
                    onClick={(e) => this.props.updateEAP(e.target.value)}
                  /> EAP
                  <input 
                    type="checkbox" 
                    name="lifecare" 
                    id="lifecare-checkbox"
                    value="Lifecare - For more information, visit the LifeCare site on the 
                      Internet at http://www.lifecare.com. New users enter Registration 
                      Code: att and Member ID: your AT&amp;T User ID. For assistance 
                      logging on, contact the Lifecare Help Desk at 888-604-9565."
                    onClick={(e) => this.props.updateLifecare(e.target.value)}
                  /> Lifecare
                </div>
              </li>

              <li>
                <input 
                  type="radio" 
                  name="eap-lifecare" 
                  id="eap-lifecare-no"
                  value='No'
                  onClick={(e) => this.props.clearEapLifecare(e.target.value)}
                />
                <label htmlFor="eap-lifecare-no">No</label>
              </li>
            </ul>
          </div>

          <div>
            <h5>Employee Commitment / Steps for Improvement</h5>
            <textarea 
              name="fmla-not-eligible-input" 
              id="fmla-not-eligible-input" 
              cols="60" 
              rows="3"
              onChange={(e) => this.props.updateCommitment(e.target.value)}
            >
            </textarea>
          </div>
        </form>
      </div>
    );
  }
}

export default Form;