import './TabNav.scss';
import Tab from './Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../images/logo.png';

export default function TabNav({ notes, activeTab, onTabClose, onTabCreate, onTabChange }) {    
    const openTabs = notes.map((note) => {
        return (
            <Tab
                key={note.id}
                title={note.title}
                active={note.id === activeTab}
                onClick={() => onTabChange(note.id)}
                onClose={() => onTabClose(note.id)}
            />
        );
    });

    return (
        <div className="tab-nav">
            <div className="app-name">
                <img className="icon" src={logo} alt="Web Note Logo"/>
                <div><div>Web</div><div>Note</div></div>
            </div>
            <Tab
                icon="folder-open"
                title="MY NOTES"
                active={!activeTab}
                onClick={() => onTabChange('')}
            />
            {openTabs}
            <div className="new-tab" onClick={onTabCreate} title="New Note">
                <FontAwesomeIcon icon="plus"/>
            </div>
        </div>
    );
}