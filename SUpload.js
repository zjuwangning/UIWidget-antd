import React from 'react'
import {Upload} from 'antd'
import {cpy} from '../../util/cmn'
import {getRootUrl} from '../../config/serverConfig'

export default class SUpload extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let props = cpy(this.props);
        props.action = getRootUrl() + props.action;
        return (
            <Upload
                {...props}
            >{this.props.children}</Upload>
        )
    }
}