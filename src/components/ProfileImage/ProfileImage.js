import React from 'react';
import ss from "./ProfileImage.module.scss";

const ProfileImage = () => {
    return (
        <div className={ss.bg}>
            <img
                src="/images/profile-images/iankim.png" // 프로필 이미지 경로
                alt="Profile"
                className={ss.profile_img} // CSS 클래스 이름
            />
        </div>
    );
};

export default ProfileImage;