import view from "./View.js";
import previewView from "./previewView.js";
import icons from 'url:../../img/icons.svg';
class ResultsView extends view{
    _parentElement = document.querySelector(".results");
    _errorMessage = 'No recipes found for your query !';

    _generateMarkUp(){
      //console.log(this._data);
      return this._data.map(bookmark => previewView.render(bookmark,false)).join('');
        
    }
}

export default new ResultsView();