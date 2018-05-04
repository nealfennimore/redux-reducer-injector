import { has, set } from 'object-path';
import { curry } from './utils/fp';

export function augmentStore( createReducer, store ) {
    store.injectedReducers = {};
    store.injectReducers = function injectReducers( reducers ) {
        Object.entries( reducers ).forEach( ( [ key, reducer ] ) =>{
            if ( ! has( store, key ) ) {
                set( store.injectedReducers, key, reducer );
                store.replaceReducer( createReducer( store.injectedReducers ) );
            }
        } );
    };
    return store;
}

export default curry( augmentStore );
