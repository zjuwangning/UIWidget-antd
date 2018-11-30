import React from 'react'
import {Tree} from 'antd';
import {cpy,getVal,isEqual,isEmpty} from '../../util/cmn'

const TreeNode = Tree.TreeNode;

class STree extends React.Component {

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);

        this.state = {
            checkedKeys:getVal(this.props.checkedKeys,[])
        };
    }

    componentWillReceiveProps(nextProps){
        if(!isEqual(nextProps.checkedKeys, this.props.checkedKeys)){
            this.setState({
                checkedKeys:getVal(nextProps.checkedKeys,[])
            });
        }
    }

    onCheck(keys, e){
        if(this.props.checkedKeys){
            this.setState({
                checkedKeys:keys
            });
        }
        if(this.props.onCheck)
            this.props.onCheck(keys, e);
    }

    render() {
        let props = cpy(this.props);
        //受控属性
        if(props.checkedKeys) {
            props.checkedKeys = this.state.checkedKeys;
        }
        props.onCheck = this.onCheck;

        let data = getVal(props.children,[]);
        //如果有dataSource属性
        if(!isEmpty(props.dataSource)){
            const childKey = getVal(props.childrenKey, "children");
            const key = getVal(props.dataSourceKey, "id");
            const title = getVal(props.dataSourceTitle, "name");
            const loop = data => data.map((item) => {
                if (item[childKey] && item[childKey].length) {
                    return <TreeNode key={item[key]} title={item[title]}>{loop(item[childKey])}</TreeNode>;
                }
                return <TreeNode key={item[key]} title={item[title]} />;
            });
            data = data.concat(loop(props.dataSource));
        }
        return (
            <Tree
                {...props}
            >
                {data}
            </Tree>
        )
    }
}

export default STree


