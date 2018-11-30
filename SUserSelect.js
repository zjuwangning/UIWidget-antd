import React from 'react'
import {Select} from './Santd'
import {Post, URL} from '../../system/Post'
import PropTypes from 'prop-types'
import {getOption} from "../../util/cmn";

export default class SUserSelect extends React.Component {
    static props = {
        display: PropTypes.bool,
        value: PropTypes.string,
        onSelect: PropTypes.func,
        onInputEnd: PropTypes.func,
        style: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        display: false,
        value: "",
        onSelect: () => {},
        onInputEnd: () => {},
        style: {width: "100px"},
        disabled: false
    };

    constructor(props) {
        super(props);

        let {value} = this.props;

        this.state = {
            data: [],
            value: typeof (value) === "number" ? value.toString() : value
        }
    }

    componentWillMount() {
        this.getData();
    }

    componentDidUpdate(preProps){
        if(this.props.value !== preProps.value){
            let {value} = this.props;
            this.setState({
                value: typeof (value) === "number" ? value.toString() : value
            })
        }
    }

    getData = () => {
        Post(URL.USER_GET).then(
            data => this.setState({data})
        )
    };

    onSelect = value => {
        this.setState({value});
        this.props.onInputEnd(value);
        this.state.data.map(item => {
            if (item.id.toString() === value)
                this.props.onSelect(value, item.doctorName, item);
        })
    };

    render() {
        let {data, value} = this.state;
        let {display, disabled} = this.props;

        let options = data.map(item => {
            return {
                key: item.id,
                title: item.doctorName
            }
        })
        if(display){
            return getOption(value, options)
        }
        else {
            return (
                <Select
                    disabled={disabled}
                    value={value}
                    onSelect={this.onSelect}
                    options={options}
                    style={this.props.style}
                />
            )
        }
    }
}