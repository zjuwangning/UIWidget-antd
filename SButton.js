/**
 * SButton, 基于antd Button封装的组件
 */
import React from 'react'
import BaseComponent from '../../system/BaseComponent'
import SModal from './SModal'
import {Button,message,Row} from 'antd'
import PropTypes from 'prop-types'
import {isEmpty,getVal} from '../../util/cmn'
import Cache from '../../system/Cache'
import classnames from 'classnames'
require("../../css/component/button.css");

const Confirm_Type = {
    add: 0,
    modify: 1,
    del: 2
};
const BTN_TYPE = {
    edit: "edit",   //0
    modal: "modal", //1
    panel: "panel", //2
    other: "other", //3
};
class SButton extends BaseComponent {
    static Group = Button.Group;

    static props = {
        onClick: PropTypes.func,
        checkPatient: PropTypes.bool,   //是否需要病人id
        confirm: PropTypes.object,   //是否需要弹出确认框
        disabled: PropTypes.bool,
        icon: PropTypes.string,
        loading: PropTypes.bool,
        type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        size: PropTypes.string,
        className: PropTypes.string,
        htmlType: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        onClick: () => {},
        checkPatient: false,
        confirm: false,
        disabled: false,
        icon: "",
        loading: false,
        type: 0,
        size: "small",
        className: "",
        htmlType: "button",
        style: {},
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    onConfirm = e => {
        this.setDisVisible("modal");
        this.props.onClick(e);
    };

    onClick = e => {
        //当这个按钮需要checkPatient的时候
        if(this.props.checkPatient && !Cache.getPatientId()){
            message.error("请先刷卡!");
            return;
        }
        if(this.props.confirm)
            this.setVisible("modal");
        else
            this.props.onClick(e);
    };

    render() {
        let {size, type, icon, loading, disabled, className, confirm, htmlType, style} = this.props;
        let props = {size, icon, loading, disabled, htmlType, style};
        //样式
        className = classnames(className, "sbtn");
        switch (type){
            case BTN_TYPE.edit:case 0: className = classnames(className, "sbtn-edit"); break;
            case BTN_TYPE.modal:case 1: className = classnames(className, "sbtn-modal"); break;
            case BTN_TYPE.panel:case 2: className = classnames(className, "sbtn-panel"); break;
            case BTN_TYPE.other:case 3: className = classnames(className, "sbtn-other"); break;
            default: props.type = type; break;
        }
        //confirm
        let modal = "";
        if(!isEmpty(confirm)){
            switch (confirm.type){
                case Confirm_Type.add:
                    this.title = "提示";
                    this.msg = "确认新增数据吗?";
                    break;
                case Confirm_Type.modify:
                    this.title = "提示";
                    this.msg = "确认修改数据吗?";
                    break;
                case Confirm_Type.del:
                    this.title = "提示";
                    this.msg = "确认删除数据吗?";
                    break;
                default:
                    this.title = getVal(confirm.title, "提示");
                    this.msg = getVal(confirm.msg, "确认操作吗");
                    break;
            }
            modal = (
                <SModal
                    visible={this.getVisible("modal")}
                    title={this.title}
                    onCancel={this.setDisVisible.bind(this, "modal")}
                    footer={<Row type="flex" justify="end">
                        <Button
                            onClick={this.onConfirm}
                            icon="check"
                            size="small"
                            className={classnames("sbtn", "sbtn-other")}
                        >确认</Button>
                        <Button
                            onClick={this.setDisVisible.bind(this, "modal")}
                            icon="close"
                            size="small"
                            className={classnames("sbtn", "sbtn-modal")}
                        >取消</Button>
                    </Row>}
                >
                    <h3>{this.msg}</h3>
                </SModal>
            );
        }
        return (
            <div>
                <Button
                    {...props}
                    className={className}
                    onClick={this.onClick}
                >{this.props.children}</Button>
                {modal}
            </div>
        )
    }
}

export default SButton