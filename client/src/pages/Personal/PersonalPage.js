import classNames from 'classnames/bind'; //Allows to write class names with '-' => Ex: post-item
import styles from './PersonalPage.module.scss';
import decode from 'jwt-decode';
import images from '../../assets/images';

import { googleLogout } from '@react-oauth/google';

//React library
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

//MUI library
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';

const cx = classNames.bind(styles);

export default function PersonalPage() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profileUser')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = user?.token;
        //JWT... when jwt expiry
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                handleLogOut();
            }
        }
        setUser(JSON.parse(localStorage.getItem('profileUser')));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleLogOut = () => {
        dispatch({ type: 'LOGOUT_USER' });
        navigate('/');
        googleLogout();
        setUser(null);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid', 'wide')}>
                <div className={cx('row')}>
                    <div className={cx('col', 'l-12', 'm-12', 'c-12')}>
                        <div className={cx('cover')}>
                            {user && (
                                <div className={cx('user')}>
                                    <Avatar
                                        className={cx('avatar')}
                                        src={user.result.picture}
                                        alt={user.result.name}
                                        sx={{ bgcolor: green[600] }}
                                    >
                                        {user.result.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div className={cx('fullName')}>{user?.result.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cx('row', 'info-wrap')}>
                        <div className={cx('col', 'l-5', 'm-12', 'c-12')}>
                            {user && (
                                <div className={cx('info')}>
                                    <p className={cx('content')}>
                                        <strong className={cx('title')}>Email:</strong>
                                        {user.result.email}
                                    </p>
                                    <p className={cx('content')}>
                                        <strong className={cx('title')}>S??? ??i???n tho???i:</strong>
                                        {user.result.phone}
                                    </p>
                                    <p className={cx('content')}>
                                        <strong className={cx('title')}>Chi???u cao:</strong>
                                        {user.result.height}cm
                                    </p>
                                    <p className={cx('content')}>
                                        <strong className={cx('title')}>C??n n???ng:</strong>
                                        {user.result.weight}kg
                                    </p>
                                    <p className={cx('content')}>
                                        <strong className={cx('title')}>Ch??? s??? BMI:</strong>
                                        {(
                                            user.result.weight /
                                            ((user.result.height / 100) * (user.result.height / 100))
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            <div className={cx('bottom')}>
                                <Link to={`/personal/${user.result.name}/update`} className={cx('action-btn')}>
                                    <span className={cx('text-btn')}>C???p nh???t th??ng tin</span>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('col', 'l-7', 'm-12', 'c-12')}>
                            <div className={cx('bmi-img')}>
                                <img className={cx('img')} src={images.whatBmi} alt="Ch??? s??? BMI l?? g???" />
                                <img className={cx('img')} src={images.bmi} alt="H?????ng d???n ?????c ch??? s??? BMI" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
