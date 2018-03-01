import React from "react";
import ReactDOM from "react-dom";

const element = <h1>Hello, world</h1>;

class sqkey extends React.Component {
    render() {
       return 
        <div class="col-3">
           <img src="../src/img/folder.svg" class="button-icon"></img>
               <h3 class="over">{this.props.foldername}</h3>
               <div type="button" id="right" class="sel-button ">
                <div class="{this.props.keyname}"></div>
                </div>
           </div>
    }
}

ReactDOM.render(element, document.getElementById('root'));

