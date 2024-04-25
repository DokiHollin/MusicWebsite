import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, Spin, message } from 'antd';
import UserContext from 'src/store/UserContext';
import { getAlumsByUserID } from 'src/api/album';


const MusicUpload: React.FC = () => {
  // const userContext = useContext<any>(UserContext);

  const [musicName, setMusicName] = useState<string | null>(null);
  const [album, setAlbum] = useState<number | null>(null);
  const [s3Info, setS3Info] = useState<File | null>(null);
  const [s3Lrc, setS3Lrc] = useState<File | null>(null);
  const [s3Music, setS3Music] = useState<File | null>(null);
  const [s3Image, setS3Image] = useState<File | null>(null);
  const [userAlbums, setUserAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       if(UserContext.userID){
//         const albums = await getAlumsByUserID(Number(UserContext.userID));
//         setUserAlbums(albums);
//       }


//     };

//     fetchData();
//   }, []);
useEffect(() => {
    const fetchData = async () => {
      const userId = UserContext?.userID;
      if(userId){
        const albums = await getAlumsByUserID(Number(userId));
        setUserAlbums(albums ?? []);
      }
    };

    fetchData();
  }, []);


  // const handleUpload = async () => {

  //       const formData = new FormData();
  //       formData.append('music_name', musicName!.toString());
  //       formData.append('Album', album!.toString());
  //       formData.append('S3Info', s3Info!);
  //       formData.append('S3Lrc', s3Lrc!);
  //       formData.append('S3Music', s3Music!);
  //       formData.append('S3Image', s3Image!);
  //       formData.append('duration', '3:21');
  //       // if(UserContext.userID){
  //       //   formData.append('musician', UserContext.userID);
  //       // }

  //       console.log(formData)
  //       try {
  //           const response = await axios.post('http://3.26.210.47/api/music/create/', formData, {
  //               headers: {
  //                   'Authorization': 'token ' + UserContext.token
  //               }
  //           });
  //         console.log('Upload successful:', response.data);
  //         message.success('Music Submit Successful, Waiting For Review')
  //       } catch (error) {
  //         console.error('Upload failed:', error);
  //       }
  //   };
  // 新建一个函数来获取音频文件的时长
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = function() {
          resolve(audio.duration);
      };
      audio.onerror = function() {
          reject(new Error("Failed to load audio"));
      };
  });
};

const handleUpload = async () => {
  try {
      if(!musicName || !album || !s3Info || !s3Lrc || !s3Music || !s3Image) {
        message.error('You need to filling all the field')
        return;  // Return early if any data is missing or undefined
      }
      setIsLoading(true);
      // 首先，获取音频文件的时长
      const durationInSeconds = await getAudioDuration(s3Music as File);
      const formattedDuration = secondsToMinSec(durationInSeconds);

      const formData = new FormData();
      formData.append('music_name', musicName!.toString());
      formData.append('Album', album!.toString());
      formData.append('S3Info', s3Info!);
      formData.append('S3Lrc', s3Lrc!);
      formData.append('S3Music', s3Music!);
      formData.append('S3Image', s3Image!);
      formData.append('duration', formattedDuration);
      // ...其他逻辑...

      console.log(formData);
      const response = await axios.post('http://3.26.210.47/api/music/create/', formData, {
          headers: {
              'Authorization': 'token ' + UserContext.token
          }
      });
      console.log('Upload successful:', response.data);
      message.success('Music Submit Successful, Waiting For Review');
  } catch (error) {
      console.error('Upload failed:', error);
  }finally {
    // setMusicName(null);
    // setAlbum(null);
    // setS3Info(null);
    // setS3Lrc(null);
    // setS3Music(null);
    // setS3Image(null);
    setIsLoading(false); // 结束加载
    setIsSubmitting(false); 
  }
};

// 之前提供的转换函数
function secondsToMinSec(seconds: number) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  let secStr = sec < 10 ? '0' + sec : sec;
  return `${min}:${secStr}`;
}

  return (

    <Form
        onFinish={handleUpload}
        layout="vertical"
        className='upload-glass'
    >
        <Spin spinning={isLoading}></Spin>
        <Form.Item
            label="Select Album"
            name="album"
            rules={[{ required: true, message: 'Please select an album!' }]}
            className='form-title'
        >
            <Select
                placeholder="Select Album"
                onChange={(value: number) => setAlbum(value)}
                className='form-input'
            >
                {userAlbums.map(album => (
                    <Select.Option key={album.album_id} value={album.album_id}>
                        {album.album_name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>

        <Form.Item
            label="Music Name"
            name="musicName"
            rules={[{ required: true, message: 'Please input the music name!' }]}
            className='form-title'
        >
            <Input value={musicName || ''} onChange={e => setMusicName(e.target.value)} className='form-input'/>
        </Form.Item>

        {/* <Form.Item
            label="Album"
            name="album_input"
            rules={[{ required: true, message: 'Please input the album number!' }]}
            className='form-title'
        >
            <Input type="number" value={album || ''} onChange={e => setAlbum(Number(e.target.value))} className='form-input'/>
        </Form.Item> */}

        <Form.Item
            label="Info"
            name="info"
            className='form-title'
        >
            <input type="file" accept=".txt" onChange={e => setS3Info(e.target.files![0])} className='form-input'/>
        </Form.Item>

        <Form.Item
            label="Lyric"
            name="lyric"
            className='form-title'
        >
            <input type="file" accept=".lrc" onChange={e => setS3Lrc(e.target.files![0])} className='form-input'/>
        </Form.Item>

        <Form.Item
            label="Music"
            name="music"
            className='form-title'
        >
            <input type="file" accept=".mp4,.mp3,.wav" onChange={e => setS3Music(e.target.files![0])} className='form-input'/>
        </Form.Item>

        <Form.Item
            label="Image"
            name="image"
            className='form-title'
        >
            <input type="file" accept="image/*" onChange={e => setS3Image(e.target.files![0])} className='form-input'/>
        </Form.Item>

        <Form.Item className='form-submit'>
            {/* <Button type="primary" htmlType="submit" className='form-submit-btn'>
                Upload
            </Button> */}
            <Button type="primary" htmlType="submit" className='form-submit-btn' disabled={isSubmitting}>
                Submit
            </Button>

        </Form.Item>
    </Form>
);

};

export default MusicUpload;


