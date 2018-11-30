/**
 * props:
 *      destroyOnClose: 关闭时是否销毁子元素
 *      focusIndex: 默认聚焦在第几个输入框
 */
import React from 'react'
import BaseComponent from '../../system/BaseComponent'
import {Modal, Row, Col} from 'antd'
import PropTypes from 'prop-types'
import {focusModal} from '../../util/cmn'
import Draggable from 'react-draggable'
require('../../css/component/modal.css');

const sizeProps = {
    1: {
        width: "20%"
    },
    2: {
        width: "50%"
    },
    3: {
        width: "70%"
    },
    4: {
        width: "800px"
    },
    5: {
        width: "40%"
    },
    6: {
        width: "30%"
    },
    7: {
        width: "90%"
    }
};
export default class SModal extends BaseComponent{
    static confirm = Modal.confirm;

    static props = {
        top: PropTypes.number,
        visible: PropTypes.bool,
        title: PropTypes.node,
        focusIndex: PropTypes.number,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        closable: PropTypes.bool
    };

    static defaultProps = {
        top: 80,
        visible: false,
        title: "对话框",
        focusIndex: 1,
        onOk: () => {},
        onCancel: () => {},
        closable: true
    };

    constructor(props){
        super(props);

        this.startX = 0;
        this.startY = 0;
        this.modalStartX = 0;
        this.modalStartY = 0;
        this.state = {
            top: this.props.top,
            left: 0,
            visible: this.props.visible
        }
    }

    handleStart = e => {
        let {top, left} = this.state;
        this.startX = e.screenX;
        this.startY = e.screenY;
        this.modalStartX = left;
        this.modalStartY = top;
    };

    handleDrag = e => {
        let left = this.modalStartX - (this.startX - e.screenX);
        let top = this.modalStartY - (this.startY - e.screenY);
        this.setState({top, left})
    };

    handleStop = e => {
        let left = this.modalStartX - (this.startX - e.screenX);
        let top = this.modalStartY - (this.startY - e.screenY);
        this.setState({top, left})
    };

    componentDidUpdate(preProps){
        if(this.props.visible !== preProps.visible){
            this.setState({
                visible: this.props.visible
            }, () => {
                if(this.props.visible === true){
                    setTimeout(() => focusModal(this.props.focusIndex), 100);
                }
            })
        }
    }

    render(){
        let {visible, top, left} = this.state;
        let props = { visible };
        if(this.props.size)
            props = Object.assign(props, sizeProps[this.props.size]);

        //关闭按钮
        let closeX = this.props.closable ? (
            <Row type="flex" justify="end">
                <div className="smodal-close-x" onClick={this.props.onCancel}/>
            </Row>
        ) : "";

        return (
            <Modal
                maskClosable={false}
                {...this.props}
                {...props}
                title={
                    <Draggable
                        onStart={this.handleStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleStop}
                    >
                        <Row>
                            <Col span="23">
                                <Row>
                                    <div>{this.props.title}</div>
                                </Row>
                            </Col>
                            <Col span="1">
                                {closeX}
                            </Col>
                        </Row>
                    </Draggable>
                }
                style={{top, left}}
            >
                <Row>
                    <Col span="24">
                        {this.props.children}
                    </Col>
                </Row>
            </Modal>
        )
    }
}