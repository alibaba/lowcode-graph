/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import ReactFiberReconciler from 'react-reconciler';
import {
    unstable_scheduleCallback as schedulePassiveEffects,
    unstable_cancelCallback as cancelPassiveEffects,
} from 'scheduler';

import propsEqual from './propsEqual';

import {omit} from 'lodash';

const performance = window.performance || window.msPerformance || window.webkitPerformance;

const emptyObject = {};

export const createRenderer = ({ onChange = () => { } }) => {
    return ReactFiberReconciler({
        schedulePassiveEffects,

        cancelPassiveEffects,

        supportsMutation: true,

        isPrimaryRenderer: false,

        warnsIfNotActing: false,

        appendInitialChild(parentInstance, child) {
            child.parent = omit(parentInstance, 'children');
            parentInstance.children.push(child);
        },

        createInstance(type, { style, children, name, ...props }) {
            return {
                type,
                box: {},
                style: style || {},
                props: props || {},
                children: [],
                name,
            };
        },

        createTextInstance(text, rootContainerInstance) {
            return { type: 'TEXT_INSTANCE', value: text };
        },

        finalizeInitialChildren(element, type, props) {
            return false;
        },

        getPublicInstance(instance) {
            return instance;
        },

        prepareForCommit() {
            // Noop
        },

        clearContainer() {
            // Noop
        },

        prepareUpdate(element, type, oldProps, newProps) {
            return !propsEqual(oldProps, newProps);
        },

        resetAfterCommit: onChange,

        resetTextContent(element) {
            // Noop
        },

        getRootHostContext() {
            return emptyObject;
        },

        getChildHostContext() {
            return emptyObject;
        },

        shouldSetTextContent(type, props) {
            return false;
        },

        now () {
            return performance.now();
        },

        useSyncScheduling: true,

        appendChild(parentInstance, child) {
            child.parent = parentInstance;
            parentInstance.children.push(child);
        },

        appendChildToContainer(parentInstance, child) {
            child.parent = parentInstance;
            if (parentInstance.type === 'ROOT') {
                parentInstance.shape = child;
            } else {
                parentInstance.children.push(child);
            }
        },

        insertBefore(parentInstance, child, beforeChild) {
            const index = parentInstance.children?.indexOf(beforeChild);

            if (index === undefined) return;

            if (index !== -1 && child)
                parentInstance.children.splice(index, 0, child);
        },

        removeChild(parentInstance, child) {
            const index = parentInstance.children?.indexOf(child);

            if (index === undefined) return;

            if (index !== -1) parentInstance.children.splice(index, 1);
        },

        removeChildFromContainer(parentInstance, child) {
            const index = parentInstance.children?.indexOf(child);

            if (index === undefined) return;

            if (index !== -1) parentInstance.children.splice(index, 1);
        },

        commitTextUpdate(textInstance, oldText, newText) {
            textInstance.value = newText;
        },

        commitUpdate(instance, updatePayload, type, oldProps, newProps) {
            const { style, ...props } = newProps;
            instance.props = props;
            instance.style = style;
        },
    });
};
