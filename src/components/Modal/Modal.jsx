import React, { Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { MdClose } from 'react-icons/md';
import { Overlay, ModalContainer, CloseButton, LargeImg } from './Modal.styled';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown);
    };

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
    };

    onKeyDown = e => {
        if (e.code === 'Escape') {
            this.props.onClose();
        };
    };

    onBackdropClick = e => {
        if (e.currentTarget === e.target) {
            this.props.onClose();
        };
    };

    render() {
        const { largeImageURL, alt, onClose } = this.props;

        return createPortal(
            <Overlay onClick={this.onBackdropClick}>
                <ModalContainer>
                    <CloseButton type="button" onClick={onClose}>
                        <IconContext.Provider value={{ size: "2.5em" }} >
                            <MdClose />
                        </IconContext.Provider>
                    </CloseButton>
                    <LargeImg src={largeImageURL} alt={alt} />
                </ModalContainer>
            </Overlay>,
            modalRoot,
        );
    };
};

export default Modal;

Modal.propTypes = {
    largeImageURL: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};