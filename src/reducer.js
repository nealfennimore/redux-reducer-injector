import { combineReducers } from 'redux';
import merge from 'deepmerge';
import { pipe } from './utils/fp';

export const isFunction = arg => typeof arg === 'function';
export const isObject = arg => arg !== null && typeof arg === 'object';

export const isReducer = ( reducer ) => isFunction( reducer );
export const hasNestedReducer = ( reducer ) => Object.values( reducer ).some( isReducer );
export const shouldCombineNextLevel = ( reducer ) => {
    return ( isReducer( reducer ) || isObject( reducer ) ) && hasNestedReducer( reducer );
};

/**
 * Merge all reducers together
 *
 * @export
 * @param {Object} reducers
 * @returns {Object} Merged reducers
 */
export const mergeReducers = ( reducers ) => {
    return reducers.reduce(
        ( result, reducer ) => merge( result, reducer ),
        {}
    );
};


/**
 * Recursively nest reducers
 *
 * @export
 * @param {Object} asyncReducers
 * @returns Merged nested reducers
 */
export const nestAsyncReducers = pipe(
    getReducersAtLevel,
    reducers => reducers.filter( isObject ),
    mergeReducers
);

/**
 *
 *
 * @export
 * @param {Object} asyncReducers
 * @returns Array of possible empty items and reducer objects
 */
export function getReducersAtLevel( asyncReducers ) {
    return Object.entries( asyncReducers ).map( ( [ key, reducer ] ) => {

        // Set the key to a combination of the next level
        // NOTE: This will replace any reducer already set to this key
        if ( shouldCombineNextLevel( reducer ) ) {
            return {
                [ key ]: combineReducers(
                    // Recursive call
                    nestAsyncReducers( reducer )
                )
            };

        // No nested levels, then return the reducer
        } else if ( isReducer( reducer ) ) {
            return {
                [ key ]: reducer
            };
        }
    } );
}

/**
 *  Setup createReducer with initial reducers
 *  Will return a new function that will take async reducers to be injected
 *
 * @export
 * @param {Object} initialReducers
 * @returns Function
 */
export default function createReducer( initialReducers = {} ) {
    return function _createReducerAsync( asyncReducers = {} ) {
        return combineReducers( {
            ...initialReducers,
            ...nestAsyncReducers( asyncReducers )
        } );
    };
}
