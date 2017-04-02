import React, { PureComponent } from 'react';
import { observer } from 'mobx-react'; // eslint-disable-line

/**
* @param {Object} Store - Your MobX Store
* @param {Object} PreloaderComponent - Component that will be displayed while preloading, instead of Component
* @returns {Function} Decorator - Can be used on any component given you provide a preload function
**/
export const createPreloader =
  /**
  * @param {LoadingFuncion} LoadingFunction - Your preloading func
  * @returns {Function} Callback - s
  **/
  (Store, PreloaderComponent) =>
    /**
    * @param {Component} DecoratedComponent - Your preloading func
    * @returns {Component} Resulting HOC
    **/
    LoadingFunction =>
      DecoratedComponent =>
        class PreloadHOC extends PureComponent {
          constructor(props, context) {
            super(props, context);
            this.state = {
              isPreloading: true
            };
            LoadingFunction(Store, this.props).then(() => this.setState({ isPreloading: false }));
          }

          componentWillReceiveProps(nextProps) {
            const nextParams = Object.keys(nextProps.params)
                      .map((key) => nextProps.params[key]);
            const params = Object.keys(this.props.params)
                      .map(key => this.props.params[key]);
            const paramsChanged = nextParams.reduce((changed, param) => (
              nextParams.length !== params.length || changed || params.indexOf(param) === -1
            ), false);

            if (paramsChanged) {
              this.setState({ isPreloading: true });
              LoadingFunction(Store, nextProps).then(() => this.setState({ isPreloading: false }));
            }
          }

          render() {
            if (this.state.isPreloading) {
              return (<PreloaderComponent />);
            }
            return (<DecoratedComponent {...this.props} />);
          }
      };

    /**
     * This callback is displayed as a global member.
     * @callback LoadingFunction
     * @param {Object} Store - Your MobX Store
     * @param {Object} Props - Props of your Component
     * @returns {Promise} Promise - Preloading will end upon fullfilment of this Promise
     */
export const createConnect = Store => getData => DecoratedComponent => {
  const ConnectHOC = props => (
      <DecoratedComponent
        {...props}
        {...getData(Store, props.params, props)}
      />
    );

  ConnectHOC.propTypes = { params: React.PropTypes.object };

  return observer(ConnectHOC);
};
