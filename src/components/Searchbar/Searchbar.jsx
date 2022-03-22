import React, { Component } from "react";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { MdSearch } from 'react-icons/md';
import { SearchbarContainer, SearchForm, SearchFormBtn, SearchFormBtnLabel, SearchFormInput } from './Searchbar.styled';

class Searchbar extends Component {
    state = {
        searchQuery: '',
    };

    onInputChange = evt => {
        const normalizeInputValue = evt.currentTarget.value.toLowerCase();

        this.setState({ searchQuery: normalizeInputValue });
    };

    onSubmit = evt => {
        evt.preventDefault();

        if (this.state.searchQuery.trim() === '') {
            this.showSearchQueryAbsence();
            this.formReset();
            return;
        };

        this.props.onSubmit(this.state.searchQuery);
        this.formReset();
    };

    formReset = () => {
        this.setState({ searchQuery: '', })
    };

    showSearchQueryAbsence = () => {
        toast.warn("No, no, no! God, no! To search for pictures you need to specify what you are looking for.");
    };

    render() {
        const { searchQuery } = this.state;
        
        return (
            <SearchbarContainer onSubmit={this.onSubmit} >
                <SearchForm>
                    <SearchFormBtn type="submit" aria-label="Search images" >
                        <IconContext.Provider value={{ size: "2.5em" }} >
                            <MdSearch />
                        </IconContext.Provider>
                        <SearchFormBtnLabel>Search</SearchFormBtnLabel>
                    </SearchFormBtn>

                    <SearchFormInput
                        type="text"
                        name="search"
                        autocomplete="off"
                        autoFocus
                        placeholder="Search images and photos"
                        value={searchQuery}
                        onChange={this.onInputChange}
                    />
                </SearchForm>
            </SearchbarContainer>
        );
    };
};

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;