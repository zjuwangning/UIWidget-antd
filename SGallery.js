import React from 'react'
import {Button,Icon,Row,Tooltip} from 'antd';
import '../../css/component/ImgScanner.css';
import {isEmpty} from '../../util/cmn'

import ReactDOM from 'react-dom';

export default class SGallery extends React.Component{
    constructor(props){
        super(props);
        this.openModal = this.openModal.bind(this);

        this.onPreClick = this.onPreClick.bind(this);
        this.onDownClick = this.onDownClick.bind(this);
        this.onFullScreen = this.onFullScreen.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onReverseRotationClick = this.onReverseRotationClick.bind(this);
        this.onRotateClick = this.onRotateClick.bind(this);
        this.onMinusClick = this.onMinusClick.bind(this);
        this.onPlusClick = this.onPlusClick.bind(this);
        this.onClose =this.onClose.bind(this);
        //鼠标事件
        this.onWheel = this.onWheel.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.dragImg = this.dragImg.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.updateImg = this.updateImg.bind(this);
        this.changeSize = this.changeSize.bind(this);


        this.winWidth = 0;
        this.winHeight = 0;

        this.initPosOffsetX = 0;
        this.initPosOffsetY = 0;

        this.state = {
            src:[],
            // visible:false,
            fullScreen:false,
            curImg:0,
            transform:'',
            XOffset:0,      //x方向上的位置偏移
            YOffset:0,      //y方向上的位置偏移
            rotation:0,     //旋转
            scale:1         //放缩
        };
        this.cancelDBClick = false;

        this.node = null; //图片模态框
    }

    componentWillMount(){
        // 获取窗口宽度
        if (window.innerWidth)
            this.winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            this.winWidth = document.body.clientWidth;
        // 获取窗口高度
        if (window.innerHeight)
            this.winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            this.winHeight = document.body.clientHeight;

        if(!isEmpty(this.props.size)){
            this.setState({
                width: this.props.size.width,
                height: this.props.size.height
            })
        } else {
            this.cancelDBClick = isEmpty(this.props.cancelDBClick) ? false:this.props.cancelDBClick;
        }
        if(typeof this.props.src === 'string'){
            this.setState({
                src:[this.props.src]
            })
        }else if(typeof this.props.src === 'object'){
            this.setState({
                src:this.props.src,
            })
        }

    }

    componentWillReceiveProps(next){
        if(next.src !== this.props.src)
            this.setState({
                src:next.src
            });
    }


    onPreClick(){
        let curImg = this.state.curImg;
        curImg -= 1;
        if(curImg < 0){
            curImg = this.state.src.length - 1;
        }
        this.setState({
            curImg:curImg,
            transform:'',
            XOffset:0,      //x方向上的位置偏移
            YOffset:0,      //y方向上的位置偏移
            rotation:0,     //旋转
            scale:1         //放缩
        });
    }

    onNextClick(){
        let curImg = this.state.curImg;
        curImg += 1;
        if(curImg >= this.state.src.length){
            curImg = 0;
        }
        this.setState({
            curImg:curImg,
            transform:'',
            XOffset:0,      //x方向上的位置偏移
            YOffset:0,      //y方向上的位置偏移
            rotation:0,     //旋转
            scale:1         //放缩
        });
    }

    onDownClick(){
        let src = this.state.src[this.state.curImg];
        var $a = document.createElement('a');
        $a.setAttribute("href", src);
        $a.setAttribute("download", "");

        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
        $a.dispatchEvent(evObj);
    }

    onFullScreen(){
        this.setState({
            fullScreen:!this.state.fullScreen
        })
    }

    onRotateClick(){
        try{
            let currentImg = document.getElementsByClassName('showImg')[0];
            let current = currentImg.style.transform;
            if(current.indexOf('rotate') >= 0){
                let start = current.indexOf('rotate(');
                let end = current.indexOf('deg');
                current = parseInt( current.slice(start+7,end));
                this.setState({
                    transform:'rotate('+(current+45)+'deg)'
                })
            }else{
                current = 'rotate(45deg)';
                this.setState({
                    transform:current
                })
            }
        }catch(e){
            console.log(e);
        }

    }

    onMinusClick(){
        this.setState({
            scale:(this.state.scale - 0.2)< 0.2 ? 0.2 : this.state.scale - 0.2
        })
    }

    onPlusClick(){
        this.setState({
            scale:(this.state.scale + 0.2) > 2.0 ? 2.0 : this.state.scale + 0.2
        })
    }

    onReverseRotationClick(){

    }

    onWheel(e){
        if(e.deltaY < 0){
            this.setState({
                scale:(this.state.scale + 0.1) > 2.0 ? 2.0 : this.state.scale + 0.1
            })
        }else{
            this.setState({
                scale:(this.state.scale - 0.1)< 0.2 ? 0.2 : this.state.scale - 0.1
            })
        }
    }



    onClose(){
        //关闭窗口
        ReactDOM.unmountComponentAtNode(this.node);
        document.getElementsByTagName('body')[0].removeChild(this.node);
        this.node = null;
        if(this.props.onClose)
            this.props.onClose()
    }

    //拖拽图片控制

    startDrag(e){
        this.isDragging = true;
        e.preventDefault();
        this.initPosOffsetX = e.clientX - this.state.XOffset;
        this.initPosOffsetY = e.clientY - this.state.YOffset;

    }

    dragImg(e){
        if(this.isDragging){
            //拖拽时调整图片的样式属性
            let XOffset,YOffset;
            XOffset = e.clientX - this.initPosOffsetX;
            YOffset = e.clientY - this.initPosOffsetY;
            this.setState({
                XOffset,YOffset
            })
        }
    }

    endDrag(){
        this.isDragging = false
    }

    changeSize(){
        // console.log('size------------------')
        let currentImg = document.getElementsByClassName('showImg')[0];
        currentImg.width = currentImg.naturalWidth * this.state.scale;
        currentImg.height = currentImg.naturalHeight * this.state.scale;
    }

    openModal(){
        if(this.cancelDBClick){
            return
        }
        this.renderModal()
    }

    renderModal(){
        this.node = document.createElement('div'); // 创建 DOM
        this.node.className = 'ImageModal'; // 给上 ClassName
        document.getElementsByTagName('body')[0].appendChild(this.node); // 给 body 加上刚才的 带有 className 的 div
        // 这个时候创建了 render的目的地。
        this.updateImg();

    }

    updateImg(){
        if(isEmpty(this.node)){
            return
        }
        let backStyle = {
            position: 'fixed',
            top: this.state.fullScreen ? '0px' :(this.winHeight*0.1) +'px',
            right: this.state.fullScreen ? '0px' : (this.winWidth*0.1) +'px',
            bottom: this.state.fullScreen ? '0px' : (this.winHeight*0.1) +'px',
            left: this.state.fullScreen ? '0px' : (this.winWidth*0.1) +'px',
            overflow: 'hidden',
            outline:'0px',
            backgroundColor:'rgba(100,100,100,0.8)',
            borderRadius:"10px",
            zIndex:'1001',
            display:'block',

        };

        let toolStyle = {fontSize:'1.5em',zIndex:'1000'};
        let curSrc = this.state.src[this.state.curImg];



        let modal = (
            <div style={backStyle} onWheel={this.onWheel} onMouseMove={this.dragImg}>
                <img src={curSrc} className='showImg' alt="图像未采集" onMouseDown={this.startDrag} onMouseOut={this.endDrag} onMouseUp={this.endDrag} style={{cursor:"move",transform:this.state.transform,top:this.state.YOffset,left:this.state.XOffset}} />
                <Button icon="close" type='danger' className='closeButton' size='large' onClick={this.onClose} shape="circle"/>
                <Row type='flex' justify='center'>
                    <div className='toolBar'>
                        <Row type='flex' justify='center' gutter={18} style={{lineHeight:'80px'}}>
                            <div><Tooltip overlayStyle={toolStyle} placement="top" title='前一张'><a onClick={this.onPreClick}  className='toolBar_a'><Icon type="left" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title='放大'><a onClick={this.onPlusClick} className='toolBar_a'><Icon type="plus" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title='旋转'><a className='toolBar_a' onClick={this.onRotateClick}><Icon type="reload" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title='缩小'><a  onClick={this.onMinusClick} className='toolBar_a'><Icon type="minus" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title='下载图片'><a className='toolBar_a' onClick={this.onDownClick}><Icon type="download" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title={this.state.fullScreen ? '取消全屏' : '全屏'}><a className='toolBar_a' onClick={this.onFullScreen}><Icon type="desktop" /></a></Tooltip></div>
                            <div><Tooltip overlayStyle={toolStyle}  placement="top" title='后一张'><a className='toolBar_a' onClick={this.onNextClick}><Icon type="right" /></a></Tooltip></div>
                        </Row>
                    </div>
                </Row>
                <div id='scale'>
                    {Math.round(this.state.scale * 100) + '%'}
                </div>

            </div>

        );
        // 这个时候创建了 Modal 的虚拟 Dom
        let allClass = document.getElementsByClassName('ImageModal');
        ReactDOM.render(modal, allClass[0], this.changeSize);// 之所以这么写，是因为能重复打开Modal，因为每一次打开Modal，都会建立一个div

        // 将 Modal 成功 render 到目的地
    }


    render(){
        let props = {
            width: this.state.width,
            height: this.state.height
        };
        this.updateImg();

        let curSrc = this.state.src[this.state.curImg];
        return (
            <div>
                <img
                    onDoubleClick={this.openModal}
                    alt="图片加载失败"
                    {...props}
                    src={curSrc}
                />
                <div>

                </div>
            </div>
        );
    }
}

