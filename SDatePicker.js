import React from 'react'
import {DatePicker} from 'antd'
import moment from 'moment'
import {cpy,getVal,isEmpty} from '../../util/cmn'

class SDatePicker extends React.Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.format = "YYYY-MM-DD";
    }

    componentWillMount(){
        this.format = getVal(this.props.format, "YYYY-MM-DD");
        if (this.props.hasOwnProperty("value")) {
            this.hasValue = true;
            if(typeof this.props.value === "string"){
                this.setState({
                    value: !isEmpty(this.props.value) ? moment(this.props.value, this.format) : null
                })
            }else{
                this.setState({
                    value: this.props.value
                })
            }
        }
    }

    componentWillReceiveProps(next){
        if (next.value != this.props.value){
            this.hasValue = true;
            if(typeof next.value === "string"){
                this.setState({
                    value: !isEmpty(next.value) ? moment(next.value, this.format) : null
                });
            }else{
                this.setState({
                    value: next.value
                });
            }
        }
    }

    onChange(date, dateString){
        if (this.hasValue){
            this.setState({
                value: !isEmpty(dateString) ? moment(dateString, this.format) : null
            })
        }
        if(this.props.onChange)
            this.props.onChange(date, isEmpty(date)?"":date.format(this.format));
        if(this.props.onInputEnd)
            this.props.onInputEnd(isEmpty(date)?"":date.format(this.format));
        if(this.props.onChangeValue)
            this.props.onChangeValue(isEmpty(date)?"":date.format(this.format));
    }

    render(){
        let props = cpy(this.props);
        props.onChange = this.onChange;
        //默认格式为年-月-日
        props.format = this.format;
        if (this.hasValue)
            props.value = this.state.value;
        if(props.defaultValue && typeof props.defaultValue === "string"){
            props.defaultValue = moment(props.defaultValue,props.format);
        }
        return (
            <DatePicker
                {...props}
            />
        )
    }
}

export default SDatePicker