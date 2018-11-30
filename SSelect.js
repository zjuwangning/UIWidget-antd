/**
 * 这是一个可以设置受控属性的值,并且不会影响默认方法的组件
 */
import React from 'react'
import BaseComponent from '../../system/BaseComponent'
import {Select} from 'antd'
import {cpy, getVal, getOption} from '../../util/cmn'
import '../../components/functionWidget/pubsub'
import PropTypes from 'prop-types'

class SSelect extends BaseComponent {
    static Option = Select.Option;

    static props = {
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onSelect: PropTypes.func,
        onInputEnd: PropTypes.func,
    };

    static defaultProps = {
        onFocus: () => {},
        onBlur: () => {},
        onChange: () => {},
        onSelect: () => {},
        onInputEnd: () => {},
    };

    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onKeySpaceDown = this.onKeySpaceDown.bind(this);

        this.state = {
            value: getOption(this.props.value, this.props.options) || this.props.value
        };

        //是否是focus状态
        this.isFoucs = false;
    }

    componentWillReceiveProps(next){
        if(next.value !== this.props.value){
            this.setState({
                value: getOption(next.value, next.options) || next.value
            });
        }
    }

    componentDidMount() {
        this.pubsub = PubSub.subscribe('KeyDownEvent', this.onKeySpaceDown);
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub);
    }


    onFocus(e){
        this.isFoucs = true;
        this.props.onFocus(e);
    }

    onBlur(e){
        this.isFoucs = false;
        this.props.onBlur(e);
    }

    onKeySpaceDown(name, keyCode){
        if(this.isFoucs && keyCode === 32)
            this.onChange("");
    }

    onChange(value){
        value = value || "";    //点击X时value为undefined
        this.setState({
            value: value
        });
        this.props.onChange(value);
        this.props.onInputEnd(value);
    }

    onSelect(value, option){
        this.setState({
            value: value
        });
        this.props.onSelect(value, option);
        this.props.onInputEnd(value);
    }

    render() {
        let props = cpy(this.props);
        //受控属性
        props.onChange = this.onChange;
        props.onSelect = this.onSelect;
        props.onBlur = this.onBlur;
        props.onFocus = this.onFocus;
        props.value = this.state.value;
        let options = getVal(this.props.children, []);
        if(!props.size)
            props.size = "small";
        if(props.options){
            for (let i in props.options){
                options.push(
					<Select.Option {...props.options[i]}>
                        {props.options[i].title}
					</Select.Option>
                )
            }
        }
        delete props["options"];
        props.allowClear=true;
        return (
			<Select
                {...props}
                notFoundContent=""
			>
                {options}
			</Select>
        )
    }
}

export default SSelect


