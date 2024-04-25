import React, { Fragment } from 'react';
import throttle from 'lodash/throttle';
import 'animate.css';
import './index.scss';

// import {
//   changeBG,
//   switchFilter,
//   switchMask,
// } from '@/redux/modules/layouts/bg/action';
// import { connect } from 'react-redux';

// interface BGProps {
//   changeBG: Function;
//   switchMask: Function;
//   switchFilter: Function;
//   path: string;
//   mask: boolean;
//   filter: boolean;
//   pathChangeId: number;
// }
interface BGProps {
  path: string;
  mask: boolean;
  filter: boolean;
  pathChangeId: number;
}

class BG extends React.Component<BGProps> {
  bgRef: any = React.createRef();
  state = {
    path: "",
    mask: false,
    filter: false,
    pathChangeId: 0,
  };
  changeBG = (path: string) => {
    this.setState({ path });
  };

  switchMask = (isOpen: boolean) => {
    this.setState({ mask: isOpen });
  };

  switchFilter = (isOpen: boolean) => {
    this.setState({ filter: isOpen });
  };
  render() {
    window.addEventListener('mousemove', this.listenMove);
    return (
      <Fragment>
        <div id="bgMask" className={this.props.mask ? 'active' : ''}></div>
        <div
          key={this.props.pathChangeId}
          className={`bg_container animate__animated animate__fadeIn`}
        >
          <div
            id="bg"
            ref={this.bgRef}
            className={`${this.props.filter ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${
                this.props.path
                  ? this.props.path
                  : require('../../../assets/images/bg/bg4.jpg')
             
              })`,
            }}
          ></div>
        </div>
      </Fragment>
    );
  }

  listenMove = throttle((e: any) => {
    const ele = this.bgRef.current;
    const x = parseFloat((e.clientX / window.innerWidth).toFixed(2)) * 20 + 40;
    const y = parseFloat((e.clientY / window.innerHeight).toFixed(2)) * 6 + 47;
    if (ele) ele.style.backgroundPosition = `${x}% ${y}%`;
  }, 15);
}

/**
 * 背景组件，redux 有三个导出方法：
 * `changeBG(path: string)`
 * `switchFilter(isOpen: boolean)`
 * `switchMask(isOpen: boolean)`
 */
// export default connect(
//   (state: any) => ({
//     path: state.BG.bgPath,
//     pathChangeId: state.BG.pathChangeId,
//     mask: state.BG.mask,
//     filter: state.BG.filter,
//   }),
//   { changeBG, switchFilter, switchMask },
// )(BG);

export default BG;