import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Popconfirm } from 'antd';

import { connect } from 'react-redux';
// import { changeBG } from '@/redux/modules/layouts/bg/action';
import { BACKGROUND } from 'src/constant/LocalStorage';
import ChangeBG from './action/reducer'

import { useBG } from 'src/screen/layout/bg/BGContext';
import ImageBase64ToBlobServer from 'src/utils/ImageBase64ToBlobServer';
const BlackUpload = (props: any) => {
  const { bgPath, setBgPath } = useBG();
  function dispatch(arg0: { type: string; data: any; }) {
    throw new Error('Function not implemented.');
  }
  
  return (
    <Upload
      className="black_upload"
      accept="image/*"
      beforeUpload={(file) => {
        const reader = new FileReader();
        let couldUpload = true;
        reader.onloadend = function () {
          if (couldUpload && reader.result) {
            localStorage.setItem(BACKGROUND, reader.result + '');
            
            const newBgUrl = ImageBase64ToBlobServer(reader.result + '');
            console.log(newBgUrl)
            console.log(reader.result)
            // 更新背景路径
            if (newBgUrl) {
              setBgPath(newBgUrl);
            }
          }
        };
        if (file) {
          reader.readAsDataURL(file);
          if (file.size / 1024 / 1024 > 1.5) {
            message.warning('图片超过 1.5MB ，请重新选择');
            couldUpload = false;
            return Upload.LIST_IGNORE;
          }
        }

        return Upload.LIST_IGNORE;
      }}
      capture={false}
    >
      <Button icon={<UploadOutlined />} className="yellow_button">
        Upload Image
      </Button>
    </Upload>
  );
};

export default BlackUpload
