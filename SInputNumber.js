import React from 'react'
import {InputNumber} from 'antd';
import {cpy,isEmpty} from '../../util/cmn'

const formatter = num => {
    let str = num.toString();
    let i = str.indexOf(".");
    //保留最多4位小数
    if(str.length - i >= 5)
        return Math.floor(num * 10000) / 10000
    return num
};
class SInputNumber extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = {
            value: !isEmpty(this.props.value) ? this.props.value : ""
        }
    }

    //传进来的props可能会改变, 当改变时需要重新修改value的值
    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value){
            this.setState({
                value: nextProps.value
            });
        }
    }

    onChange(value){
        value = isEmpty(value) ? "" : value;
        this.setState({
            value: value
        });
        if(this.props.onChange)
            this.props.onChange(value);
        if(this.props.onInputEnd)
            this.props.onInputEnd(value);
    }

    render() {
        //因props是只读的, 这里将其传给另一个值用于修改
        let props = cpy(this.props);
        //如果传入了props.value, 想要设置props的value
        if(props.hasOwnProperty("value"))
            props.value = this.state.value;
        props.onChange = this.onChange;
        props.size = props.size || "small";
        //默认0~10000
        props.min = props.min || 0;
        props.max = props.max || 10000;
        props.formatter = formatter
        return (
            <InputNumber
                {...props}
            />
        )
    }
}

export default SInputNumber