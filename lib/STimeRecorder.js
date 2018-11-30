import React from 'react'
import BaseComponent from '../../../system/BaseComponent'
import SButton from '../SButton'
import moment from 'moment'
import {getVal} from '../../../util/cmn'

export default class STimeRecorder extends BaseComponent{
    constructor(props){
        super(props);

        this.state = {
            value: getVal(this.props.value),
            format: getVal(this.props.format, "YYYY-MM-DD")
        }
    }

    componentWillReceiveProps(next){
        if(next.value !== this.props.value){
            this.setValue(next.value);
        }
    }

    setValue(value){
        this.setState({value});
        if(this.props.onInputEnd)
            this.props.onInputEnd(value)
    }

    render(){
        let {value, format} = this.state;
        return (
            <SButton
                className="stime-recorder-btn"
                style={{width:"90%",margin:"2px 0 0 0",padding:0}}
                onClick={() => {
                    this.setValue(moment().format("YYYY-MM-DD HH:mm:ss"))
                }}
            >
                {moment(value).isValid() ? moment(value).format(format) : getVal(value, "00:00")}
            </SButton>
        )
    }
}