import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import augmentStore from 'src/store';
import ReducerInjector from '../ReducerInjector';

class Test extends Component {
    render() {
        return 'test';
    }
}

describe( 'ReducerInjector', ()=>{
    let store, createReducer, spy, reducers, TestComponent;
    beforeEach( ()=>{
        store = {
            dispatch: jest.fn(),
            replaceReducer: jest.fn()
        };

        createReducer = jest.fn();
        augmentStore( createReducer, store );
        spy = jest.spyOn( store, 'injectReducers' );

        reducers = {
            r1: jest.fn(),
            r2: jest.fn(),
            r3: jest.fn()
        };

        TestComponent = ReducerInjector( { reducers } )( Test );
    } );

    test( 'should match snapshot', ()=>{
        const component = renderer.create(
            <TestComponent store={store} />
        );
        expect( component.toJSON() ).toMatchSnapshot();
    } );

    describe( 'lifecycle', ()=>{
        test( 'should inject reducers on mount', ()=>{
            const component = mount(
                <TestComponent store={store} />
            );

            expect( component.instance().store ).toEqual( store );
            expect( component.instance().reducers ).toEqual( reducers );
            expect( component.instance().hasReducers ).toEqual( true );
            expect( component.instance().usableReducers ).toMatchSnapshot();

            expect( spy.mock.calls ).toMatchSnapshot();
        } );
        test( 'should inject only usable reducers on mount', ()=>{
            store.injectedReducers.r1 = jest.fn();
            const component = mount(
                <TestComponent store={store} />
            );

            expect( component.instance().store ).toEqual( store );
            expect( component.instance().reducers ).toEqual( reducers );
            expect( component.instance().hasReducers ).toEqual( true );
            expect( component.instance().usableReducers ).toMatchSnapshot();

            expect( spy.mock.calls ).toMatchSnapshot();
        } );
        test( 'should not inject when no reducers', ()=>{
            TestComponent = ReducerInjector( {} )( Test );
            const component = mount(
                <TestComponent store={store} />
            );

            expect( component.instance().store ).toEqual( store );
            expect( component.instance().reducers ).toEqual( {} );
            expect( component.instance().hasReducers ).toEqual( false );
            expect( component.instance().usableReducers ).toMatchSnapshot();
            expect( spy ).not.toBeCalled();
        } );
    } );


} );
