import * as R from 'ramda';

const applySingleTransformation = (ctx: any, transform: any) => {
    const { operation, value } = transform;

    switch (operation) {
        case 'scale': {
            const [scaleX, scaleY] = value;
            // ctx.scale(scaleX, scaleY, { origin });
            break;
        }

        case 'rotate': {
            const [angle] = value;
            // ctx.rotate(angle, { origin });
            break;
        }

        case 'translate': {
            const [x, y] = value;
            // ctx.translate(x, y, { origin });
            break;
        }

        case 'matrix': {
            // ctx.transform(...value);
            break;
        }

        default: {
            console.error(`Transform operation: '${operation}' doesn't supported`);
        }
    }
};

const applyTransformations = (ctx: any, node: any) => {
    if (!node.origin) return node;

    const origin = [node.origin.left, node.origin.top];
    const operations = (node.style && node.style.transform) || [];

    operations.forEach((operation: any) => {
        applySingleTransformation(ctx, operation);
    });

    return node;
};

export default R.curryN(2, applyTransformations);
