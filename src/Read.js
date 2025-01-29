import Request from './Request.js';

class Read extends Request {

    constructor(Page) {
        super(Page.page);
        this.list = document.querySelector('[data-list]');
        this.template = document.querySelector('[data-list-template]');
        this.listBin = document.querySelector('[data-list-bin]');
        this.Page = Page;

        // this.form.querySelector('[data-type=submit]')
        // .addEventListener('click', this.submitCreate.bind(this));

        this.read();


    }

    response(response) {
        console.log(response.data);
        this.listBin.innerHTML = '';
        response.data.forEach(item => {
            const clone = this.template.content.cloneNode(true);
            const keys = Object.keys(item); //[id, title, ...]
            keys.forEach(key => {
                if (clone.querySelector(`[data-key=${key}]`)) {
                    clone.querySelector(`[data-key=${key}]`).innerText = item[key];
                }
            });
            const editButton = clone.querySelector('[data-button-type=edit]');
            editButton.addEventListener('click', _ => {
                this.Page.Edit.showModal(item);
            });
            const deleteButton = clone.querySelector('[data-button-type=delete]');
            deleteButton.addEventListener('click', _ => {
                this.Page.Delete.showModal(item);
            });


            this.listBin.appendChild(clone);
        });
    }



}

export default Read;