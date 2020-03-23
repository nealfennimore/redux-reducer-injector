import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { curry } from 'src/utils/fp';

/**
 * Inject reducers to run with component lifecycle
 *
 * @param {Object} options Should contain reducers as an object
 * @param {any} WrappedComponent Component to wrap
 * @returns ReducerInjector
 */
function ReducerInjectorHOC( options, WrappedComponent ) {
    const { reducers, STORE_KEY } = { reducers: {}, STORE_KEY: 'store', ...options };

    const componentName = WrappedComponent.displayName ||
	WrappedComponent.name ||
    'Component';

    class ReducerInjector extends Component {
        static displayName = `ReducerInjector(${ componentName })`
        static propTypes = {
            [ STORE_KEY ]: PropTypes.object // eslint-disable-line
        }
        static contextTypes = {
            /**
             * @deprecated since react-redux v6.0.0
             */
            [ STORE_KEY ]: PropTypes.object
        }

        constructor( ...args ) {
            super( ...args );
            this.reducers = reducers;
            this.injectReducers();
        }

        /**
         * Retrieve the redux store
         *
         * @readonly
         * @memberof ReducerInjector
         */
        get store() {
            return (
                this.props[STORE_KEY] ||
                /**
                 * @deprecated since react-redux v6.0.0
                 */
                this.context[STORE_KEY]
            );
        }

        /**
         * Retrieve reducer keys
         *
         * @readonly
         * @memberof ReducerInjector
         * @returns {Array<String>}
         */
        get reducerKeys() {
            return Object.keys( this.reducers );
        }

        /**
         * Get keys of reducers that have not yet been injected
         *
         * @readonly
         * @memberof ReducerInjector
         * @returns {Array<String>}
         */
        get injectableKeys() {
            const injectedKeys = Object.keys( this.store.injectedReducers );
            return this.reducerKeys.filter( ( key )=> ! injectedKeys.includes( key ) );
        }

        /**
         * Get reducers that are readu to be injected
         *
         * @readonly
         * @memberof ReducerInjector
         * @returns {Object}
         */
        get injectableReducers() {
            return this.injectableKeys.reduce( ( result, key )=>{
                result[key] = this.reducers[key];
                return result;
            }, {} );
        }

        /**
         * Determine if we have usable reducers
         *
         * @readonly
         * @memberof ReducerInjector
         * @returns {boolean}
         */
        get hasReducers() {
            return !! this.reducerKeys.length;
        }

        /**
         * Injects reducers into store
         *
         * @memberof ReducerInjector
         * @returns void
         */
        injectReducers() {
            if ( this.hasReducers ) {
                this.store.injectReducers( this.injectableReducers );
            }
        }

        render() {
            return (
                <WrappedComponent {...this.props} />
            );
        }
    }

    return ReducerInjector;
}

export default curry( ReducerInjectorHOC );
