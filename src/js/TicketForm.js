import TicketService from './TicketService';

export default class TicketForm {
  constructor() {
    this.addTicketButton = document.querySelector('.add-ticket-button');
    this.body = document.querySelector('body');
    this.popup = document.querySelector('.add-ticket-popup');
    this.closeButton = document.querySelector('.close-button');
    this.addTicketForm = document.querySelector('.add-ticket-form');

    this.buttonOnClick = this.buttonOnClick.bind(this);

    this.addTicketButton.addEventListener('click', this.buttonOnClick);
    this.closeButton.addEventListener('click', this.buttonOnClick);

    this.addTicketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.postForm();
    });

    this.ticketService = new TicketService();
  }

  buttonOnClick(e) {
    e.preventDefault();

    const currentButton = e.target;
    if (currentButton.classList.contains('add-ticket-button')) {
      this.showForm();
    } else if (currentButton.classList.contains('close-button')) {
      this.closeForm();
    }
  }

  showForm() {
    this.body.classList.add('mask');
    this.popup.style.display = 'block';
  }

  closeForm() {
    this.popup.style.display = 'none';
    this.body.classList.remove('mask');
  }

  postForm() {
    const data = new FormData(this.addTicketForm);

    const ticketData = {
      name: data.get('name'),
      description: data.get('description'),
      status: false,
      created: Date.now(),
    };

    this.ticketService.create(ticketData, (error) => {
      if (error) {
        console.error('Error:', error);
      } else {
        location.reload();
        this.closeForm();
      }
    });
  }
}
