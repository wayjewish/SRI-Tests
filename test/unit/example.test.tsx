import React from 'react';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Application } from '../../src/client/Application';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { basename, routes } from '../utils/helpers';

describe('Общие требования', () => {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const { container } = render(
            <MemoryRouter initialEntries={[`${routes.home}`]}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const navbar = container.querySelector('nav');
        expect(navbar).not.toBe(null);

        const arrRoutes = Object.values(routes);
        for (let i = 0; i < arrRoutes.length; i++) {
            const route = arrRoutes[i];
            const link = navbar?.querySelector(`a[href="${route}"]`);
            expect(link).not.toBe(null);
        }
    });

    it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const { container } = render(
            <MemoryRouter initialEntries={[`${routes.home}`]}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const navbar = container.querySelector('nav');
        expect(navbar).not.toBe(null);

        const logo = navbar?.querySelector('.navbar-brand');
        expect(logo).not.toBe(null);
        expect(logo?.textContent).toBe('Example store');
        expect(logo?.getAttribute('href')).toBe(`${routes.home}`);
    });
});

describe('Страницы', () => {
    describe('в магазине должны быть страницы', () => {
        it('главная', () => {
            const api = new ExampleApi(basename);
            const cart = new CartApi();
            const store = initStore(api, cart);

            const { container } = render(
                <MemoryRouter initialEntries={[`${routes.home}`]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );

            const application = container.querySelector('.Application');
            expect(application).not.toBe(null);
        });

        it('каталог', () => {
            const api = new ExampleApi(basename);
            const cart = new CartApi();
            const store = initStore(api, cart);

            const { container } = render(
                <MemoryRouter initialEntries={[`${routes.catalog}`]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );

            const application = container.querySelector('.Application');
            expect(application).not.toBe(null);
        });

        it('условия доставки', () => {
            const api = new ExampleApi(basename);
            const cart = new CartApi();
            const store = initStore(api, cart);

            const { container } = render(
                <MemoryRouter initialEntries={[`${routes.delivery}`]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );

            const application = container.querySelector('.Application');
            expect(application).not.toBe(null);
        });

        it('контакты', () => {
            const api = new ExampleApi(basename);
            const cart = new CartApi();
            const store = initStore(api, cart);

            const { container } = render(
                <MemoryRouter initialEntries={[`${routes.contacts}`]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            );

            const application = container.querySelector('.Application');
            expect(application).not.toBe(null);
        });
    });
});
