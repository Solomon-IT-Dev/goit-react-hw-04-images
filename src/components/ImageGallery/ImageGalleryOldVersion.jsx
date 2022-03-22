import React, { Component } from "react";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import findImages from "services/imageFinderApi";
import ImageGalleryItem from 'components/ImageGalleryItem';
import FrontNotification from "components/FrontNotification";
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loader from 'components/Loader';
import { GalleryList } from './ImageGallery.styled';

const Status = {
    IDLE: 'idle',
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

class ImageGallery extends Component {
    state = {
        imagesSet: [],
        page: 1,
        totalImages: 0,
        largeImageURL: '',
        showModal: false,
        status: Status.IDLE,
    };

    componentDidUpdate(prevProps, prevState) {
        const prevQuery = prevProps.searchQuery;
        const nextQuery = this.props.searchQuery;
        const prevPage = prevState.page;
        const nextPage = this.state.page;

        if (prevQuery !== nextQuery) {
            this.setState({ imagesSet: [], page: 1, status: Status.PENDING });
        };

        if (prevQuery !== nextQuery || prevPage !== nextPage) {
            findImages(nextQuery, nextPage)
                .then(({ hits, totalHits }) => {
                    if (nextPage === 1) {
                        this.setState({ imagesSet: hits, totalImages: totalHits });

                        if (totalHits === 0) {
                            this.setState({ status: Status.REJECTED });
                            setTimeout(() => {
                                this.setState({ status: Status.IDLE });
                            }, 3000);
                            return this.showIncorrectQuery(nextQuery);
                        };

                        if (totalHits !== 0) {
                            this.setState({ status: Status.RESOLVED });
                            return this.showSearchResult(totalHits);
                        };
                    } else {
                        this.setState(prevState => ({ imagesSet: [...prevState.imagesSet, ...hits], status: Status.RESOLVED }));

                        this.makeSmoothScroll();
                    };
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ status: Status.REJECTED });
                    setTimeout(() => {
                        this.setState({ status: Status.IDLE });
                    }, 3000);
                    return this.showQueryError(error);
                })
        };
    };

    showSearchResult = (totalImages) => {
        toast.success(`Hooray! We found ${totalImages} images.`);
    };

    showIncorrectQuery = (searchQuery) => {
        toast.error(`Sorry, there are no images matching your query: "${searchQuery}". Please try to search something else.`);
    };

    showQueryError = (error) => {
        toast.error(`You caught the following error: ${error.message}.`);
    };

    toggleModal = (largeImageURL) => {
        this.setState(({ showModal }) => ({
            showModal: !showModal,
            largeImageURL,
        }));
    };

    onLoadBtnClick = () => {
        const { totalImages, imagesSet } = this.state;

        if (totalImages > imagesSet.length) {
            this.setState(prevState => ({ page: prevState.page + 1 }));
        };
    };

    makeSmoothScroll = () => {
        const cardHeight = this.galleryElem.firstElementChild.clientHeight;
        window.scrollBy({ top: cardHeight * 1.97, behavior: 'smooth' });
    };

    render() {
        const { imagesSet, totalImages, largeImageURL, showModal, status } = this.state;

        if (status === Status.IDLE) {
            return <FrontNotification text="Type your image request in searchbar and get an awesome collection of pictures." />
        };
         
        if (status === Status.PENDING) {
            return <Loader />
        };

        if (status === Status.RESOLVED) {
            return (
                <>
                    <GalleryList ref={(galleryList) => {this.galleryElem = galleryList}}>
                        {imagesSet.map(({ id, webformatURL, largeImageURL, tags }) => (
                            <ImageGalleryItem
                                key={id}
                                webformatURL={webformatURL}
                                largeImageURL={largeImageURL}
                                alt={tags}
                                onClick={this.toggleModal}
                            />
                        ))}
                    </GalleryList>
                    
                    {showModal && <Modal
                        largeImageURL={largeImageURL}
                        alt={this.props.searchQuery}
                        onClose={this.toggleModal}
                    />}

                    {(totalImages > imagesSet.length) && <Button onClick={this.onLoadBtnClick} />}
                </>
            );
        };
   
        if (status === Status.REJECTED) {
            return <FrontNotification text="Oops! Something went wrong."/>
        }
    };
 
};

ImageGallery.propTypes = {
    searchQuery: PropTypes.string.isRequired,
};

export default ImageGallery;