const { test, expect } = require('@playwright/test');

const auth = {
  key: process.env.TRELLO_KEY,
  token: process.env.TRELLO_TOKEN,
};

test.describe.configure({ mode: 'serial' });

test.describe('Trello workflow', () => {
  let boardId;
  let listId;
  let cardId;

  test('create a board', async ({ request }) => {
    const start = Date.now();
    const response = await request.post('/1/boards', {
      params: { ...auth, name: 'Automation Board', defaultLists: false },
    });
    const duration = Date.now() - start;  //to measure how long trello took for the request, to measure performance

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Automation Board');
    expect(body.id).toBeTruthy();
    expect(duration).toBeLessThan(2000);

    boardId = body.id;
  });

   test('create a list', async ({ request }) => {
   
    const start = Date.now();
    const response = await request.post('/1/lists', {
      params: { ...auth, name: 'To Do list', idBoard: boardId },
    });
    const duration = Date.now() - start;  //to measure how long trello took for the request, to measure performance

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('To Do list');
    expect(body.idBoard).toBe(boardId);
    expect(duration).toBeLessThan(2000);

    listId = body.id
  });

   test('create a card', async ({ request }) => {

    const start = Date.now();
    const response = await request.post('/1/cards', {
      params: { ...auth, name: 'My Task', idBoard: boardId ,idList: listId},
    });
    const duration = Date.now() - start;  //to measure how long trello took for the request, to measure performance

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('My Task');
    expect(body.idBoard).toBe(boardId);
    expect(body.idList).toBe(listId);
    expect(duration).toBeLessThan(2000);

    cardId = body.id;
  });

  test('update the card', async ({ request }) => {
  const start = Date.now();
  const response = await request.put(`/1/cards/${cardId}`, { //put for updating
    params: { ...auth, name: 'My Task - Updated', desc: 'Updated by automation' },
  });
  const duration = Date.now() - start;

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.id).toBe(cardId);
  expect(body.name).toBe('My Task - Updated');
  expect(body.desc).toBe('Updated by automation');
  expect(duration).toBeLessThan(2000);
});

test('delete the board', async ({ request }) => {
  const start = Date.now();
  const response = await request.delete(`/1/boards/${boardId}`, {
    params: { ...auth },
  });
  const duration = Date.now() - start;

  expect(response.status()).toBe(200);
  expect(duration).toBeLessThan(2000);

  // Confirm it's gone
  const check = await request.get(`/1/boards/${boardId}`, {
    params: { ...auth },
  });
  expect(check.status()).toBe(404);
});
});