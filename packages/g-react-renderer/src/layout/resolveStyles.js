import * as R from 'ramda';
import stylesheet from '@react-pdf/stylesheet';

/**
 * Resolves node styles
 *
 * @param {Object} container
 * @param {Object} document node
 * @returns {Object} node (and subnodes) with resolved styles
 */
const resolveNodeStyles = container => node => {
    return R.evolve({
        style: stylesheet(container),
        children: R.map(resolveNodeStyles(container)),
    })(node);
};

/**
 * Resolves shape styles
 *
 * @param {Object} shape
 * @returns {Object} document page with resolved styles
 */
const resolveShapeStyles = shape => {
    const box = R.prop('box', shape);
    const style = R.prop('style', shape);
    const container = R.isEmpty(box) ? style : box;

    return R.evolve({
        style: stylesheet(container),
        children: R.map(resolveNodeStyles(container)),
    })(shape);
};

/**
 * Resolves document styles
 *
 * @param {Object} document root
 * @returns {Object} document root with resolved styles
 */
export default R.evolve({
    children: R.map(resolveShapeStyles),
});
