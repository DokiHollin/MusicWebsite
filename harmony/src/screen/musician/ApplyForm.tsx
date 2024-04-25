import React, { ChangeEvent, useEffect, useState } from 'react';
import ApplyHeader from 'src/component/header/ApplyArtistHeader';
import 'src/style/applyForm.css'


// export default ApplyArtistForm;
import { Form, Input, Select, DatePicker, Checkbox, Button, Upload, message, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {FileObject } from '../../model/file'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import PlayerContext from 'src/store/PlayerContext';
import UserContext from 'src/store/UserContext';
import { observer } from 'mobx-react-lite';

interface Avatar {
    files: any[];

    // ... any other properties you expect to use
  }
const ApplyArtistForm = () => {
    const { Option } = Select;
    const [isVisible, setIsVisible] = useState(false);
    const [agreementContent, setAgreementContent] = useState<any>('');
    const [fileList, setFile] = useState<any>([]);
    const navigate = useNavigate();
    // const onFinish = (values: any) => {
    //     console.log('Received values of form: ', values);
    //     finishCreate();
    // };
    function finishCreate() {
        message.success('Form Submit Successful, Waiting For Review')
        navigate('/')
    }
    const handleCheckboxClick = () => {
        setIsVisible(true);
    };

    const handleCloseModal = () => {
        setIsVisible(false);
    };
    const [form] = Form.useForm(); // 获取form实例

    // const onFinish = async (values: any) => {
    //     try {
    //         await form.validateFields(); // 手动验证所有字段
    //         console.log('Received values of form: ', values);
    //         finishCreate();
    //     } catch (error) {
    //         // 如果有任何验证错误，显示一个提醒消息
    //         message.error('Please complete all required fields before submitting.');
    //     }
    // };
    const onFinish = async (values: { musicianID: any; userID: any; musicianName: any; genre: any; Bio: any; profilePictureURL: any; region: any; realName: any; phoneNumber: any; nationality: any; outsidePlatform: any; nickname: any; platformFollowers: any; avatar: { file: any; }; }) => {
        // 创建一个新的对象来存储你想要的数据格式
        console.log(UserContext.userID)
        const formData = new FormData();
                const musicianData: { [key: string]: any } = {
                
                UserID: UserContext.userID,
                MusicianName: values.musicianName,
                Genre: values.genre,
                Bio: values.Bio,
                ProfilePictureURL: fileList,
                Region: values.region,
                RealName: values.realName,
                PhoneNumber: values.phoneNumber,
                Nationality: values.nationality,
                OutsidePlatform: values.outsidePlatform,
                Nickname: values.nickname,
                PlatformFollowers: values.platformFollowers
            };

            // 将musicianData对象的每个属性单独添加到FormData对象中
            Object.keys(musicianData).forEach(key => {
                formData.append(key, musicianData[key]);
            });
        // 发送到服务器
        try {
            const token = UserContext.token;
            console.log(token)
            const response = await fetch('http://3.26.210.47/api/musician/create/', {
                method: 'POST',
                headers: {
    
                    'Authorization': 'token '+token,  // 添加此行
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
    
            const data = await response.json();
            console.log(data);
            finishCreate();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    
    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files && event.target.files[0];
        if (file) {
            // const formData = new FormData();
            // formData.append('file', file);
            setFile(file)
            console.log(file)
        }
    }
    
    return (
        <div className="apply-container">
            <ApplyHeader />
            
            <div className="form-container">
                    <Form 
                        layout="horizontal" 
                        onFinish={onFinish} 
                        className="artist-form" 
                        colon={false}
                        form={form} // 绑定form实例
                    >
                        {/* 艺人信息 */}
                        
                        <div className="applyForm-title">Musician Athorization
                            {/* <Button>Back</Button> */}
                        </div>
                       
                        
                        
                        <Form.Item name="musicianName" label="Artist Name" rules={[{ required: true, message: 'please enter artist name' }]}>
                            <Input placeholder="please enter artist name" />
                        </Form.Item>
                        <Form.Item name="profilePictureURL" label="Artist Avatar"  rules={[{ required: true, message: 'please upload avatar' }]}>
                            {/* <Upload accept=".jpeg, .jpg, .png"
                                fileList={fileList}
                                onChange={({ fileList: newFileList }) => {
                                    setFileList(newFileList);
                                }}
                            > */}
                          {/* <Upload
                            accept=".jpeg, .jpg, .png"
                            customRequest={customRequest}
                            fileList={file ? [file] : []}
                            >
                                                                
                                <Button>Upload</Button>
                            </Upload> */}
                            <input type="file" onChange={handleFileChange}></input> 

                        </Form.Item>
                        <Form.Item name="gender" label="Gender"  rules={[{ required: true, message: 'please choose gender' }]}>
                            <Select>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="otherGender">Other</Option>
                                {/* 这里可以添加更多的选项 */}
                            </Select>
                        </Form.Item>
                
                        <Form.Item name="birth" label="Birth" rules={[{ required: true, message: 'please choose birth' }]}>
                            <DatePicker />
                        </Form.Item>
                        <Form.Item name="region" label="Region" rules={[{ required: true, message: 'please choose region' }]}>
                            <Select>
                                <Option value="Asia">Asia</Option>
                                {/* 这里可以添加更多的选项 */}
                            </Select>
                        </Form.Item>
                        <Form.Item name="genre" label="Style"  rules={[{ required: true, message: 'plesae choose style' }]}>
                            <Select>
                                <Option value="pop">Pop</Option>
                                <Option value="classical">classical</Option>
                                <Option value="other">other</Option>
                                {/* 这里可以添加更多的选项 */}
                            </Select>
                        </Form.Item>
                        <Form.Item name="Bio" label="Introduction"  rules={[{ required: true, message: 'plesae provide introduction' }]}>
                            <Input.TextArea placeholder="self intro"/>
                        </Form.Item>

                        {/* 实名认证 */}
                        <Form.Item 
                            name="realName" 
                            label="Real Name" 
                            rules={[
                                { required: true, message: 'please enter real name' },
                                { pattern: /^[a-zA-Z\s]+$/, message: 'Real name should not contain numbers or special characters'}
                            ]}
                        >
                            <Input type="text" placeholder="real name"/>
                        </Form.Item>
                        {/* <Form.Item name="phoneNumber" label="Phone Number"  rules={[{ required: true, message: 'please enter phone number'}]}>
                            <Input type="tel" placeholder="tel number" />
                        </Form.Item> */}
                        <Form.Item 
                            name="phoneNumber" 
                            label="Phone Number"  
                            rules={[
                                { required: true, message: 'please enter phone number'},
                                { pattern: /^[0-9]+$/, message: 'Phone number should be numbers only'}
                            ]}
                        >
                            <Input type="tel" placeholder="tel number" />
                        </Form.Item>
                        <Form.Item 
                            name="email" 
                            label="Email"  
                            rules={[
                                { required: true, message: 'please enter email'},
                                { type: 'email', message: 'Email is not valid'}
                            ]}
                        >
                            <Input type="email" placeholder="email address"/>
                        </Form.Item>
                        <Form.Item name="nationality" label="Nationality"  rules={[{ required: true, message: 'please choose nationality' }]}>
                            <Select>
                                <Option value="china">China</Option>
                                <Option value="other">other</Option>
                                {/* 这里可以添加更多的选项 */}
                            </Select>
                        </Form.Item>

                        {/* 站外信息 */}
                        <Form.Item name="outsidePlatform" label="Outside Platform"  rules={[{ required: true, message: 'please choose a platform' }]}>
                            <Select>
                                <Option value="facebook">Facebook</Option>
                                <Option value="none">Facebook</Option>
                                {/* 这里可以添加更多的选项 */}
                            </Select>
                        </Form.Item>
                        <Form.Item name="nickname" label="Nickname"  rules={[{ required: true, message: 'please enter nickname' }]}>
                            <Input placeholder="id or nickname"/>
                        </Form.Item>
                        <Form.Item name="platformFollowers" label="platform followers"  rules={[{ required: true, message: 'please enter amount of followers' }]}>
                            <Input placeholder="amount of followers" type="number"/></Form.Item>

                        {/* 同意条款 */}
                        <Form.Item
                        
                            valuePropName="checked"
                            name="agreement"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject('please read and agree our agreement'),
                                },
                            ]}
                        >
                            <Checkbox onChange={handleCheckboxClick}>I had read and agree《Harmony Agreement》</Checkbox>
                        </Form.Item>

                        <Modal
                            title="Harmony Agreement"
                            open={isVisible}
                            onCancel={handleCloseModal}
                            footer={null}  // Hide default buttons
                        >
                            <div >
                                <textarea className="agreement-modal-content" readOnly defaultValue={localStorage.getItem('agreement') || ''} />
                            </div>
                            <button onClick={handleCloseModal}>Close</button>
                        </Modal>


                        <Form.Item  name="submit"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flex: 1 , marginLeft:'250px'}}>
                            <Button className='applyForm-button' type="primary" htmlType="submit" >Submit</Button>
                        </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default observer(ApplyArtistForm);