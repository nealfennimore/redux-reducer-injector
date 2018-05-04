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
    const { reducers, STORE_KEY } = Object.assign( { reducers: {}, STORE_KEY: 'store' }, options );

    const componentName = WrappedComponent.displayName ||
	WrappedComponent.name ||
    'Component';

    class ReducerInjector extends Component {
        static displayName = `ReducerInjector(${ componentName })`
        static propTypes = {
            [ STORE_KEY ]: PropTypes.object // eslint-disable-line
        }
        static contextTypes = {
            [ STORE_KEY ]: PropTypes.object
        }

        reducers = reducers

        componentWillMount() {
            this.injectReducers();
        }

        get store() {
            return this.props[STORE_KEY] || this.context[STORE_KEY];
        }

        get keys() {
            return Object.keys( this.reducers );
        }

        get usableKeys() {
            const injectedKeys = Object.keys( this.store.injectedReducers );
            return this.keys.filter( ( key )=> ! injectedKeys.includes( key ) );
        }

        get usableReducers() {
            return this.usableKeys.reduce( ( result, key )=>{
                result[key] = this.reducers[key];
                return result;
            }, {} );
        }

        get hasReducers() {
            return !! this.keys.length;
        }

        injectReducers() {
            if ( this.hasReducers ) {
                this.store.injectReducers( this.usableReducers );
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
