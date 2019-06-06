import React from 'react';
import './App.css';
import { recipes } from './tempList';
import RecipeList from './components/RecipeList';
import RecipeDetails from './components/RecipeDetails';


class App extends React.Component {

    state = {
        recipes: recipes,
        url: "https://www.food2fork.com/api/search?key=b6fb5d86fb9419eeec1129a9e77a1ada",
        base_url: "https://www.food2fork.com/api/search?key=b6fb5d86fb9419eeec1129a9e77a1ada",
        details_id: 35389,
        pageIndex: 1,
        search: '',
        query: '&q=',
        error: ''
    };

    // Ajax
    async getRecipes() {
        try {
            const data = await fetch(this.state.url)
            const jsonData = await data.json() // convert the data to json format
            if (jsonData.recipes.length === 0) {
                // if nothing was found
                this.setState(() => {
                    return {error: 'Sorry, but your search did not return any results'}
                })
            } else {
                this.setState(() => {
                    return {recipes: jsonData.recipes}
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    componentDidMount() { //execute once app has mounted
        this.getRecipes()
    }

    displayPage = (index) => {
        switch (index) {
            case 0:
                return (<RecipeDetails id={this.state.details_id} handleIndex={this.handleIndex} />)
            default:
            case 1:
                return (
                    <RecipeList
                        recipes={this.state.recipes}
                        value={this.state.search}
                        handleChange={this.handleChange}
                        handleSubmit={this.handleSubmit}
                        handleDetails={this.handleDetails}
                        error={this.state.error}
                    />
                );
        }
    }

    handleIndex = (index) => {
        this.setState({
            pageIndex: index
        });
    }

    handleDetails = (index, id) => {
        this.setState({
            pageIndex: index,
            details_id: id
        })
    }

    handleChange = (e) => {
        this.setState({
            search: e.target.value
        }, () => {
            console.log(this.state.search);
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {base_url, query, search} = this.state;
        this.setState(() => {
            return {url: `${base_url}${query}${search}`, search:""}
        }, () => {
            this.getRecipes();
        })
    }

    render () {
        return (
            <React.Fragment>
                {this.displayPage(this.state.pageIndex)}
            </React.Fragment>
        );
    }
}

export default App;
