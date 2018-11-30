import React from 'react';
import SInput from '../SInput';
import SSelect from '../SSelect';
import SDatePicker from '../SDatePicker';
import STimePicker from '../STimePicker';
import SMonthPicker from '../SMonthPicker';
import SLabel from '../SLabel'
import SCheckbox from '../SCheckbox'
import SInputNumber from '../SInputNumber'
import STimeRecorder from './STimeRecorder'
import {cpy} from '../../../util/cmn';

const defaultComponet = {
    0: SInput,
    1: SSelect,
    2: SDatePicker,
    3: STimePicker,
    4: SMonthPicker,
    6: SLabel,
    7: SCheckbox,
    9: SInputNumber,
    10: STimeRecorder
};

class SDataEntry extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let props = cpy(this.props);
        let DataEntry = false;
        if(props.hasOwnProperty("stype") && defaultComponet[props.stype])
            DataEntry = defaultComponet[props.stype];
        else
            DataEntry = props.component;
        if(!DataEntry)  return (<div/>);
        delete props["stype"];
        delete props["component"];
        return (
            <DataEntry
                {...props}
            />
        )
    }
}

export default SDataEntry