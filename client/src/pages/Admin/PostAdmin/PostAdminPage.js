import classNames from 'classnames/bind'; //Allows to write class names with '-' => Ex: post-item
import styles from './PostAdminPage.module.scss';
import moment from 'moment';

import Grow from '@mui/material/Grow';
import Tippy from '@tippyjs/react/headless'; // different import path!
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

//react library
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';

//react-bootstrap library
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Actions
import { getPostsNoPaginate, createPost, updatePost, deletePost } from '../../../redux/actions/postActions';

//components
import Search from '../../../components/Search/Search';
// import Paginate from '../../../components/Paginate/Paginate';

const cx = classNames.bind(styles);

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function PostAdminPage() {
    const [hide, setHide] = useState(true);
    const [pushTable, setPutTable] = useState(true);
    const [validated, setValidated] = useState(false);
    const [currentID, setCurrentID] = useState(0);
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const query = useQuery();

    //paginate
    // const page = query.get('page') || 1;

    //DB
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        videoID: '',
        type: '',
    });

    const admin = JSON.parse(localStorage.getItem('profileAdmin'));

    const { posts } = useSelector((state) => state.posts);
    const post = useSelector((state) => (currentID ? state.posts.posts.find((p) => p._id === currentID) : 0));

    useEffect(() => {
        if (post) {
            setPostData(post);
        }
    }, [post]);

    useEffect(() => {
        dispatch(getPostsNoPaginate());
    }, [dispatch]);

    const handleOpenForm = () => {
        if (!hide && !pushTable) {
            setHide(hide);
            setPutTable(pushTable);
        } else {
            setHide(!hide);
            setPutTable(!pushTable);
        }
        clearInput();
    };

    const handleCloseForm = () => {
        setHide(!hide);
        setPutTable(!pushTable);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setValidated(true);

        if (currentID === 0) {
            dispatch(createPost({ ...postData, name: admin?.result?.name })); //navigate after createPost
        } else {
            dispatch(updatePost(currentID, { ...postData, name: admin?.result?.name }));
        }
        clearInput();
    };

    const clearInput = () => {
        setCurrentID(0);
        setPostData({
            title: '',
            description: '',
            videoID: '',
            type: '',
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left', { pushTable: pushTable })}>
                <div className={cx('top-action')}>
                    <Button variant="primary" className={cx('addPost-btn')} onClick={handleOpenForm}>
                        Th??m b??i vi???t
                    </Button>
                    <Search navigatePath="/admin/posts" />
                </div>
                <Grow in>
                    <div className={cx('table-container')}>
                        <Table bordered hover className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ti??u ?????</th>
                                    <th>M?? t???</th>
                                    <th>Video ID</th>
                                    <th>Lo???i</th>
                                    <th>Ng??y t???o</th>
                                    <th>Ng?????i t???o</th>
                                    <th colSpan={2}>Thao t??c</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts?.map((post) => (
                                    <tr key={post._id}>
                                        <td>{post._id}</td>
                                        <td>{post.title}</td>
                                        <td>{post.description}</td>
                                        <td>{post.videoID}</td>
                                        <td>{post.type}</td>
                                        <td>{moment(post.createdAt).format('HH:mm - DD/MM/YYYY')}</td>
                                        <td>{post.name}</td>
                                        <td className={cx('table-btn-wrapper')}>
                                            {(admin?.result?.sub === post?.creator ||
                                                admin?.result?._id === post?.creator) && (
                                                <>
                                                    <Button
                                                        variant="info"
                                                        className={cx('table-btn')}
                                                        onClick={() => {
                                                            if (!hide && !pushTable) {
                                                                setHide(hide);
                                                                setPutTable(pushTable);
                                                            } else {
                                                                setHide(!hide);
                                                                setPutTable(!pushTable);
                                                            }
                                                            setCurrentID(post._id);
                                                        }}
                                                    >
                                                        S???a
                                                    </Button>
                                                    <Tippy
                                                        interactive
                                                        trigger="click"
                                                        hideOnClick
                                                        placement="left-start"
                                                        render={(attrs) => (
                                                            <div
                                                                className={cx('deleteWarning-wrap')}
                                                                tabIndex="-1"
                                                                {...attrs}
                                                            >
                                                                <div className={cx('deleteWarning')}>
                                                                    <FontAwesomeIcon
                                                                        className={cx('deleteWarning-icon')}
                                                                        icon={faTriangleExclamation}
                                                                    />

                                                                    <h2>B???n c?? ch???c ch???n mu???n x??a</h2>
                                                                    <p>
                                                                        B??i vi???t <strong>{post.title}</strong> kh???i h???
                                                                        th???ng?
                                                                    </p>
                                                                    <Button
                                                                        variant="danger"
                                                                        className={cx('table-btn')}
                                                                        onClick={() => dispatch(deletePost(post._id))}
                                                                    >
                                                                        X??a
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    >
                                                        <Button variant="danger" className={cx('table-btn')}>
                                                            X??a
                                                        </Button>
                                                    </Tippy>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {/* <div className={cx('paginate')}>
                            <Paginate page={page} pathPage="/admin/posts" className={cx('pagination')} />
                        </div> */}
                    </div>
                </Grow>
            </div>
            <div className={cx('right')}>
                <Form className={cx('form', { hide: hide })} noValidate validated={validated} onSubmit={handleSubmit}>
                    <h1 className={cx('heading')}>{currentID ? 'S???a' : 'Th??m'} b??i vi???t h???u ??ch</h1>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Ti??u ?????:</Form.Label>
                        <Form.Control
                            className={cx('input-form')}
                            required
                            type="text"
                            placeholder="Enter title of the post..."
                            value={postData.title}
                            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                        />
                        <Form.Control.Feedback type="invalid">Vui l??ng nh???p ti??u ????? b??i vi???t</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDesc">
                        <Form.Label>M?? t???:</Form.Label>
                        <Form.Control
                            className={cx('input-form')}
                            required
                            type="text"
                            placeholder="Enter description of the post..."
                            as="textarea"
                            rows={3}
                            value={postData.description}
                            onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                        />
                        <Form.Control.Feedback type="invalid">Vui l??ng nh???p m?? t??? b??i vi???t</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formVideoId">
                        <Form.Label>Video ID (Youtube):</Form.Label>
                        <Form.Control
                            className={cx('input-form')}
                            required
                            type="text"
                            placeholder="Enter video ID of the post..."
                            value={postData.videoID}
                            onChange={(e) => setPostData({ ...postData, videoID: e.target.value })}
                        />
                        <Form.Control.Feedback type="invalid">Vui l??ng nh???p video id b??i vi???t</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formType">
                        <Form.Label>Lo???i:</Form.Label>
                        <Form.Select
                            as="select"
                            className={cx('input-form')}
                            value={postData.type}
                            onChange={(e) => setPostData({ ...postData, type: e.target.value })}
                        >
                            <option value="">---</option>
                            <option value="knowledge">Ki???n th???c</option>
                            <option value="nutrition">Dinh d?????ng</option>
                            <option value="exercise">B??i t???p</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className={cx('btn-form')}>
                        <Button variant="success" type="submit" className={cx('submit-btn')}>
                            {currentID ? 'S???a' : 'Th??m'}
                        </Button>
                        <Button variant="danger" className={cx('close-btn')} onClick={handleCloseForm}>
                            {currentID ? 'H???y' : '????ng'}
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}
