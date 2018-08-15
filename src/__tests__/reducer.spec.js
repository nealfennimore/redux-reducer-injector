import { createStore } from 'redux';
import augmentStore from 'src/store';
import setupCreateReducer, * as utils from '../reducer';

function reducerFactory( initialState = {} ) {
    return ( state = initialState, action ) => {
        switch ( action.type ) {
        default:
            return state;
        }
    };
}

function storeFactory( createReducer ) {
    const store = createStore( createReducer(), {} );
    return augmentStore( createReducer, store );
}

describe( 'reducer', ()=>{
    let store, createReducer, spy;

    beforeEach( () => {
        createReducer = setupCreateReducer( {
            initialReducer: reducerFactory()
        } );
        store = storeFactory( createReducer );
        spy = jest.spyOn( store, 'injectReducers' );
    } );
    describe( 'setupCreateReducer', ()=>{
        test( 'should setup with initial reducers', ()=>{
            const test = jest.fn();
            expect( setupCreateReducer( {test} ) ).toBeInstanceOf( Function );
            expect( setupCreateReducer( {test} )( {test} ) ).toBeInstanceOf( Function );
            expect( setupCreateReducer()() ).toBeInstanceOf( Function );
        } );
    } );

    describe( 'utils', () => {
        const nestedObject = {
            a: jest.fn(),
            b: jest.fn()
        };

        const noNested = {
            a: '',
            b: 0
        };

        const nestedReducer = function() {};
        nestedReducer.a = jest.fn();
        nestedReducer.b = jest.fn();

        test( 'isReducer', () => {
            expect( utils.isReducer( jest.fn() ) ).toEqual( true );
            expect( utils.isReducer( {} ) ).toEqual( false );
        } );
        test( 'hasNestedReducers', () => {
            expect( utils.hasNestedReducer( nestedObject ) ).toEqual( true );
            expect( utils.hasNestedReducer( nestedReducer ) ).toEqual( true );
            expect( utils.hasNestedReducer( noNested ) ).toEqual( false );
        } );
        test( 'shouldCombineNextLevel', () => {
            expect( utils.shouldCombineNextLevel( nestedObject ) ).toEqual( true );
            expect( utils.shouldCombineNextLevel( nestedReducer ) ).toEqual( true );
            expect( utils.shouldCombineNextLevel( noNested ) ).toEqual( false );
        } );
        test( 'mergeReducers', () => {
            expect( utils.mergeReducers( [nestedObject] ) ).toMatchSnapshot();
            expect( utils.mergeReducers( [nestedReducer] ) ).toMatchSnapshot();
        } );
    } );

    describe( 'nestAsyncReducers', () => {
        test( 'should nest reducers based on key', () => {
            const B1 = { B1: 'B1' };
            const B2 = { B2: 'B2' };
            const B3 = { B3: 'B3' };
            const C1 = { C1: 'C1' };
            const D1 = { D1: 'D1' };

            store.injectReducers( {
                'a.b1': reducerFactory( B1 )
            } );
            store.injectReducers( {
                'a.b2': reducerFactory( B2 )
            } );
            expect( store.getState() ).toMatchSnapshot();

            store.injectReducers( {
                'a.b3': reducerFactory( B3 )
            } );
            store.injectReducers( {
                'a.b4.c1': reducerFactory( C1 )
            } );

            expect( store.getState() ).toMatchSnapshot();
            store.injectReducers( {
                'a.b4.c2.d1': reducerFactory( D1 )
            } );

            expect( store.getState() ).toMatchSnapshot();
            expect( spy.mock.calls ).toMatchSnapshot();
        } );
    } );
} );
