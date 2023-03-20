import * as R from 'ramda';

import resolveStyles from './resolveStyles';
import resolveDimensions from './resolveDimensions';

const layout = R.compose(
    resolveDimensions,
    resolveStyles,
);

export default layout;
