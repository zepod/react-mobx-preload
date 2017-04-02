import React, { PropTypes, PureComponent } from 'react';
import { createConnect, createPreloader } from '../src';
import { assert } from 'chai';
import { jsdom } from 'jsdom';
import TestUtils from 'react-addons-test-utils';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;

describe('connect', () => {
  let store;
  let connect;

  beforeEach(() => {
    store = {
      prop: '123'
    };
    connect = createConnect(store);
  });

  it('should pass props', () => {
    let result = null;
    const setResult = val => {result = val;};
    class Comp extends PureComponent {
      static propTypes = {
        one_prop: PropTypes.string.isRequired
      }
      render() {
        this.props.setResult(this.props.one_prop);
        return (<div></div>);
      }
    }

    const Decor = connect(store => ({ one_prop: store.prop }))(Comp);

    TestUtils.renderIntoDocument(
      <Decor setResult={setResult} />
    );

    assert.equal(result, store.prop);
  });
});

describe('preload', () => {
  let preloader;
  let result = '';
  const Store = { prop: '123' };
  const changeResult = (x) => {result = x;};
  const loading = () => (<div id="content">{changeResult('load')}loading</div>);

  beforeEach(() => {
    preloader = createPreloader(Store, loading);
    result = '';
  });

  it('should show loader', () => {
    class Comp extends PureComponent {
      render() {
        return (<div id="content">{changeResult('comp')}component</div>);
      }
    }

    const Decor = preloader(() => new Promise((resolve) => setTimeout(resolve, 2000)))(Comp);

    TestUtils.renderIntoDocument(
      <Decor />
    );

    assert.equal(result, 'load');
  });
  it('should pass arguments to preloader', () => {
    class Comp extends PureComponent {
      render() {
        return (<div id="content">component</div>);
      }
    }

    const Decor = preloader((store, props) =>
    new Promise(() => {
      assert.equal(store, Store);
      assert.equal(props.prop, 'someProp');
    }))(Comp);

    TestUtils.renderIntoDocument(
      <Decor prop="someProp" />
    );

    assert.equal(result, 'load');
  });

  it('should show component', () => {
    class Comp extends PureComponent {
      render() {
        return (<div id="content">{changeResult('comp')}component</div>);
      }
    }

    const Decor = preloader(() => new Promise((resolve) => setTimeout(resolve, 10)))(Comp);

    TestUtils.renderIntoDocument(
      <Decor />
    );

    setTimeout(() => {
      assert.equal(result, 'comp');
    }, 100);
  });
});
