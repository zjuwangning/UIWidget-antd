/**
 * props:
 *      1、doctorName :  要验证的医生名字
 */
import React from 'react'
import {Row,Col,message} from 'antd'
import {Input,Label} from './Santd'
import {isEmpty} from '../../util/cmn'
import {Post,URL} from '../../system/Post'

export default class SUserCheck extends React.Component{
    constructor(props){
        super(props);
        this.password = '';

        this.handleInput = this.handleInput.bind(this);
    }

    componentWillMount(){
        this.setState({
            doctorName:!isEmpty(this.props.doctorName) ? this.props.doctorName : ''
        })
    }

    componentWillReceiveProps(nextProps){
        if(!isEmpty(nextProps.doctorName) && nextProps.doctorName !== this.props.doctorName)
            this.setState({doctorName: nextProps.doctorName ? nextProps.doctorName : '', input_password: ""});
        else this.setState({doctorName: '', input_password: ""});
    }

    confirm(){
        let param = {
            username:this.state.doctorName,
            password:this.password
        };

        Post(URL.USER_REVIEWCHECK,param).then(
            data => {
                if(this.props.onConfirm)
                    this.props.onConfirm(data);
            },
            () => {
                message.error("验证失败");
            }

        )
    }

    handleInput(e){
        this.password = e.target.value;
        this.setState({
            input_password:this.password
        })
    }

    render(){
        return (
            <div>
                <Row type="flex">
                    <Col span="10">
                        <Label title="用户名"/>
                    </Col>
                    <Col span="14">
                        <Input
                            id="doctorName"
                            onChangeValue={doctorName => this.setState({doctorName})}
                            value={this.state.doctorName}
                        />
                    </Col>
                </Row>
                <Row type="flex" style={{marginTop:'15px'}}>
                    <Col span="10"><Label title="输入密码"/></Col>
                    <Col span="14">
                        <Input
                            id="input_password"
                            onChange={this.handleInput}
                            value={this.state.input_password}
                            type="password"
                            onPressEnter={e => {
                                this.handleInput(e);
                                this.confirm();
                            }}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}