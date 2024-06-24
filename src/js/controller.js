import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/actual';
import 'core-js/stable';
// import {async} from 'regenerator-runtime'; //polyfill async

 

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//console.log('TEST'); 
//ffdeef4a-baa4-414a-a102-744b4c0677e7

//https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886?key=ffdeef4a-baa4-414a-a102-744b4c0677e7

if(module.hot){
  module.hot.accept();
}

const controlRecipes = async function(){
  try{

    //resultsView.renderSpinner();
    const id = window.location.hash.slice(1);
    //console.log(id);

    if(!id)return;
    recipeView.renderSpinner();

    //Update resultsView to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    //Loading recipe
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    
    //Render recipeView
    //console.log(model.state.recipe);
    //console.log('hello world');
    recipeView.render(model.state.recipe);
    //console.log('hello world');
  }catch(err){
    //console.log(err);
    recipeView.renderError();
  }
  

};

const controlSearchResults = async function(){
  try{
    //get search query
    //console.log(resultsView);
    //console.log('hello world');
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    console.log(query);
    if(!query)return;
    //console.log('hello world');
    //Load search results
    await model.loadSearchResults(query);
    //console.log('hello world');
    //console.log(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  }catch(err){
    //console.log(err);
    recipeView.renderError();
    //console.log('Caught');
  }
};

const controlPagination = function(page){
    resultsView.render(model.getSearchResultsPage(Number(page)));

    //Render initial pagination buttons
    paginationView.render(model.state.search);
}

//controlSearchResults();

const controlServings = function(newServings){
  //Update the recipe for the servings
  //Update the recipe view
  model.updateServings(newServings);
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //Add or remove bookmark
  if(!model.state.recipe.bookmarked)model.addBookmark(model.state.recipe);
  else if(model.state.recipe.bookmarked)model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);

  //update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);

}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){

  try{
    //Show spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    //Show recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();
    
    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //Change id in the url
    window.history.pushState(null,'',`#${model.state.recipe.id}`);
    //Close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    },MODAL_CLOSE_SEC * 1000);
    // setTimeout(function(){
    //   addRecipeView.restoreForm();
    // },5000);

  }catch(err){
    //console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  resultsView.renderSpinner();
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();