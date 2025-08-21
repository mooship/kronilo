/**
 * Test setup for React Testing Library in Bun.
 *
 * Sets up a jsdom-based DOM environment so React hooks and components
 * can be tested in Bun using React Testing Library.
 */
import { beforeAll } from "bun:test";
import { JSDOM } from "jsdom";

beforeAll(() => {
	const { window } = new JSDOM("<!doctype html><html><body></body></html>", {
		url: "http://localhost",
		pretendToBeVisual: true,
		resources: "usable",
	});

	// Set up global DOM objects for React Testing Library
	global.window = window as unknown as Window & typeof globalThis;
	global.document = window.document;
	global.navigator = window.navigator;
	global.HTMLElement = window.HTMLElement;
	global.Element = window.Element;
	global.Node = window.Node;
	global.DocumentFragment = window.DocumentFragment;
});
