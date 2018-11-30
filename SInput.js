/**
 * 基于antd-Input封装的一个SInput组件
 *  props:
 *          notFocusNext: 不在按下enter时自动跳转到下一个
 */
import React from 'react'
import {Input, message} from 'antd';
import {focusNext,isEmpty} from '../../util/cmn'
import PropTypes from 'prop-types'

export default class SInput extends React.Component {
    static props = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        onChangeValue: PropTypes.func,
        onInputEnd: PropTypes.func,
        onBlur: PropTypes.func,
        onPressEnter: PropTypes.func,
        focusNext: PropTypes.bool,
        defaultValue: PropTypes.string,
        disabled: PropTypes.bool,
        id: PropTypes.string,
        prefix: PropTypes.node,
        size: PropTypes.string,
        suffix: PropTypes.node,
        type: PropTypes.string,
        style: PropTypes.object,
        placeholder: PropTypes.string,
        maxLength: PropTypes.number
    };

    static defaultProps = {
        onChange: () => {},
        onChangeValue: () => {},
        onInputEnd: () => {},
        onBlur: () => {},
        onPressEnter: () => {},
        focusNext: true,
        defaultValue: "",
        disabled: false,
        id: "",
        prefix: "",
        size: "small",
        suffix: "",
        type: "text",
        style: {},
        placeholder: "",
        maxLength: 256
    };

    constructor(props) {
        super(props);

        this.onBlur = this.onBlur.bind(this);
        this.onPressEnter = this.onPressEnter.bind(this);
        this.state = {
            value: this.props.value
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

    onChange = e => {
        //避免多次调用
        let value = e.target.value;
        if(value === this.state.value)
            return;
        let {maxLength} = this.props
        if(value.length > maxLength){
            message.error("长度超出限制, 最大长度:" + maxLength)
            return
        }
        this.setState({value});
        this.props.onChange(e);
        this.props.onChangeValue(value);
        this.props.onInputEnd(value);
    };

    onBlur = e => {
        this.props.onBlur(e);
    };

    onPressEnter(e){
        if(this.props.focusNext)
            focusNext(e.target);
        this.props.onPressEnter(e);
    }

    render() {
        let { defaultValue, disabled, id, prefix, size, suffix, style, placeholder} = this.props;
        //因props是只读的, 这里将其传给另一个值用于修改
        let props = {
            defaultValue, disabled, prefix, size, suffix, style, placeholder,
            onChange: this.onChange,
            onBlur: this.onBlur,
            onPressEnter: this.onPressEnter,
        };
        if(id)
            props.id = id;
        if(!isEmpty(defaultValue))
            props.defaultValue = defaultValue;

        //如果传入了props.value, 想要设置props的value
        if(this.props.hasOwnProperty("value"))
            props.value = this.state.value;
        if(this.props.type === "textarea"){
            props.autosize = this.props.autosize;
            if(this.props.hasOwnProperty("rows"))
                props.autosize = {maxRows: this.props.rows, minRows: this.props.rows};
            return (<Input.TextArea {...props}/>);
        } else {
            props.type = this.props.type;
            return (<Input {...props}/>);
        }
    }
}