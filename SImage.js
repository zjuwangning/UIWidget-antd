import React from 'react'
import '../../plugIn/jquery-photo-gallery/jquery.photo.gallery';
import 'jquery';
import PropTypes from 'prop-types'
import {file_server_url} from '../../config/serverConfig'

class SImage extends React.Component{
    static props = {
        add_src_prefix: PropTypes.bool,
        box_style: PropTypes.object
    };

    static defaultProps = {
        add_src_prefix: false,
        box_style: {}
    };

    constructor(props){
        super(props);
    }

    openModal = () => {
        $.openPhotoGallery(this.refs.my_pic);
    };

    render(){
        let props = Object.assign({}, this.props);
        if(props.add_src_prefix){
            props.src = props.src ? file_server_url + props.src : "";
            delete props["add_src_prefix"];
        }
        return (
            <div className="gallerys" style={props.box_style}>
                <img
                    ref="my_pic"
                    className="gallery-pic"
                    onDoubleClick={this.openModal}
                    {...props}
                />
            </div>
        );
    }
}

export default SImage