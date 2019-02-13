import * as React from 'react';
import './App.css';
import * as Webcam from "react-webcam";
import Button from '@material-ui/core/Button';

import logo from './logo.svg';


interface IState{
  recognitionResult: any,
  nameLabel: string,
  refCamera: any
}

class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      recognitionResult: null,
      nameLabel: "",
      refCamera: React.createRef(),
    }     
  }

  
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        <div className="container">

            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              ref={this.state.refCamera}
            />

            <div className="container">
            <Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="primary" onClick= {this.authenticate}>Test</Button>
            <h1 id="label">Hi</h1>
            </div>


        
        
        </div>
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
              alert("Unrecognised, please try again")
						} else {
              this.updateResult;
              alert(this.state.recognitionResult.tagName)

						}
					})
					
				}
			})
  }

  private updateResult(){
    var label = document.getElementById("label")!;
    label.innerHTML= this.state.recognitionResult.tagName;
    alert("updated")

  }
  
  private authenticate =() => {
    const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
  }
  

















}




export default App;
