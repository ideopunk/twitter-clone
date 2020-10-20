import React from 'react';

const Menu = () => {
    return (
        <ul className="menu">
            <li className="menu-item"><span className="menu-icon"></span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">Home</span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">Explore</span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">Notifications</span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">Messages</span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">Profile</span></li>
            <li className="menu-item"><span className="menu-icon"></span><span className="menu-item-name">More</span></li>
            <li className="menu-item"><button>Tweet</button></li>
            <li className="menu-item"><button className="menu-profile-button"></button></li>
        </ul>
    )
}

export default Menu;