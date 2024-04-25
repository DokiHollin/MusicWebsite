import React, {useEffect, useState} from "react";
import * as api from "../api/apiService";

type post = {
    token: string | null;
}

function Post({token}: post) {

    const [currentDate, setCurrentDate] = useState(new Date().toLocaleString());
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [update, setUpdate] = useState<FormData | null>(null);


    async function postImage() {
        try {
            const data = await api.uploadPost(update, token);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let fileName = file.name;
            if (fileName.endsWith('.jpeg')) {
                fileName = fileName.slice(0, -5) + '.jpg';
            }
            const formData = new FormData();

            // 将文件添加到 FormData 实例
            formData.append('url', file!, fileName!);
            const entries = formData.entries();
            let entry = entries.next();
            while (!entry.done) {
                console.log(entry.value[0], entry.value[1]);
                entry = entries.next();
            }
            console.log(formData);
            setUpdate(formData);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '200px', height: '200px' }} />}
            <button onClick={postImage} className='admin-ob'>submit</button>
        </div>
    );
}

export default Post;
