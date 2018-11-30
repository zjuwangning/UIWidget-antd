/**
 * DataPanel
 *      props:
 *          colspan: 默认的colspan
 *          data: 数据
 *          columns: 列配置
 *          onChange(data): 当数据发生变化时
 *          onChangeKey(key, val): 当数据发生变化时,监测key
 *          labelCol:   标签的col
 *          wrapperCol: 数据的col
 *          disabled:  默认的disabled
 *          height: 高度
 *          getProps(columns): 获取Props
 */
import React from 'react'
import SDataEntry from './lib/SDataEntry'
import BaseComponent from '../../system/BaseComponent'
import {isEmpty,getVal,isEqual} from '../../util/cmn'
import {Row,Col,Form} from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item;
class SDataPanel extends BaseComponent{
    static props = {
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        colspan: PropTypes.number,
        onChangeKey: PropTypes.func,
        onChange: PropTypes.func,
        data: PropTypes.object,
        disabled: PropTypes.bool,
        rules: PropTypes.oneOfType([PropTypes.bool,PropTypes.array]),
        columns: PropTypes.array,
        hideRequired: PropTypes.bool
    };

    static defaultProps = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
        colspan: 6,
        onChangeKey: () => {},
        onChange: () => {},
        data: {},
        disabled: false,
        required: false,
        rules: false,
        columns: [],
        hideRequired: false
    };

    constructor(props){
        super(props);

        this.state = {
            data: this.props.data,
            disabled: this.props.disabled
        };
    }

    componentWillReceiveProps(next){
        let state = {};
        if(!isEqual(next.data, this.state.data))
            state.data = getVal(next.data, {});
        if(next.disabled !== this.props.disabled)
            state.disabled = next.disabled;
        this.setState(state);
    }

    changeData = (key, val) => {
        let data = this.state.data;
        data[key] = val;
        this.setState({data});
        this.props.onChangeKey(key, val, data);
        this.props.onChange(data);
    };

    decodeColumn = () => {
        let {labelCol, wrapperCol, colspan, columns} = this.props;
        const default_disabled = this.state.disabled;
        let res = [];
        for(let i in columns){
            let curRow = [];
            for(let j in columns[i]){
                let curData = columns[i][j];
                if(curData.body){
                    let data_key = getVal(curData.key, "");
                    let disabled_props = {
                        disabled: getVal(curData.body.disabled) || default_disabled
                    };
                    //获取commonProps, 依据columns的配置
                    let commonProps = isEmpty(this.props.getProps) ? {} : this.props.getProps(curData);
                    //防止两个style冲突
                    if( !isEmpty(curData.body.style) && !isEmpty(commonProps.style)){
                        curData.body.style = Object.assign(curData.body.style, commonProps.style);
                        delete commonProps.style;
                    }
                    curRow.push(
                        <Col key={j} span={isEmpty(curData.Colspan) ? colspan : curData.Colspan}>
                            <Form>
                                <FormItem
                                    labelCol={getVal(curData.labelCol, labelCol)}
                                    wrapperCol={getVal(curData.wrapperCol, wrapperCol)}
                                    label={curData.title}
                                    required={curData.hideRequired ? false : curData.required}
                                    colon={!(isEmpty(curData.colon)?curData.colon:true)}
                                >
                                    <SDataEntry
                                        size={getVal(curData.body.size, "small")}
                                        {...commonProps}
                                        {...curData.body}
                                        {...disabled_props}
                                        value={this.state.data[data_key]}
                                        onInputEnd={this.changeData.bind(this,data_key)}
                                    />
                                </FormItem>
                            </Form>
                        </Col>
                    )
                }
                else{
                    curRow.push(
                        <Col key={j} span={curData.Colspan} />
                    )
                }
            }
            res.push(
                <Row key={i} justify='start' type="flex">
                    {curRow}
                </Row>
            )
        }
        return res;
    }

    render(){
        let style={};
        if(this.props.height)
            style={style:{height: this.props.height}};
        return (
            <div {...style}>
                {this.decodeColumn()}
            </div>
        )
    }
}

export default SDataPanel