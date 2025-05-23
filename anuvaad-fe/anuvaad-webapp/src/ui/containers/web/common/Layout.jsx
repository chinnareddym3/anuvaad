import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Header from "../../../components/web/common/Header";
import GlobalStyles from "../../../styles/web/styles";
import Spinner from "../../../components/web/common/Spinner";
// import Theme from "../../theme/web/theme-red";
import Snackbars from '../../../components/web/common/Snackbar'
import Theme from "../../../theme/web/theme-anuvaad";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import history from "../../../../web.history";

import { showSidebar } from '../../../../flux/actions/apis/common/showSidebar';
import TopHeader from "../../../components/web/common/TopHeader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      tocken: false,
      matches: window.matchMedia("(max-width: 1120px)").matches
    };
  }

  renderSpinner() {
    if (this.props.apistatus.progress) {
      return <Spinner />;
    }
  }

  handlDrawerTocken = () => {
    // this.setState({ tocken: true })
    if (this.props.open_sidebar === true) {
      this.props.showSidebar(false)
    }
  }

  handleTockenChange() {
    // this.setState({ tocken: !this.state.tocken })
    this.props.showSidebar()
  }


  renderMessage() {
    if (this.props.apistatus.message) {
      return <Snackbars message={this.props.apistatus.message} variant={this.props.apistatus.error ? 'error' : 'success'} autoHideDuration={5000} />;
    }
  }

  componentDidMount() {
    // when user logout from other tab, auto logout from other tab also.
    this.clearSession = setInterval(() => {
      let authToken = localStorage.getItem('token');
      if (!authToken) {
        history.push(`${process.env.PUBLIC_URL}/logout`);
      }
    }, 4000);
  }

  componentWillUnmount(){
    clearInterval(this.clearSession);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.apistatus !== this.props.apistatus) {
      if (this.props.apistatus.unauthrized) {
        history.push(`${process.env.PUBLIC_URL}/logout`);
      }
    }
  }

  render() {
    const { classes, theme, title, drawer, showLogo, forDemo, dontShowLoader, dontShowHeader, currentMenu, headerAttribute } = this.props;
    const Component = this.props.component; // eslint-disable-line
    return (
      <MuiThemeProvider theme={Theme}>
        <TopHeader currentMenu={currentMenu} dontShowHeader={dontShowHeader} />
        <div className={classes.root} >
          {!dontShowLoader &&
            this.renderSpinner()
          }

          {/* <Header toolBarComp={headerAttribute} dontShowHeader={dontShowHeader} currentMenu={currentMenu} forDemo={forDemo || showLogo} classes={classes} theme={theme} title={title} drawer={drawer} tocken={this.state.tocken} handleTockenChange={this.handleTockenChange.bind(this)} /> */}

          <div style={dontShowHeader ? { width: '100%' } : {}} className={dontShowHeader ? '' : (forDemo ? classes.containerDemo : classes.container)} onClick={this.handlDrawerTocken.bind(this)}>

            <Component />
          </div>
          {this.renderMessage()}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  userProfile: state.userProfile,
  open_sidebar: state.open_sidebar.open
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      showSidebar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(App));
