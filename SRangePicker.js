import React from 'react'
import {Row} from 'antd'
import DatePicker from './SDatePicker'
import SLabel from './SLabel'
import moment from 'moment'
import {cpy,isEmpty} from '../../util/cmn'

class SRangePicker extends React.Component{
    constructor(props){
        super(props);

        this.changeEndTime = this.changeEndTime.bind(this);
        this.changeStartTime = this.changeStartTime.bind(this);
        this.startTime = null;
        this.endTime = null;
    }

    componentWillMount(){
        let props = cpy(this.props);
        //默认格式为年-月-日
        if(!props.format){
            props.format = "YYYY-MM-DD";
        }
        this.format = props.format;
        if(props.startValue){
            if(typeof props.startValue === 'string')
                props.startValue = moment(props.startValue,props.format);
            this.setState({
                startTime:props.startValue
            });
            this.startTime = props.startValue;
        }else if(props.defaultStartValue){
            if(typeof props.defaultStartValue === 'string')
                props.defaultStartValue = moment(props.defaultStartValue,props.format);
            this.setState({
                startTime:props.defaultStartValue
            });
            this.startTime = props.defaultStartValue;
        }else
            this.setState({
                startTime:null
            });
        if(props.endValue){
            if(typeof props.endValue === 'string')
                props.endValue = moment(props.endValue,props.format);
            this.setState({
                endTime:props.endValue
            });
            this.endTime = props.endValue
        }else if(props.defaultEndValue){
            if(typeof props.defaultEndValue === 'string')
                props.defaultEndValue = moment(props.defaultEndValue,props.format);
            this.setState({
                endTime:props.defaultEndValue
            });
            this.endTime = props.defaultEndValue;
        }else
            this.setState({
                endTime:null
            });
    }

    componentWillReceiveProps(next){
        let startTime = this.state.startTime;
        let endTime = this.state.endTime;
        if(next.startValue !== this.props.startValue)
            startTime = next.startValue;
        if(next.endValue !== this.props.endValue)
            endTime = next.endValue;
        if(next.value !== this.props.value){
            if(isEmpty(next.value)){
                startTime = "";
                endTime = "";
            } else {
                startTime = next.value[0];
                endTime = next.value[1];
            }
        }
        this.setState({startTime,endTime});

    }

    changeStartTime(date){
        this.setState({
            startTime:date
        });
        this.startTime = date;
        if(date && this.endTime && this.startTime.isAfter(this.endTime)){
            this.setState({
                endTime:date
            });
            this.endTime = date;
        }

        let startStr = isEmpty(date) ? "" : date.format(this.format);
        let endStr = isEmpty(this.endTime) ? "" : this.endTime.format(this.format);
        if(this.props.onChange)
            this.props.onChange([startStr , endStr]);
        if(this.props.onInputEnd)
            this.props.onInputEnd([startStr , endStr]);
    }

    changeEndTime(date){
        this.setState({
            endTime:date
        });
        this.endTime = date;
        if(date && this.startTime && this.endTime.isBefore(this.startTime)){
            this.setState({
                startTime:date
            });
            this.startTime = date;
        }
        let startStr = isEmpty(this.startTime) ? "" : this.startTime.format(this.format);
        let endStr = isEmpty(date) ? "" : date.format(this.format);
        if(this.props.onChange)
            this.props.onChange([startStr , endStr]);
        if(this.props.onInputEnd)
            this.props.onInputEnd([startStr , endStr]);
    }

    render(){
        let props = cpy(this.props);
        //默认格式为年-月-日
        if(!props.format){
            props.format = "YYYY-MM-DD";
        }
        return (
            <div>
                <Row type="flex" justify="start">
                    <DatePicker
                        size="small"
                        style={{width:this.props.width ? this.props.width+"px" : "90px"}}
                        format={props.format}
                        value = {this.state.startTime}
                        onChange={this.changeStartTime}
                    />
                    <SLabel title="~" />
                    <DatePicker
                        size="small"
                        style={{width:this.props.width ? this.props.width+"px" : "90px"}}
                        format = {props.format}
                        value = {this.state.endTime}
                        onChange={this.changeEndTime}
                    />
                </Row>
            </div>

        )
    }
}

export default SRangePicker
