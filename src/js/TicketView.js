import TicketService from './TicketService';

export default class TicketView {
  constructor() {
    this.ticketsList = document.querySelector('.tickets-list');
    this.ticketService = new TicketService();

    this.ticketOnClick = this.ticketOnClick.bind(this);
  }

  createTicket(name, date, id, status) {
    const formatedDate = this.formatDate(date);

    const checkedAttribute = status ? 'checked' : '';

    const ticket = `
      <li class="tickets-list-item" id="${id}">
        <div class="content">
          <input id="checkbox-${id}" name="checkbox" type="checkbox" class="tickets-list-item-checkbox" ${checkedAttribute}>
          <label for="checkbox-${id}" class="tickets-list-item-label">${name}</label>
        </div>
        <div class="content">
          <span class="tickets-list-item-date">${formatedDate}</span>
          <button class="tickets-list-item-button edit-button"></button>
          <button class="tickets-list-item-button delete-button"></button>
        </div>
        <div class="ticket-description"></div>
      </li>
    `;

    return ticket;
  }

  showTickets(onClickMethod) {
    this.ticketService.list((error, tickets) => {
      if (error) {
        console.error('Error:', error);
      } else {
        tickets.forEach(((ticket) => {
          const createdTicket = this.createTicket(ticket.name, ticket.created, ticket.id, ticket.status);
          this.ticketsList.insertAdjacentHTML('beforeend', createdTicket);
        }));
      }

      const editButtons = document.querySelectorAll('.edit-button');
      editButtons.forEach((button) => {
        button.addEventListener('click', onClickMethod);
      });

      const deleteButtons = document.querySelectorAll('.delete-button');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', onClickMethod);
      });

      this.ticketsList.addEventListener('click', this.ticketOnClick);

      const checkboxes = document.querySelectorAll('.tickets-list-item-checkbox');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));
      });
    });
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const timeString = `${day}.${month}.${year} ${hours}:${minutes}`;

    return timeString;
  }

  ticketOnClick(e) {
    const targetElem = e.target;
    if (targetElem.classList.contains('edit-button')
      || targetElem.classList.contains('delete-button')
      || targetElem.classList.contains('tickets-list-item-checkbox')) {
      return;
    }

    const listItem = targetElem.closest('.tickets-list-item');
    if (listItem) {
      this.toggleTicketDescription(listItem);
    }
  }

  toggleTicketDescription(item) {
    const description = item.querySelector('.ticket-description');

    if (description.style.display === 'block') {
      description.style.display = 'none';
    } else {
      this.showTicketDescription(item);
    }
  }

  showTicketDescription(item) {
    const ticketId = item.id;

    this.ticketService.get(ticketId, (error, result) => {
      if (error) {
        console.error('Error:', error);
      } else {
        const description = item.querySelector('.ticket-description');
        description.textContent = result.description;
        description.style.display = 'block';
      }
    });
  }

  handleCheckboxChange(e) {
    const checkbox = e.target;
    const listItem = checkbox.closest('.tickets-list-item');
    const ticketId = listItem.id;
    const newStatus = checkbox.checked;

    this.updateTicketStatus(ticketId, newStatus);
  }

  updateTicketStatus(id, status) {
    const ticketData = {
      status,
    };

    this.ticketService.update(id, ticketData, (error) => {
      if (error) {
        console.error('Error:', error);
      }
    });
  }
}
