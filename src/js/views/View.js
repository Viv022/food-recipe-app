import icons from 'url:../../img/icons.svg';

export default class View{
    _data;

    /**
     * @param {Object|Object[]} data The data to be rendered
     * @param {boolean} [render=true] If false,create markup string instead of rendering to the DOM 
     * @returns {undefined | string} A markup string is returned if render is false
     * @this {Object} View instance
     * @author Vivek
     * @todo Finish the implementation
     */

    render(data,render = true){
      //console.log(data);
        if(!data || (Array.isArray(data) && data.length === 0))return this.renderError();
        //console(' ');
        this._data = data;
        //console.log(this._data);
        //console.log(this._parentElement);
        const markup = this._generateMarkUp();

        if(!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data){
      // if(!data || (Array.isArray(data) && data.length === 0))return this.renderError();
        //console(' ');
        //console.log(data);
      this._data = data;
        //console.log(this._data);
        //console.log(this._parentElement);
      const newMarkup = this._generateMarkUp();
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));
      newElements.forEach((newEl,i) => {
        const curEl = curElements[i];
        //console.log(curEl,newEl.isEqualNode(curEl));
        //update changed text
        if(!newEl.isEqualNode(curEl) && newEl?.firstChild?.nodeValue?.trim() !== ''){
          //console.log(newEl,curEl);
          curEl.textContent = newEl.textContent;
          //console.log(newEl.firstChild.nodeValue.trim());
        }

        //update changed attributes
        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name,attr.value));
        }
      });


    }

    _clear(){
        this._parentElement.innerHTML = '';

    }

    renderSpinner = function(){
        const markup = `<div class="spinner">
                    <svg>
                      <use href="${icons}#icon-loader"></use>
                    </svg>
                    </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    };

    renderError(message = this._errorMessage){
      const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    renderMessage(message = this._message){
      const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
}