import PropTypes from 'prop-types';
import { NotificationText } from './FrontNotification.styled';

export default function FrontNotification({ text }) {
    return (
        <NotificationText>{text}</NotificationText>
    );
};

FrontNotification.propTypes = {
    text: PropTypes.string.isRequired,
};