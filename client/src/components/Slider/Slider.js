import classNames from 'classnames/bind'; //Allows to write class names with '-' => Ex: post-item
import styles from './Slider.module.scss';

//Component
import images from '../../assets/images';

const cx = classNames.bind(styles);

export default function Slider() {
    return <div className={cx('wrapper')}>Slider</div>;
}
