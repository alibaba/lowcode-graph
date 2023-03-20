import * as R from 'ramda';
import Yoga from '@react-pdf/yoga';
import * as ELE from '../elements';

import getMargin from '@react-pdf/layout/lib/node/getMargin';
import getPadding from '@react-pdf/layout/lib/node/getPadding';
import getPosition from '@react-pdf/layout/lib/node/getPosition';
import getDimension from '@react-pdf/layout/lib/node/getDimension';
import getBorderWidth from '@react-pdf/layout/lib/node/getBorderWidth';
import setDisplay from '@react-pdf/layout/lib/node/setDisplay';
import setOverflow from '@react-pdf/layout/lib/node/setOverflow';
import setFlexWrap from '@react-pdf/layout/lib/node/setFlexWrap';
import setFlexGrow from '@react-pdf/layout/lib/node/setFlexGrow';
import setFlexBasis from '@react-pdf/layout/lib/node/setFlexBasis';
import setAlignSelf from '@react-pdf/layout/lib/node/setAlignSelf';
import setAlignItems from '@react-pdf/layout/lib/node/setAlignItems';
import setFlexShrink from '@react-pdf/layout/lib/node/setFlexShrink';
import setAspectRatio from '@react-pdf/layout/lib/node/setAspectRatio';
import setAlignContent from '@react-pdf/layout/lib/node/setAlignContent';
import setPositionType from '@react-pdf/layout/lib/node/setPositionType';
import setFlexDirection from '@react-pdf/layout/lib/node/setFlexDirection';
import setJustifyContent from '@react-pdf/layout/lib/node/setJustifyContent';
import {
    setMarginTop,
    setMarginRight,
    setMarginBottom,
    setMarginLeft,
} from '@react-pdf/layout/lib/node/setMargin';
import {
    setPaddingTop,
    setPaddingRight,
    setPaddingBottom,
    setPaddingLeft,
} from '@react-pdf/layout/lib/node/setPadding';
import {
    setBorderTop,
    setBorderRight,
    setBorderBottom,
    setBorderLeft,
} from '@react-pdf/layout/lib/node/setBorderWidth';
import {
    setPositionTop,
    setPositionRight,
    setPositionBottom,
    setPositionLeft,
} from '@react-pdf/layout/lib/node/setPosition';
import {
    setWidth,
    setHeight,
    setMinWidth,
    setMaxWidth,
    setMinHeight,
    setMaxHeight,
} from '@react-pdf/layout/lib/node/setDimension';
// import measureText from '@react-pdf/layout/lib/text/measureText';
import { measureText } from '../util/measureText';

const YOGA_NODE = '_yogaNode';
const YOGA_CONFIG = Yoga.Config.create();

YOGA_CONFIG.setPointScaleFactor(0);

const isType = R.propEq('type');

const isText = isType(ELE.Text);
// const isImage = isType(P.Image);
const isTextInstance = isType(ELE.TextInstance);

const setNodeHeight = node => {
    const box = node.box || {};
    const style = node.style || {};
    return setHeight(box.height || style.height);
}


/**
 * Set styles valeus into yoga node before layout calculation
 *
 * @param {Object} node
 * @returns {Object} node
 */
const setYogaValues = R.tap(node => {
    if (!node || !node.style) return;

    R.compose(
        setNodeHeight(node),
        setWidth(node.style.width),
        setMinWidth(node.style.minWidth),
        setMaxWidth(node.style.maxWidth),
        setMinHeight(node.style.minHeight),
        setMaxHeight(node.style.maxHeight),
        setMarginTop(node.style.marginTop),
        setMarginRight(node.style.marginRight),
        setMarginBottom(node.style.marginBottom),
        setMarginLeft(node.style.marginLeft),
        setPaddingTop(node.style.paddingTop),
        setPaddingRight(node.style.paddingRight),
        setPaddingBottom(node.style.paddingBottom),
        setPaddingLeft(node.style.paddingLeft),
        setPositionType(node.style.position),
        setPositionTop(node.style.top),
        setPositionRight(node.style.right),
        setPositionBottom(node.style.bottom),
        setPositionLeft(node.style.left),
        setBorderTop(node.style.borderTopWidth),
        setBorderRight(node.style.borderRightWidth),
        setBorderBottom(node.style.borderBottomWidth),
        setBorderLeft(node.style.borderLeftWidth),
        setDisplay(node.style.display),
        setFlexDirection(node.style.flexDirection),
        setAlignSelf(node.style.alignSelf),
        setAlignContent(node.style.alignContent),
        setAlignItems(node.style.alignItems),
        setJustifyContent(node.style.justifyContent),
        setFlexWrap(node.style.flexWrap),
        setOverflow(node.style.overflow),
        setAspectRatio(node.style.aspectRatio),
        setFlexBasis(node.style.flexBasis),
        setFlexGrow(node.style.flexGrow),
        setFlexShrink(node.style.flexShrink),
    )(node);
});

/**
 * Inserts child into parent' yoga node
 *
 * @param {Object} parent
 * @param {Object} node
 * @param {Object} node
 */
const insertYogaNodes = parent =>
    R.tap(child => parent.insertChild(child[YOGA_NODE], parent.getChildCount()));

const setMeasureFunc = (shape) => node => {
    const yogaNode = node[YOGA_NODE];

    // TODO: 改进性能
    if (isText(node)) {
        yogaNode.setMeasureFunc(((width, widthMode, height, heightMode) => {
          const textIns = node.children[0];
          if (textIns && textIns.type === 'TEXT_INSTANCE') {
            // console.log('measure text', textIns.value);
            // console.log('measure node', node, width, widthMode, height, heightMode);
            const textInfo = measureText(textIns.value, node.style);
            // console.log('measured text info', textInfo);
            return {
              width: textInfo.width > node.style.maxWidth ? node.style.maxWidth : textInfo.width,
              height: textInfo.height,
            };
          }
          return { height, width };
        }));
    }
    //
    // if (isImage(node)) {
    //     yogaNode.setMeasureFunc(measureImage(page, node));
    // }
    //
    // if (isCanvas(node)) {
    //     yogaNode.setMeasureFunc(measureCanvas(page, node));
    // }
    //
    // if (isSvg(node)) {
    //     yogaNode.setMeasureFunc(measureSvg(page, node));
    // }

    return node;
};

const isNotText = R.complement(isText);
// const isNotNote = R.complement(isNote);
// const isNotSvg = R.complement(isSvg);
const isNotTextInstance = R.complement(isTextInstance);
// const isLayoutElement = R.allPass([isNotText, isNotNote, isNotSvg]);
const isLayoutElement = R.allPass([isNotText]);

/**
 * Creates and add yoga node to document tree
 * Handles measure function for text and image nodes
 *
 * @param {Object} node
 * @returns {Object} node with appended yoga node
 */
const createYogaNodes = (shape, config = {}) => node => {
    const yogaNode = Yoga.Node.createWithConfig(YOGA_CONFIG);

    return R.compose(
        setMeasureFunc(shape, config),
        R.when(
            isLayoutElement,
            R.evolve({
                children: R.map(
                    R.compose(
                        insertYogaNodes(yogaNode),
                        createYogaNodes(shape, config),
                    ),
                ),
            }),
        ),
        setYogaValues,
        R.assoc(YOGA_NODE, yogaNode),
    )(node);
};

/**
 * Performs yoga calculation
 *
 * @param {Object} node
 * @returns {Object} node
 */
const calculateLayout = shape => {
    shape[YOGA_NODE].calculateLayout();
    return shape;
};

/**
 * Saves Yoga layout result into 'box' attribute of node
 *
 * @param {Object} node
 * @returns {Object} node with box data
 */
const persistDimensions = node => {
    return R.evolve({
        children: R.map(R.when(isNotTextInstance, persistDimensions)),
        box: R.always(
            R.mergeAll([
                getPadding(node),
                getMargin(node),
                getBorderWidth(node),
                getPosition(node),
                getDimension(node),
            ]),
        ),
    })(node);
};

/**
 * Removes yoga node from document tree
 *
 * @param {Object} node
 * @returns {Object} node without yoga node
 */
const destroyYogaNodes = node => {
    return R.compose(
        R.dissoc(YOGA_NODE),
        R.evolve({ children: R.map(destroyYogaNodes) }),
    )(node);
};

/**
 * Free yoga node from document tree
 *
 * @param {Object} node
 * @returns {Object} node without yoga node
 */
const freeYogaNodes = node => {
    if (node[YOGA_NODE]) node[YOGA_NODE].freeRecursive();
    return node;
};

/**
 * Calculates page object layout using Yoga.
 * Takes node values from 'box' and 'style' attributes, and persist them back into 'box'
 * Destroy yoga values at the end.
 *
 * @param {Object} shape object
 * @returns {Object} shape object with correct 'box' layout attributes
 */
export const resolveShapeDimensions = (shape) =>
    R.ifElse(
        R.isNil,
        R.always(null),
        R.compose(
            destroyYogaNodes,
            freeYogaNodes,
            persistDimensions,
            calculateLayout,
            createYogaNodes(shape),
        ),
    )(shape);

export default resolveShapeDimensions;
