import PropTypes from 'prop-types';
import { GalleryItem, GalleryImg } from './ImageGalleryItem.styled';

export default function ImageGalleryItem({ webformatURL, largeImageURL, tags, onClick }) {
    return (
        <GalleryItem>
            <GalleryImg src={webformatURL} alt={tags} onClick={() => onClick(largeImageURL)} />
        </GalleryItem>
    );  
};

ImageGalleryItem.propTypes = {
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};