/**
 * STable, 基于antd2.6.3 Table封装的组件
 *	props:
 *		onChange(rowIndex, key, val, data):	对于可编辑的表格, 当表格的数据改变时触发
 *		alwaysModify: 始终可以编辑
 *		modifyRow:	rowIndex 或 rowIndex的数组
 *		editable: 可编辑的表格
 */
import React from 'react'
import BaseComponent from '../../system/BaseComponent'
import {Table} from 'antd';
import PropTypes from 'prop-types'
import {isEmpty,in_array,getVal,cpy} from '../../util/cmn'
import SButton from './SButton'
import SDataEntry from './lib/SDataEntry'

const getRowClassName = i => {
    switch(i){
        case 1: return "STable_row_type_one";
        case 2: return "STable_row_type_tow";
        case 3: return "STable_row_type_three";
        case 4: return "STable_row_type_four";
        default: return "";
    }
};
const isSelectRow = (index, selectRow) => {
    if(typeof selectRow === "object"){
        for (let i in selectRow){
            if (index === selectRow[i])
                return true;
        }
        return false;
    } else {
        return index === selectRow;
    }
};
export default class STable extends BaseComponent {
	static props = {
	    //函数
		onChange: PropTypes.func,
        onRowClick: PropTypes.func,
        onRowDoubleClick: PropTypes.func,
        //
        size: PropTypes.string,
        height: PropTypes.string,
        bodyStyle: PropTypes.object,
        alwaysModify: PropTypes.bool,
        dataSource: PropTypes.array,
		//操作按钮
        onDel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        //rowStyle
        getRowStyle: PropTypes.func
	};

	static defaultProps = {
	    //函数
        onChange: () => {},
        onRowClick: () => {},
        onRowDoubleClick: () => {},
        //
        size: "small",
        height: "500",
        bodyStyle: {},
        alwaysModify: false,
        dataSource: [],
        //操作按钮
        onDel: false,
        getRowStyle: () => "",
    };

	constructor(props) {
		super(props);

		this.state = {
            columns: this.processColumn(this.props.columns, this.props.editable),
		    dataSource: this.props.dataSource,
			modifyRow: getVal(this.props.modifyRow),
		}
	}

    componentWillReceiveProps(next){
	    let state = {};
        if(next.modifyRow !== this.props.modifyRow)
            state.modifyRow = next.modifyRow;
        if(next.dataSource !== this.props.dataSource)
            state.dataSource = next.dataSource;
        if(next.columns !== this.props.columns || next.editable !== this.props.editable)
            state.columns = this.processColumn(next.columns, next.editable);
        this.setState(state)
    }

    processColumn = (prop_columns, editable) => {
        let columns = cpy(prop_columns);
        columns = this.addAction(columns);
        //自定义的表头
        const customCol = col => {
            //添加必填项标识
            if(col.required)
                col.title = (
                    <div>
                        <span style={{color:"red"}}>*</span>
                        {col.title}
                    </div>
                )
            //添加排序 TODO
        }
        for(let i in columns){
            let col = columns[i]
            //如果有列合并
            if(!isEmpty(col.children)){
                col.children.map && col.children.map(item => {
                    customCol(item)
                })
            } else{
                customCol(col)
            }
        }
        if(isEmpty(editable) || !editable)
            return columns;
        let new_render = (render, dataIndex, editor, text, record, index) => {
            //如果其type是一个函数
            let props = typeof editor === "function" ? editor(text, record, index) : editor;
            if(!isEmpty(props) && this.isModifyRow(index) && !in_array(dataIndex,record["disEdit"])){
                return (
                    <SDataEntry
                        {...props}
                        style={{width:"100%"}}
                        value={text}
                        onInputEnd={this.changeData.bind(this,index,dataIndex)}
                    />
                )
            }
            else{
                return render ? render(text, record, index) : text;
            }
        }

        const changeRender = col => {
            if(!isEmpty(col.editor))
                col.render = new_render.bind(this, col.render, col.dataIndex, col.editor)
        }

        for(let i in columns){
            let col = columns[i]
            //如果有列合并
            if(!isEmpty(col.children)){
                col.children.map && col.children.map(item => {
                    changeRender(item)
                })
            } else{
                changeRender(col)
            }
        }
        return columns;
    }

    addAction = columns => {
        let {onDel} = this.props
        if(!onDel)
            return columns;

        const render_func = (text,record,index) => {
            const actions = [];
            if(onDel){
                actions.push(
                    <SButton
                        onClick={onDel.bind(this, text, record, index)}
                        confirm={{type: 2}}
                    >删除</SButton>
                );
            }
            return (<span>{actions}</span>)
        };
        const action_obj = {
            title: '操作',
            key: 'action',
            width: "60px",
            render: render_func
        };
        columns.unshift(action_obj);
        return columns;
    }

    getData = () => this.state.dataSource

    isModifyRow = index => {
        if(this.props.alwaysModify)
            return true;
        if(typeof this.state.modifyRow === "object")
            return in_array(index, this.state.modifyRow);
        else
            return this.state.modifyRow === index;
    };

	changeData = (rowIndex, key, data) => {
		let {dataSource} = this.state;
		dataSource[rowIndex][key] = data;
		this.setState({dataSource});
		this.props.onChange(rowIndex,key,data,dataSource);
	};

	render() {
	    let props = Object.assign({}, this.props);
        props.onRow = (record, index) => {
            return {
                onClick: this.props.onRowClick.bind(this, record, index),
                onDoubleClick: this.props.onRowDoubleClick.bind(this, record, index)
            }
        };
        //去除onRowClick等
        delete props["onRowClick"];
        delete props["onRowDoubleClick"];
        props.bodyStyle.height = props.height;
	    //rowClassName
	    const rowClassName = (record, index) => {
            if(isSelectRow(index, this.props.selectRow))
                return "STable_row_type_zero";
            else
                return getRowClassName(this.props.getRowStyle(record));
        };
		return (
            <Table
                rowClassName={rowClassName}
                {...props}
                columns={this.state.columns}
                dataSource={this.state.dataSource}
            >
				{this.props.children}
            </Table>
		)
	}
}