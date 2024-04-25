import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './screen/App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import MyRouter from './router/MyRouter';
import { BGProvider } from './screen/layout/bg/BGContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    {/* 因为我们使用了懒加载所以需要suspense */}
    <Suspense fallback={<h3>Loading...</h3>}>
    <BGProvider>
      <MyRouter></MyRouter>
    </BGProvider>
    </Suspense>
    </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
