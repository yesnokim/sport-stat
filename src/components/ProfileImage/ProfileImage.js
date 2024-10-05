import React from 'react';
import ss from "./ProfileImage.module.scss"

const ProfileImage = () => {
    return (
        <div className={ss.bg}>
            <img
                src="https://www.daegufc.co.kr/skin/skin22/img/u12/16kia.jpg" // 프로필 이미지 경로
                alt="Profile"
                className={ss.profile_img} // CSS 클래스 이름
            />
        </div>
    );
};

export default ProfileImage;