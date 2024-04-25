import React, {ChangeEvent, useCallback, useState} from 'react';
import { Form, Input, Button, DatePicker, message, Spin } from 'antd';
import axios from 'axios';
import UserContext from 'src/store/UserContext';
import Modal from "react-modal";
import Cropper, {Area} from "react-easy-crop";
import getCroppedImg from "../../screen/uploadMusic/cropImage";
interface FormValues {
    // musician: string;
    album_name: string;
    release_date: { format: (arg0: string) => any; };
    genre: string;
    album_picture_url: string;
    bio: string;
    [key: string]: any;
  }

const CreateAlbumForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFile] = useState<any>([]);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [crop, setCrop] = useState({ x: 100, y: 100 });  // 初始裁剪区域的位置
    const [croppedImage, setCroppedImage] = useState<any>(null);
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleUpload = async () => {
        if (imageSrc && croppedAreaPixels) {
            await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            // Now you can upload `croppedImage` to your server
        }
    };


    const handleConfirmCrop = async () => {
        if (imageSrc && croppedAreaPixels) {
            const croppedImage  = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            setCroppedImage(croppedImage);
            console.log(croppedImage)
        }
        setIsModalOpen(false);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result?.toString() || null);
            };
            reader.readAsDataURL(file);
            setIsModalOpen(true);  // 添加这行代码以打开模态窗口
        }
    };

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setFile(file);  // 将文件本身存储在 fileList 状态变量中
            console.log(file);
        }
    }

    const onFinish = async (values: FormValues) => {
        setIsSubmitting(true);
        // 格式化日期为字符串
        values.release_date = values.release_date.format('YYYY-MM-DD');

        // 创建一个 FormData 对象
        const formData = new FormData();
        // 添加表单的其他值
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {

              formData.append(key, values[key]);


            }
        }


        // 添加文件
        formData.append('album_picture_url', fileList);  // 现在 fileList 是文件本身
        console.log(formData)
        try {
            setIsLoading(true);
            console.log(values);
            // 发送 POST 请求，同时设置请求头
            const response = await axios.post(`http://3.26.210.47/api/album/create/`, formData, {
                headers: {
                    'Authorization': 'token ' + UserContext.token
                }
            });
            message.success('Album created successfully');
        } catch (error) {
            message.error('Failed to create album');
            console.error(error);
        }finally {
 
            setIsLoading(false); // 结束加载
            setIsSubmitting(false); 
          }
    };


  return (
      <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className='upload-glass'
      >
            <Spin spinning={isLoading}></Spin>
          {/*<Form.Item*/}
          {/*    label='Album Image'*/}
          {/*    name='album image'*/}
          {/*    rules={[{required: true, message: 'Please upload the album image'}]}*/}
          {/*>*/}
          {/*    <input*/}
          {/*        id="fileInput"*/}
          {/*        type="file"*/}
          {/*        accept="image/*"*/}
          {/*        onChange={handleImageChange}*/}
          {/*        style={{ display: 'none' }}*/}
          {/*    />*/}
          {/*    <label htmlFor="fileInput" className="customFileInput">*/}
          {/*        Choose Image*/}
          {/*    </label>*/}
          {/*</Form.Item>*/}
          <Form.Item
              label="Album Name"
              name="album_name"
              rules={[{ required: true, message: 'Please input the album name!' }]}
              className='form-title'
          >
              <Input className='form-input'/>
          </Form.Item>
          <Form.Item
              label="Release Date"
              name="release_date"
              rules={[{ required: true, message: 'Please select the release date!' }]}
              className='form-title'
          >
              <DatePicker className='antd-picker-input'/>
          </Form.Item>
          <Form.Item
              label="Genre"
              name="genre"
              rules={[{ required: true, message: 'Please input the genre!' }]}
              className='form-title'
          >
              <Input className='form-input'/>
          </Form.Item>
          <Form.Item
              label="Album Picture URL"
              name="album_picture_url"
              className='form-title'
              rules={[{ required: true, message: 'Please Upload Image' }]}
          >
              {/* <input type="file" onChange={handleFileChange} className='form-input' id='image-input'></input> */}
              <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} className='form-input' id='image-input'></input>

          </Form.Item>
          <Form.Item
              label="Bio"
              name="bio"
              rules={[{ required: true, message: 'Please input the bio!' }]}
              className='form-title'
          >
              <Input className='form-input'/>
          </Form.Item>
          <Form.Item className='form-submit'>
              {/* <Button type="primary" htmlType="submit" className='form-submit-btn'>
                  Submit
              </Button> */}
              <Button type="primary" htmlType="submit" className='form-submit-btn' disabled={isSubmitting}>
                Submit
            </Button>

          </Form.Item>
      </Form>
      // <div className='upload-glass'>
      //     {imageSrc && (
      //         <div>
      //             <Modal isOpen={isModalOpen}>
      //                 <div className="crop-container">
      //                     <Cropper
      //                         image={imageSrc || ''}
      //                         crop={crop}
      //                         zoom={zoom}
      //                         aspect={1}
      //                         onCropChange={setCrop}
      //                         onZoomChange={setZoom}
      //                         onCropComplete={onCropComplete}
      //                     />
      //                     {/* 在 Cropper 外部创建一个覆盖层并放置按钮 */}
      //                     <div className="overlay">
      //                         <div className="buttons-container">
      //                             <button onClick={handleConfirmCrop}>confirm</button>
      //                             <button onClick={handleUpload}>upload</button>
      //                         </div>
      //                     </div>
      //                 </div>
      //             </Modal>
      //             {croppedImage && <img src={croppedImage} alt="裁剪结果" />}
      //         </div>
      //     )}
      // </div>
  );
};

export default CreateAlbumForm;
