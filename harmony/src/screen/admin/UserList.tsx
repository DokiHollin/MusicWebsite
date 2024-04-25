import {useState} from "react";
import "src/style/Admin.css";
import { Divider } from 'antd';
import React from "react";
import * as api from '../api/apiService';
import userContext from "../../store/UserContext";

type UserListProps = {
    users: User[];
};

type User = {
    'MusicianID': number;
    'MusicianName': string;
    'RealName': string;
    'PhoneNumber': number;
    'OutsidePlatform': string;
    'Nickname': string;
    'PlatformFollowers': number;
}

function UserList({ users }: UserListProps) {

    async function approve(musician: User) {
        const data = await api.approveMusician(musician.MusicianID, userContext.token);
    }

    return (
        <div>
            {users.map((user: User, index: number) => (
                <React.Fragment key={index}>
                    <div className="user-item">
                        <div>{user.MusicianName}</div>
                        <div>
                            <button onClick={() => { /* View Logic */ }}>View</button>
                            <button onClick={() => {approve(user)}}>Approve</button>
                        </div>
                    </div>
                    {index !== users.length - 1 && <Divider className="divider"/>}
                </React.Fragment>
            ))}
        </div>
    );
}

export default UserList;
