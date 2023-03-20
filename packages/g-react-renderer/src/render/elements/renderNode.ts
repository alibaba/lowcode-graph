// @ts-ignore
import * as R from 'ramda';
import * as ELE from '../../elements';
import transform from '../operations/transform';

import renderText from '../elements/renderText';
import renderRect from '../elements/renderRect';
import renderImage from '../elements/renderImage';

const isText = R.propEq('type', ELE.Text);
const isRect = R.propEq('type', ELE.Rect);
const isImage = R.propEq('type', ELE.Image);

const shouldRenderChildren = (v: any) => !isText(v);

const renderChildren = (nodeGroup: any) => (node: any) => {
    const subGroup = nodeGroup.addGroup();

    if (node.box) {
        // 偏移子元素
        subGroup.translate(node.box.left, node.box.top);
    }

    R.compose(R.forEach(renderNode(subGroup)), R.pathOr([], ['children']))(node);
    return node;
};

const renderNode = (nodeGroup: any) => (node: any) => {
    return R.compose(
        R.when(shouldRenderChildren, renderChildren(nodeGroup)),
        R.cond([
            [isText, renderText(nodeGroup)],
            [isRect, renderRect(nodeGroup)],
            [isImage, renderImage(nodeGroup)],
            [R.T, R.identity],
        ]),
        transform(nodeGroup),
        // @ts-ignore
    )(node)
};

export default renderNode;
