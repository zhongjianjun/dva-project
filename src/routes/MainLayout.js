import React from 'react';
import { connect } from 'dva';
import styles from './MainLayout.css';

function MainLayout() {
  return (
    <div className={styles.normal}>
      Route Component: MainLayout
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MainLayout);
