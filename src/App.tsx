import * as React from 'react';
import './App.css';
import * as Webcam from "react-webcam";
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';


// import logo from './logo.svg';


interface IState{
  recognitionResult: any,
  nameLabel: string,
  refCamera: any,
  openConfirmDlg: boolean,
  openFailedDlg: boolean,
  loading: boolean,
}

class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      recognitionResult: null,
      nameLabel: "",
      refCamera: React.createRef(),
      openConfirmDlg: false,
      openFailedDlg: false,
      loading: false,
    }     
  }

  private handleClose = () => {
    this.setState({ 
        openConfirmDlg: false,
        openFailedDlg: false,
    });
  };

  
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Welcome</h1>
        </header>
        <div className="container webcam">

            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              ref={this.state.refCamera}
            />

            <div className="container">
            
            {!this.state.loading &&
            <Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="primary" onClick= {this.authenticate}>Test</Button>            
            }

            {this.state.loading &&
            <button className="btn btn-primary btn-action btn-add" type="button" disabled>
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
              Loading...
            </button>
            }
            </div>
        
        </div>

          <Dialog className="menu" open={this.state.openConfirmDlg} keepMounted aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
              <DialogTitle id="alert-dialog-slide-title">{"Recognition Success!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">     
                  <div id="bottom-info">
                    <div className="menu-col">
                    Hello, {this.state.nameLabel}!
                      </div>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    CLOSE
                </Button>
              </DialogActions>
          </Dialog>

          <Dialog className="menu" open={this.state.openFailedDlg} keepMounted aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
              <DialogTitle id="alert-dialog-slide-title">{"Recognition Failed"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">     
                  <div id="bottom-info">
                    <div className="menu-col">
                      <p>Sorry, you have not been recognised.</p>
                      <p>You may not be in the system.</p>
                    </div>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    CLOSE
                </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }



  private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/6a7d7446-59e9-4194-8789-41c543bd7739/image"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'cache-control': 'no-cache', 'Prediction-Key': '271c814d8fcc4bb3acb61af95f34ce00', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})	
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])
						this.setState({recognitionResult: json.predictions[0] })
						if (this.state.recognitionResult.probability <= 0.8) {
              // alert("Unrecognised, please try again")
              this.setState({
                loading: false,
                openFailedDlg: true,
              })
            } else {
              this.setState({
                loading: false,
                nameLabel: this.state.recognitionResult.tagName,
                openConfirmDlg: true
                
                
              })
						}
					})
					
				}
			})
  }

  // private updateResult(){
  //   var label = document.getElementById("label")!;
  //   label.innerHTML= this.state.recognitionResult.tagName;
  //   alert("updated")

  // }
  
  private authenticate =() => {
    this.setState({
      loading: true
    })
    const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
  }


  

















}




export default App;
