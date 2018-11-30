import React from 'react'
import BaseComponent from '../../system/BaseComponent'
import {Button, Modal, UserCheck} from './Santd'
import {message, Row} from 'antd'
import Cache from '../../system/Cache'

export default class ReviewButton extends BaseComponent{
    constructor(props){
        super(props);

        this.onReviewerConfirm = this.onReviewerConfirm.bind(this);

        this.operator = {id: Cache.getUid()};
        this.reviewer = {};
        this.state = {

        }
    }

    onReviewerConfirm(reviewer){
        if(reviewer.id === Cache.getUid()){
            message.error("审核者不能和操作者相同!");
            return;
        }
        this.reviewer = reviewer;
        this.setDisVisible("reviewer");
        if(this.props.onClick)
            this.props.onClick(this.operator, this.reviewer);
    }

    render(){
        let props = Object.assign({}, this.props);
        return (
            <div>
                <Button
                    {...props}
                    onClick={() => {
                        if(this.props.check && !this.props.check())
                            return;
                        this.setVisible("reviewer");
                        //清空operator和reviewer
                        this.operator = {id: Cache.getUid()};
                        this.reviewer = {};
                    }}
                >{this.props.children}</Button>
                <Modal
                    title="审核者验证"
                    size={1}
                    visible={this.getVisible("reviewer")}
                    onCancel={this.setDisVisible.bind(this, "reviewer")}
                    footer={null}
                >
                    <Row type="flex">
                        <UserCheck
                            ref="reviewer_check"
                            onConfirm={this.onReviewerConfirm}
                        />
                    </Row>
                    <Row type="flex" justify="end">
                        <Button
                            onClick={() => {
                                this.refs.reviewer_check.confirm();
                            }}
                        >确认</Button>
                    </Row>
                </Modal>
            </div>
        )
    }
}