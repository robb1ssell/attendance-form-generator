import React, { Component } from 'react';
import * as jsPDF from 'jspdf'
import './styles/App.css';
import Form from './components/Form'
import FormPreview from './components/FormPreview'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './components/Footer';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.pdfToHTML=this.pdfToHTML.bind(this);
    this.handleRtwDateChange = this.handleRtwDateChange.bind(this);
    this.handleAbsenceStartChange = this.handleAbsenceStartChange.bind(this);
    this.handleAbsenceEndChange = this.handleAbsenceEndChange.bind(this);
  }

  state = {
    techUid: '',
    techFirstName: '',
    techLastName: '',
    hits: [],
    techLoading: false,
    occLoading: false,
    discLoading: false,
    error: null,
    discussionType: '',
    attendRating: '',
    consequence: '',
    fmlaEligible: '',
    fmlaRefuse: '',
    fmlaReason: '',
    fmlaNote: '',
    eapDisplay: '',
    lifecareDisplay: '',
    commitment: '',
    rtwDate: moment(),
    absenceStartDate: moment().subtract(1, 'd'),
    absenceEndDate: moment(),
    pdfSaveDate: moment(),
    occurrenceData: []
  }

  // Using jspdf npm package
  // Selects a div and saves the html content of the div to a pdf file
  // Adapted from: https://stackoverflow.com/q/41529149/10140836
  pdfToHTML(){
    //console.log('test');
    let pdf = new jsPDF('p', 'pt', 'letter');
    let source = document.getElementById('html-to-pdf');
    let specialElementHandlers = {
      '#bypassme': function(element, renderer) {
        return true
      }
    };

    // Margins for pdf
    let margins = {
      top: 50,
      bottom: 50,
      right: 60,
      left: 60,
      width: 480
    };

    pdf.fromHTML (
      source // HTML string or DOM elem ref.
      , margins.left // x coord
      , margins.top // y coord
      , {
          'width': margins.width // max width of content on PDF
          , 'elementHandlers': specialElementHandlers
        },
      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        // this allow the insertion of new lines after html
        /****** TODO: format save string with tech name - discussion type - date  ***********/
        pdf.save('attendance-doc');
      },
      margins // Margins for pdf get set here using margins object
    )
  }

  handleAbsenceStartChange = (date) => {
    this.setState({
      absenceStartDate: date
    });
  }

  handleAbsenceEndChange = (date) => {
    this.setState({
      absenceEndDate: date
    });
  }

  handleRtwDateChange = (date) => {
    this.setState({
      rtwDate: date
    });
  }

  // Clear state of techUid and techNames if input is blank
  // Updates preview in real time
  // When a full Uid is typed in, query will run to gather tech info
  updateTechUid = (techUid) => {
    if (!techUid) {
      this.setState({
        techUid: '',
        techFirstName: '',
        techLastName: ''
      });
    } else {
      this.setState({
        techUid: techUid.trim()
      });
    }

    if (techUid.length === 6) {
      // Indicate to the user that something is happening after entering UID
      this.setState({
        techLoading: true,
        occLoading: true,
        discLoading: true
      });
      // had to setTimeout here because function would fire
      // before 6th character was registered in state
      setTimeout(this.techInfoApiCall, 500);
      setTimeout(this.occurrenceApiCall, 500);
      setTimeout(this.disciplineApiCall, 500);
    }
  }

  // Gets called when user clicks the clear button beside tech uid input field
  // Clears any generated information without reloading the page
  clearTech = (e) => {
    //stops page from refreshing when clear button is pressed
    e.preventDefault(); 

    //clears tech uid input field and clears state of techUid
    //also clears loading bars
    document.getElementById('tech-uid-input').value = "";
    this.setState({
      techUid: '',
      techLoading: false,
      occLoading: false,
      discLoading: false
    });

    //clears information that is generated from techUid input
    document.getElementById('techInfo').innerHTML = "";
    document.getElementById('occurrences').innerHTML = "";
    document.getElementById('discipline').innerHTML = "";
  }

  // Using axios to get json object
  // Loop through the results and print out records that match the uid in state
  occurrenceApiCall = () => {
    let uid = this.state.techUid;
    let occurContainer = document.getElementById('occurrences');
    axios({
      method: 'get',
      url: '../../api/rtw/occurrenceapi.php' + '?nocache=' + new Date().getTime(), // Safari fix
      withCredentials: true
    }).then(result => {
          for(let i=0; i < result.data.records.length; i++){
            if (result.data.records[i].techUid === uid) {
              occurContainer.innerHTML += 
                `<p>
                  <span>${result.data.records[i].occurrenceDate} |</span>
                  <span><strong>${result.data.records[i].timeCode}</strong> |</span>
                  <span>${result.data.records[i].hours}</span>
                </p>`
            }
          }
          //clear loading bar after loop is complete
          this.setState({
            occLoading: false
          });
		  }).catch(err => {
			  console.log(err)
      });
  }

  // Using axios to get json object
  // Loop through the results and print out records that match the uid in state
  disciplineApiCall = () => {
    let uid = this.state.techUid;
    let discContainer = document.getElementById('discipline');
    axios({
      method: 'get',
      url: '../../api/rtw/discnewapi.php' + '?nocache=' + new Date().getTime(), // Safari fix
      withCredentials: true
    }).then(result => {
          for(let i=0; i < result.data.records.length; i++){
            if (result.data.records[i].techUid === uid) {
              discContainer.innerHTML += 
                `<div>
                  <span><strong>${result.data.records[i].step}</strong> | </span>
                  <span>${result.data.records[i].category}</span>
                </div>
                <div>
                  <span>${result.data.records[i].step_date} | </span>
                  <span>${result.data.records[i].followup_date}</span>
                </div>`
            }
          }
          //clear loading bar after loop is complete
          this.setState({
            discLoading: false
          });
		  }).catch(err => {
			  console.log(err)
      });
  }

  // Using axios to get json object
  // Loop through the results and print out records that match the uid in state
  techInfoApiCall = () => {
    let uid = this.state.techUid;
    let techContainer = document.getElementById('techInfo');
    axios({
      method: 'get',
      url: '../../api/rtw/techinfoapi.php' + '?nocache=' + new Date().getTime(), // Safari fix
      withCredentials: true
    }).then(result => {
          for(let i=0; i < result.data.records.length; i++){
            if (result.data.records[i].lvl0Uid === uid) {
              techContainer.innerHTML += 
                `<div>
                  <span>Tech Name: ${result.data.records[i].lvl0Name}</span>
                </div>
                <div>
                  <span>NCS: ${result.data.records[i].ncs} | </span>
                  <span>Tenure: ${result.data.records[i].tenureGroup}</span>
                </div>
                <div>
                  <div>Manager UID: ${result.data.records[i].lvl1Uid}</div>
                  <div>Manager Name: ${result.data.records[i].lvl1Name}</div>
                </div>`
            }
          }
          //clear loading bar after loop is complete
          this.setState({
            techLoading: false
          });
		  }).catch(err => {
			  console.log(err)
      });
  }

  // Updates preview on user selection
  updateDiscussionType = (discussionType) => {
    this.setState({
      discussionType: discussionType
    });
  }

  // Updates preview on user selection
  updateAttendRating = (attendRating) => {
    this.setState({
      attendRating: attendRating
    });
  }

  // Updates preview on user selection
  updateConsequence = (consequence) => {
    this.setState({
      consequence: consequence
    });
  }

  // If FMLA Eligible buttons are clicked,
  // Uncheck and clear state of child options
  updateFmlaEligible = (fmlaEligible) => {
    let refuseButtons = document.getElementsByName('fmla-refuse');
    refuseButtons.forEach(function(button) {
      button.checked = false;
    });

    this.setState({
      fmlaEligible: fmlaEligible,
      fmlaRefuse: '',
      fmlaNote: ''
    });
    
    if (fmlaEligible === 'No') {
      console.log('test');
      this.setState({
        fmlaRefuse: 'N/A'
      });
    }
  }

  // Updates on click to yes or no to display in preview
  updateFmlaRefuse = (fmlaRefuse) => {
    this.setState({
      fmlaRefuse: fmlaRefuse,
      fmlaNote: ''
    });
  }

  // If the text area is blank, state is set to blank
  // When the user types, the preview is updated in real time
  // Chose not to clear textareas on button changes in case of user error
  // Preview updates correctly regardless of where user types
  updateFmlaReason = (fmlaReason) => {
    if (!fmlaReason) {
      this.setState({
        fmlaReason: ''
      });
    } else {
      this.setState({
        fmlaReason: fmlaReason.trim()
      });
    }
  }

  addFmlaNote = (fmlaNote) => {
    this.setState({
      fmlaRefuse: 'No',
      fmlaNote: fmlaNote,
      fmlaReason: 'N/A'
    });
  }

  // Accepts value from onclick event listener
  // If checked, add value to preview
  // else, clear the state to remove from preview
  updateEAP = (eapDisplay) => {
    if (document.getElementById('eap-checkbox').checked === true) {
      this.setState({
        eapDisplay: eapDisplay
      });
    } else {
      this.setState({
        eapDisplay: ''
      });
    }
  }

  // Accepts value from onclick event listener
  // If checked, add value to preview
  // else, clear the state to remove from preview
  updateLifecare = (lifecareDisplay) => {
    if (document.getElementById('lifecare-checkbox').checked === true) {
      this.setState({
        lifecareDisplay: lifecareDisplay
      });
    } else {
      this.setState({
        lifecareDisplay: ''
      });
    }
  }

  // If manager changes EAP/Lifecare offering to No,
  // clear the state and checkboxes
  clearEapLifecare = () => {
    document.getElementById('eap-checkbox').checked = false;
    this.setState({
      eapDisplay: ''
    });

    document.getElementById('lifecare-checkbox').checked = false;
    this.setState({
      lifecareDisplay: ''
    });
  }

  // If textarea is empty, clear state
  // Else, preview updates as user enters text
  updateCommitment = (commitment) => {
    if (!commitment) {
      this.setState({
        commitment: ''
      });
    } else {
      this.setState({
        commitment: commitment.trim()
      });
    }
  }

  componentDidMount(){
    let uid = document.getElementById('tech-uid-input').value;
    if(uid){
      this.updateTechUid(uid);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className="row">
          <div className="col-lg-12">
            <header>
              <h2>Attendance Form Generator</h2>
              <a href="./help.html">Help</a>
            </header>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-6">
            {/*
              The Form component is the left side of the web page. 
              All of the functions and variables are passed as props 
              so they can be accessed by the preview and generated into html.
            */}
            <Form
              techUid={this.state.techUid}
              updateTechUid={this.updateTechUid}
              enterUrlUid={this.enterUrlUid}
              clearTech={this.clearTech}
              discussionType={this.state.discussionType}
              updateDiscussionType={this.updateDiscussionType}
              attendRating={this.state.attendRating}
              updateAttendRating={this.updateAttendRating}
              consequence={this.state.consequence}
              updateConsequence={this.updateConsequence}
              fmlaEligible={this.state.fmlaEligible}
              updateFmlaEligible={this.updateFmlaEligible}
              fmlaRefuse={this.state.fmlaRefuse}
              updateFmlaRefuse={this.updateFmlaRefuse}
              fmlaReason={this.state.fmlaReason}
              updateFmlaReason={this.updateFmlaReason}
              fmlaNote={this.state.fmlaNote}
              addFmlaNote={this.addFmlaNote}
              eapDisplay={this.state.eapDisplay}
              updateEAP={this.updateEAP}
              lifecareDisplay={this.state.lifecareDisplay}
              updateLifecare={this.updateLifecare}
              clearEapLifecare={this.clearEapLifecare}
              commitment={this.state.commitment}
              updateCommitment={this.updateCommitment}
              absenceStartDate={this.state.absenceStartDate}
              handleAbsenceStartChange={this.handleAbsenceStartChange}
              absenceEndDate={this.state.absenceEndDate}
              handleAbsenceEndChange={this.handleAbsenceEndChange}
              rtwDate={this.state.rtwDate}
              handleRtwDateChange={this.handleRtwDateChange}
            />
          </div>
          <div className="col-md-6">
            <div id="html-to-pdf">
            {/*
              The Form Preview component is the right side of the web page. 
              The variables are passed as props to utilize state change tracking.
            */}
              <FormPreview
                techUid={this.state.techUid}
                techFirstName={this.state.techFirstName}
                techLastName={this.state.techLastName}
                techLoading={this.state.techLoading}
                occLoading={this.state.occLoading}
                discLoading={this.state.discLoading}
                error={this.state.error}
                discussionType={this.state.discussionType}
                attendRating={this.state.attendRating}
                consequence={this.state.consequence}
                fmlaEligible={this.state.fmlaEligible}
                fmlaRefuse={this.state.fmlaRefuse}
                fmlaReason={this.state.fmlaReason}
                fmlaNote={this.state.fmlaNote}
                eapDisplay={this.state.eapDisplay}
                lifecareDisplay={this.state.lifecareDisplay}
                commitment={this.state.commitment}
                absenceStartDate={this.state.absenceStartDate}
                absenceEndDate={this.state.absenceEndDate}
                rtwDate={this.state.rtwDate}
              />
            </div>
            <center>
              {/*This button runs the pdfToHTML function located at the top of this file*/}
              <button id='save-pdf' onClick={this.pdfToHTML}>Download PDF</button>
            </center>
          </div>
        </div>
        <Footer/>
      </div>
    );
  } 
}

export default App;
