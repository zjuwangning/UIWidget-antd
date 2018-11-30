import React from 'react'
import {Row} from 'antd'
import PropTypes from 'prop-types'

class SLabel extends React.Component{
    static props = {
        style: PropTypes.object,
        onClick: PropTypes.func,
        title: PropTypes.node,
        value: PropTypes.node
    };

    static defaultProps = {
        style: {},
        onClick: () => {},
        title: "",
        value: ""
    };

    constructor(props){
        super(props);

        this.state = {
            title: this.props.title,
            value: this.props.value
        }
    }

    componentWillReceiveProps(next){
        this.setState({
            title: next.title,
            value: next.value
        });
    }

    render(){
        let {value, title} = this.state
        let style = {
            height: "2.5vh",
            fontSize: "1.5vh",
            fontWeight: "normal",
            marginRight:"5px"
        };
        return (
            <Row
                type="flex"
                align="middle"
                style={Object.assign(style, this.props.style)}
                onClick={this.props.onClick}
            >
                {title}
                {value === 0 ? "0" : value}
            </Row>
        );
    }
}

export default SLabel