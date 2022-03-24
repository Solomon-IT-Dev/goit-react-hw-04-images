import { useState, useEffect, useRef } from 'react';
import usePrevious from 'hooks/usePrevious';
import { toast } from 'react-toastify';
import findImages from 'services/imageFinderApi';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import FrontNotification from 'components/FrontNotification';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loader from 'components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { AppWrapper } from './App.styled';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imagesSet, setImagesSet] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);

  const prevSearchQuery = usePrevious(searchQuery);
  const galleryElem = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    findImages(searchQuery, page)
      .then(({ hits, totalHits }) => {
        if (totalHits === 0) {
          rejectedStatusHandler();
          showIncorrectQuery(searchQuery);
          return;
        }

        if (page === 1) {
          setImagesSet(hits);
          setTotalImages(totalHits);
          setStatus(Status.RESOLVED);
          showSearchResult(totalHits);
        } else {
          setImagesSet(prevImagesSet => [...prevImagesSet, ...hits]);
          setStatus(Status.RESOLVED);
          makeSmoothScroll();
        }
      })
      .catch(error => {
        console.log(error);
        rejectedStatusHandler();
        return showQueryError(error);
      });
  }, [searchQuery, page]);

  const rejectedStatusHandler = () => {
    setStatus(Status.REJECTED);
    setTimeout(() => {
      setStatus(Status.IDLE);
    }, 2500);
  };

  const showSearchResult = totalImages => {
    toast.success(`Hooray! We found ${totalImages} images.`);
  };

  const showIncorrectQuery = searchQuery => {
    toast.error(
      `Sorry, there are no images matching your query: "${searchQuery}". Please try to search something else.`
    );
  };

  const showQueryError = error => {
    toast.error(`You caught the following error: ${error.message}.`);
  };

  const galleryReset = () => {
    setImagesSet([]);
    setPage(1);
  };

  const onFormSubmit = searchQuery => {
    if (prevSearchQuery === searchQuery) {
      return;
    }

    setSearchQuery(searchQuery);
    galleryReset();
    setStatus(Status.PENDING);
  };

  const onLoadBtnClick = () => {
    if (totalImages > imagesSet.length) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const makeSmoothScroll = () => {
    const cardHeight = galleryElem.current.firstElementChild.clientHeight;
    window.scrollBy({ top: cardHeight * 1.97, behavior: 'smooth' });
  };

  const toggleModal = largeImageURL => {
    setShowModal(showModal => !showModal);
    setLargeImageURL(largeImageURL);
  };

  return (
    <AppWrapper>
      <Searchbar onSubmit={onFormSubmit} />

      {status === Status.IDLE && (
        <FrontNotification text="Type your image request in searchbar and get an awesome collection of pictures." />
      )}

      {status === Status.PENDING && <Loader />}

      {status === Status.RESOLVED && (
        <>
          <ImageGallery
            imagesSet={imagesSet}
            onClick={toggleModal}
            scrollRef={galleryElem}
          />

          {totalImages > imagesSet.length && (
            <Button onClick={onLoadBtnClick} />
          )}

          {showModal && (
            <Modal
              largeImageURL={largeImageURL}
              alt={searchQuery}
              onClose={toggleModal}
            />
          )}
        </>
      )}

      {status === Status.REJECTED && (
        <FrontNotification text="Oops! Something went wrong." />
      )}

      <ToastContainer autoClose={4000} />
    </AppWrapper>
  );
}
