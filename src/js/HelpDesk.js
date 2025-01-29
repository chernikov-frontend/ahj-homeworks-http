import TicketView from './TicketView';
import TicketForm from './TicketForm';

export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;

    this.ticketView = new TicketView();
    this.ticketForm = new TicketForm();

    this.buttonOnClick = this.buttonOnClick.bind(this);

    this.ticketsList = document.querySelector('.tickets-list');

    this.body = document.querySelector('body');
    this.bodyListener = this.bodyListener.bind(this);

    this.body.addEventListener('click', this.bodyListener);

    this.editPopup = document.querySelector('.edit-ticket-popup');
    this.deletePopup = document.querySelector('.delete-ticket-popup');
  }

  init() {
    this.ticketView.showTickets(this.buttonOnClick);
  }

  bodyListener(e) {
    if (e.target.classList.contains('submit-button')) {
      const currentListItem = this.currentButton.closest('.tickets-list-item');

      if (e.target.closest('.delete-ticket-popup')) {
        this.ticketService.delete(currentListItem.id);
        currentListItem.remove();
      }

      if (e.target.closest('.edit-ticket-form')) {
        this.updateTicket(currentListItem.id);
      }

      this.closePopup();
    } else if (e.target.classList.contains('close-button')) {
      this.closePopup();
    }
  }

  buttonOnClick(e) {
    this.currentButton = e.target;

    if (this.currentButton.classList.contains('edit-button')) {
      this.showEditPopup();
    } else if (this.currentButton.classList.contains('delete-button')) {
      this.showDeletePopup();
    }
  }

  showDeletePopup() {
    this.body.classList.add('mask');
    this.deletePopup.style.display = 'flex';
  }

  closePopup() {
    this.deletePopup.style.display = 'none';
    this.editPopup.style.display = 'none';
    this.body.classList.remove('mask');
  }

  showEditPopup() {
    this.body.classList.add('mask');
    this.editPopup.style.display = 'block';

    const currentListItem = this.currentButton.closest('.tickets-list-item');

    this.ticketService.get(currentListItem.id, (error, result) => {
      if (error) {
        console.error('Error:', error);
      } else {
        const nameTextarea = document.querySelector('.name-textarea');
        const descriptionTextarea = document.querySelector('.description-textarea');

        nameTextarea.value = result.name;
        descriptionTextarea.value = result.description;
      }
    });
  }

  updateTicket(id) {
    const editTicketForm = document.querySelector('.edit-ticket-form');

    const descriptionTextarea = document.querySelector('.description-textarea');
    const nameTextarea = document.querySelector('.name-textarea');

    if (descriptionTextarea.value && nameTextarea.value) {
      const data = new FormData(editTicketForm);
      const ticketData = {
        name: data.get('name'),
        description: data.get('description'),
        status: false,
        created: Date.now(),
      };

      this.ticketService.update(id, ticketData, (error) => {
        if (error) {
          console.error('Error:', error);
        } else {
          this.init();
          this.ticketForm.closeForm();
        }
      });
    }
  }
}
