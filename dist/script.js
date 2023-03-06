// coded by @no-stack-dub-sack (github) / @no_stack_sub_sack (codepen)

/** NOTES:
/** Dependencies are React, ReactDOM, and 
    Accurate_Interval.js by Squuege (external script 
    to keep setInterval() from drifting over time & 
    thus ensuring timer goes off at correct mark).
/** Utilizes embedded <Audio> tag to ensure audio 
    plays when timer tab is inactive or browser is 
    minimized ( rather than new Audio().play() ).
/** Audio of this fashion not supported on most 
    mobile devices it would seem (bummer I know).
**/

// PROJECTOR SELECTOR FOR EXTERNAL TEST SCRIPT:
const projectName = 'pomodoro-clock';
localStorage.setItem('example_project', 'Pomodoro Clock');

// COMPONENTS:
class TimerLengthControl extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "length-control" }, /*#__PURE__*/
      React.createElement("div", { id: this.props.titleID },
      this.props.title), /*#__PURE__*/

      React.createElement("button", { id: this.props.minID,
        className: "btn-level", value: "-",
        onClick: this.props.onClick }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-down fa-2x" })), /*#__PURE__*/

      React.createElement("div", { id: this.props.lengthID, className: "btn-level" },
      this.props.length), /*#__PURE__*/

      React.createElement("button", { id: this.props.addID,
        className: "btn-level", value: "+",
        onClick: this.props.onClick }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-arrow-up fa-2x" }))));



  }}
;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brkLength: 5,
      seshLength: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' } };

    this.setBrkLength = this.setBrkLength.bind(this);
    this.setSeshLength = this.setSeshLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clockify = this.clockify.bind(this);
    this.reset = this.reset.bind(this);
  }
  setBrkLength(e) {
    this.lengthControl('brkLength', e.currentTarget.value,
    this.state.brkLength, 'Session');
  }
  setSeshLength(e) {
    this.lengthControl('seshLength', e.currentTarget.value,
    this.state.seshLength, 'Break');
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState == 'running') return;
    if (this.state.timerType == timerType) {
      if (sign == "-" && currentLength != 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign == "+" && currentLength != 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else {
      if (sign == "-" && currentLength != 1) {
        this.setState({ [stateToChange]: currentLength - 1,
          timer: currentLength * 60 - 60 });
      } else if (sign == "+" && currentLength != 60) {
        this.setState({ [stateToChange]: currentLength + 1,
          timer: currentLength * 60 + 60 });
      }
    }
  }
  timerControl() {
    let control = this.state.timerState == 'stopped' ? (
    this.beginCountDown(),
    this.setState({ timerState: 'running' })) : (

    this.setState({ timerState: 'stopped' }),
    this.state.intervalID && this.state.intervalID.cancel());

  }
  beginCountDown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000) });

  }
  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }
  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      this.state.timerType == 'Session' ? (
      this.state.intervalID && this.state.intervalID.cancel(),
      this.beginCountDown(),
      this.switchTimer(this.state.brkLength * 60, 'Break')) : (

      this.state.intervalID && this.state.intervalID.cancel(),
      this.beginCountDown(),
      this.switchTimer(this.state.seshLength * 60, 'Session'));

    }
  }
  warning(_timer) {
    let warn = _timer < 61 ?
    this.setState({ alarmColor: { color: '#a50d0d' } }) :
    this.setState({ alarmColor: { color: 'white' } });
  }
  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }
  switchTimer(num, str) {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: 'white' } });

  }
  clockify() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }
  reset() {
    this.setState({
      brkLength: 5,
      seshLength: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' } });

    this.state.intervalID && this.state.intervalID.cancel();
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "main-title" }, "Pomodoro Clock"), /*#__PURE__*/


      React.createElement(TimerLengthControl, {
        titleID: "break-label", minID: "break-decrement",
        addID: "break-increment", lengthID: "break-length",
        title: "Break Length", onClick: this.setBrkLength,
        length: this.state.brkLength }), /*#__PURE__*/
      React.createElement(TimerLengthControl, {
        titleID: "session-label", minID: "session-decrement",
        addID: "session-increment", lengthID: "session-length",
        title: "Session Length", onClick: this.setSeshLength,
        length: this.state.seshLength }), /*#__PURE__*/
      React.createElement("div", { className: "timer", style: this.state.alarmColor }, /*#__PURE__*/
      React.createElement("div", { className: "timer-wrapper" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-label" },
      this.state.timerType), /*#__PURE__*/

      React.createElement("div", { id: "time-left" },
      this.clockify()))), /*#__PURE__*/



      React.createElement("div", { className: "timer-control" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.timerControl }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-play fa-2x" }), /*#__PURE__*/
      React.createElement("i", { className: "fa fa-pause fa-2x" })), /*#__PURE__*/

      React.createElement("button", { id: "reset", onClick: this.reset }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-refresh fa-2x" }))), /*#__PURE__*/


      React.createElement("div", { className: "author" }, " Designed and Coded by ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/
      React.createElement("a", { target: "_blank", href: "https://goo.gl/6NNLMG" }, "Peter Weinberg")), /*#__PURE__*/



      React.createElement("audio", {
        id: "beep",
        preload: "auto",
        src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
        ref: audio => {
          this.audioBeep = audio;
        } })));



  }}
;

ReactDOM.render( /*#__PURE__*/React.createElement(Timer, null), document.getElementById('app'));