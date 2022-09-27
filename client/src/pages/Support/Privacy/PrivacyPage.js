import classNames from 'classnames/bind'; //Allows to write class names with '-' => Ex: post-item
import styles from './PrivacyPage.module.scss';

const cx = classNames.bind(styles);

export default function PrivacyPage() {
    return (
        <div>
            <div className={cx('wrapper')}>
                <div className={cx('grid', 'wide')}>
                    <div className={cx('row')}>PrivacyPage</div>
                </div>
            </div>
        </div>
    );
}
