import React from 'react';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
    };

    render(){
        var loading = <h1>Loading . . . </h1>;
        var border = this.props.border;
        if (typeof(this.props.border) === "undefined"){
            border = <div className="row col-xs-12"></div>;
        } else if (this.props.border === "black") {
            border = <div className="row col-xs-12 dark-top" style={blackBorder}></div>
        }

        return (
        <div className="row col-xs-12 accent-center" style={{paddingTop: "120px"}}>
            <div className="container light">
                <div className="row col-xs-12">
                    {this.props.header}
                </div>
            </div>
            <div className="container light" style={noPadding}>
                <div className="row col-xs-12" style={noPadding}>
                    <div className="row">
                        {border}
                    </div>
                </div>
            </div>
            <div className="container light">
                <div className="row col-xs-12">
                    <div className="row col-xs-12" style={noRadius}>
                        <div className="row col-xs-12">
                            <br/><br/>
                        </div>

                        {(!("loaded" in this.props) || this.props.loaded) ? this.props.content : loading}

                    </div>

                    <div className="row col-xs-12">
                        <br/><br/><br/><br/><br/><br/>
                    </div>
                </div>

            </div>
        </div>
        );
    }
}

export default Wrapper;
