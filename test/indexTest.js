const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// Stub fetch so tests do not depend on real network access
const samplePosts = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excep',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur'
  }
];

dom.window.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(samplePosts)
});

// Inject the transformed JavaScript into the virtual DOM
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

// Expose JSDOM globals to the testing environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

async function waitForListContent(timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const postDisplay = document.querySelector('#post-list');
    if (postDisplay && postDisplay.innerHTML.trim().length > 0) {
      return postDisplay;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return document.querySelector('#post-list');
}

// Sample test suite for JavaScript event handling
describe('Asynchronous Fetching ', () => {
  it('should fetch to external api and add information to page', async() => {
    const postDisplay = await waitForListContent();
    expect(postDisplay).to.exist;
    expect(postDisplay.innerHTML).to.include('sunt aut');
  });

  it('should create an h1 and p element to add', async() => {
    await waitForListContent();
    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');

    expect(h1).to.exist;
    expect(p).to.exist;
    expect(h1.textContent).to.include('sunt aut facere repellat');
    expect(p.textContent).to.include('quia et suscipit\nsuscipit');
  });
});