// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// selenium.test.js
const { Builder, By, Key, until } = require('selenium-webdriver');

describe('To-Do List Application', () => {
   let driver;

   beforeAll(async () => {
       driver = await new Builder().forBrowser('chrome').build();
   });

   afterAll(async () => {
       await driver.quit();
   });

   it('Should add a new to-do item', async () => {
       await driver.get('http://your-todo-list-application-url');

       const inputField = await driver.findElement(By.id('new-todo'));
       await inputField.sendKeys('Example To-Do Item', Key.RETURN);
       await driver.wait(until.elementLocated(By.xpath(`//label[text()='Example To-Do Item']`)));

       const newItem = await driver.findElement(By.xpath(`//label[text()='Example To-Do Item']`));
       expect(await newItem.isDisplayed()).toBe(true);
   });
});
