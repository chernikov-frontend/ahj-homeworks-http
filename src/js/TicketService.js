export default class TicketService {
  handleResponse(callback, xhr) {
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback(null, data);
        } catch (e) {
          callback(e, null);
        }
      }
    });
  }

  list(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7070/?method=allTickets');
    xhr.setRequestHeader('Content-Type', 'application/json');

    this.handleResponse(callback, xhr);

    xhr.send();
  }

  get(id, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    this.handleResponse(callback, xhr);

    xhr.send();
  }

  create(data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7070/?method=createTicket');
    xhr.setRequestHeader('Content-Type', 'application/json');

    this.handleResponse(callback, xhr);

    xhr.send(JSON.stringify(data));
  }

  update(id, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:7070/?method=updateById&id=${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    this.handleResponse(callback, xhr);

    xhr.send(JSON.stringify(data));
  }

  delete(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:7070/?method=deleteById&id=${id}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  }
}
