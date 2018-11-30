import React from 'react'
import {Checkbox} from 'antd'
import {getVal} from '../../util/cmn'

class SCheckbox extends React.Component{
    static Group = Checkbox.Group;

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            value: getVal(this.props.value)
        }
    }

    componentWillReceiveProps(next){
        if(next.value !== this.props.value){
            this.setState({
                value: getVal(next.value)
            })
        }
    }

    onChange(e){
        let value = e.target.checked ? 1 : 0;
        this.setState({
            value: value
        });
        if(this.props.onChange)
            this.props.onChange(e);
        if(this.props.onChangeValue)
            this.props.onChangeValue(value);
        if(this.props.onInputEnd)
            this.props.onInputEnd(value);
    }

    render(){
        return (
            <Checkbox
                {...this.props}
                checked={this.state.value === 1}
                onChange={this.onChange}
            >{this.props.title}{this.props.children}</Checkbox>
        )
    }
}
export default SCheckbox