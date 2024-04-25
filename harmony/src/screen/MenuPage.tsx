import React, { Suspense } from 'react';
import { Breadcrumb, Button, Layout, Menu, MenuProps, theme } from 'antd';
import { QuestionCircleOutlined, UserOutlined, PhoneOutlined, BuildOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import '../style/menuPage.css'
import ApplyHeader from '../component/header/ApplyArtistHeader';
import { Outlet ,BrowserRouter as Router, Route, useNavigate, Routes, Link } from 'react-router-dom';
import { Footer } from 'antd/es/layout/layout';
import BecomeMusician from './layout/becomeMusician';
import WhatNext from './layout/whatNext';
import Contact from './layout/contact';
import Organization from './layout/organization';



const { Header, Sider, Content } = Layout;
const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));





const MenuPage = () => {
    const navigate = useNavigate();


const items2: MenuProps['items'] = [
    {
      key: 'sub1',
      icon: React.createElement(QuestionCircleOutlined),
      label: 'Questions',
      children: [
        {
            key: '1',
            label: <Link to='/menuPage/becomeMusician'>Become Musician</Link>,
            // onClick: () => navigate('/menuPage/becomeMusician')
        },
        {
            key: '2',
            label: <Link to='/menuPage/whatNext' style={{overflow: 'auto'}}>What Next</Link>,
            // onClick: () => navigate('/menuPage/whatNext')
        },
    ],
    },
    {
      key: 'sub2',
      icon: React.createElement(UserOutlined),
      label: 'About Us',
      children: [
        {
            key: '3',
            icon: React.createElement(PhoneOutlined),
            label: <Link to='/menuPage/contact' style={{overflow: 'auto'}}>Contact</Link>,
            // onClick: () => navigate('/menuPage/contact')
        },
        {
            key: '4',
            icon: React.createElement(BuildOutlined),
            label: <Link to='/menuPage/organization'>Organization</Link>,
            // onClick: () => navigate('/menuPage/organization')
        },
    ],
    },
  ];






//   );
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const breadcrumbItems = [
        { breadcrumbName: 'Harmony' },
        { breadcrumbName: 'Menu' }
    ];
    return (
        <div style={{overflow: 'auto'}}>
            <div className="custom-apply-header">
                <ApplyHeader />
            </div>

            <Layout style={{ minHeight: '100vh' }}>
            {/* <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
            </Header> */}
            <Content style={{ padding: '0 50px', overflow: 'auto'}}>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Harmony</Breadcrumb.Item>
                <Breadcrumb.Item>Menu</Breadcrumb.Item>

                </Breadcrumb> */}
                <Breadcrumb
                    style={{ margin: '16px 0' }}
                    routes={breadcrumbItems}  // 使用 `routes` 而不是 `items`
                />
                <Layout style={{ padding: '24px 0', background: colorBgContainer, minHeight: '85vh' }}>
                <Sider style={{ background: colorBgContainer }} width={200}>
                    <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
                    items={items2}
                    />
                </Sider>

                <Content style={{ padding: '0 24px', minHeight: 280, overflow: "scroll" }}>
                    {/* <Routes>
                        <Route path="/becomeMusician" element={<BecomeMusician />} />
                        <Route path="/whatNext" element={<WhatNext />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/organization" element={<Organization />} />
                    </Routes> */}
                    <Suspense fallback={<h3>Loading...</h3>}>
                    <Outlet></Outlet>
                    </Suspense>



                </Content>
                {/* <Button size='small'  onClick={()=>{navigate('/creatorCenter')}}>LogOut</Button> */}

                </Layout>
            </Content>

            </Layout>
        </div>

    );
}

export default MenuPage;
