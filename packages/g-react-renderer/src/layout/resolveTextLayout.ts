import * as R from 'ramda';
//@ts-ignore
import * as P from '@react-pdf/primitives';
//@ts-ignore
import layoutText from '@react-pdf/layout/lib/text/layoutText';

const isType = R.propEq('type');

const isSvg = isType(P.Svg);

const isText = isType(P.Text);

const isNotSvg = R.complement(isSvg);

const shouldLayoutText = (node: any) => isText(node) && !node.lines;

/**
 * Performs text layout on text node if wasn't calculated before.
 * Text layout is usually performed on Yoga's layout process (via setMeasureFunc),
 * but we need to layout those nodes with fixed width and height.
 *
 * @param {Object} node
 * @returns {Object} layout node
 */
// @ts-ignore
const resolveTextLayout = (node: any) => {
  // @ts-ignore
    const mapChild = (child: any) => resolveTextLayout(child);

    return R.compose(
        R.evolve({
            children: R.map(R.when(isNotSvg, mapChild)),
        }),
        R.when(
            shouldLayoutText,
            R.compose(
                R.converge(R.assoc('lines'), [
                    R.converge(layoutText, [
                        R.identity,
                        R.path(['box', 'width']),
                        R.path(['box', 'height']),
                    ]),
                    R.identity,
                ]),
            ),
        ),
    )(node);
};

export default resolveTextLayout;
