import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Tab({ active, title, icon, onClose, onClick }) {
    const activeClass = active ? 'active' : '';
    let tabIcon = '';
    if (icon) {
        tabIcon = <FontAwesomeIcon icon={icon} className="icon" />;
    }
    let closeIcon = '';
    if (onClose) {
        closeIcon = (
            <span className="close" onClick={handleClose} title="Close this note">
                <FontAwesomeIcon icon="xmark" />
            </span>
        );
    }

    return (
        <div className={`tab ${activeClass}`} onClick={onClick} title={title}>
            <span className="title">
                {tabIcon}
                {title || 'New Note'}
            </span>
            {closeIcon}
        </div>
    );

    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }
}