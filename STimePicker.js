import React from 'react'
import {TimePicker} from 'antd'
import moment from 'moment'
import {cpy,getVal,isEmpty} from '../../util/cmn'

const range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};
class STimePicker extends React.Component{
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.disableMinutes = this.disableMinutes.bind(this);

        this.format = getVal(this.props.format, "HH:mm");
        if (this.props.hasOwnProperty("value")) {
            this.hasValue = true;
            if(typeof this.props.value === "string"){
                let value = this.props.value;
                if(this.props.value.length == 19)
                    value = this.props.value.substring(11,16);
                this.state = {
                    value: !isEmpty(value) ? moment(value, this.format) : null
                }
            }else{
                this.state = {
                    value: this.props.value
                }
            }
        }
    }

    componentWillReceiveProps(next){
        if (next.value != this.props.value){
            this.hasValue = true;
            if(typeof next.value === "string"){
                let value = next.value;
                if(value.length == 19)
                    value = value.substring(11,16);
                this.state = {
                    value:moment(value, this.format)
                }
            }else{
                this.state = {
                    value: next.value
                }
            }
        }
    }

    disableMinutes(hour){
        return range(1,29).concat(range(31,59));
    }

    onChange(date, dateString){
        if (this.hasValue){
            this.setState({
                value:!isEmpty(dateString) ? moment(dateString, this.format) : null
            })
        }
        if(this.props.onChange)
            this.props.onChange(date, isEmpty(date)?"":date.format(this.format));
        if(this.props.onInputEnd)
            this.props.onInputEnd(isEmpty(date)?"":date.format(this.format));
    }

    render(){
        let props = cpy(this.props);
        props.onChange = this.onChange;
        props.format = this.format;
        if (this.hasValue)
            props.value = this.state.value;
        if(props.defaultValue && typeof props.defaultValue === "string"){
            props.defaultValue = moment(props.defaultValue, props.format);
        }
        //如果传入了整点属性
        if(props.halfHour){
            props.hideDisabledOptions = true;
            props.disabledMinutes = this.disableMinutes;
            delete props.halfHour;
        }
        return (
            <TimePicker
                {...props}
            />
        )
    }
}

export default STimePicker