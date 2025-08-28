import { beforeAll } from "bun:test";
import { JSDOM } from "jsdom";

beforeAll(() => {
	const { window } = new JSDOM("<!doctype html><html><body></body></html>", {
		url: "http://localhost",
		pretendToBeVisual: true,
		resources: "usable",
	});

	global.window = window as unknown as Window & typeof globalThis;
	global.document = window.document;
	global.navigator = window.navigator;
	global.HTMLElement = window.HTMLElement;
	global.Element = window.Element;
	global.Node = window.Node;
	global.DocumentFragment = window.DocumentFragment;
});
