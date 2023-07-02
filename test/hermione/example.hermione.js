const { assert } = require('chai');

const port = Number(process.env.PORT) || 3000;
const basename = '/hw/store';
const url = `http://localhost:${port}${basename}`;
const routes = {
    catalog: '/catalog', 
    delivery: '/delivery',
    contacts: '/contacts',
    cart: '/cart',
};

describe('Общие требования', async () => {
    describe('вёрстка должна адаптироваться под ширину экрана', async () => {
        describe('home page', async () => {
            it('1400', async ({ browser }) => {
                await browser.setWindowSize(1400, 1400);
                await browser.url(url);
                await browser.assertView('plain', 'body');
            });

            it('1200', async ({ browser }) => {
                await browser.setWindowSize(1200, 1200);
                await browser.url(url);
                await browser.assertView('plain', 'body');
            });

            it('992', async ({ browser }) => {
                await browser.setWindowSize(992, 992);
                await browser.url(url);
                await browser.assertView('plain', 'body');
            });

            it('768', async ({ browser }) => {
                await browser.setWindowSize(768, 768);
                await browser.url(url);
                await browser.assertView('plain', 'body');
            });

            it('576', async ({ browser }) => {
                await browser.setWindowSize(576, 576);
                await browser.url(url);
                await browser.assertView('plain', 'body');
            });

            it('320', async ({ browser }) => {
                await browser.setWindowSize(320, 320);
                await browser.url(url);   
                await browser.assertView('plain', 'body');
            });
        });
    });

    describe('Навигационное меню', async () => {
        it('отображается кнопка-переключатель меню', async ({ browser }) => {
            await browser.setWindowSize(320, 320);
            await browser.url(url);   

            const toggler = await browser.$('.navbar-toggler');
            const isDisplayed = await toggler.isDisplayed();
            assert.equal(isDisplayed, true);
        });

        it('меню открывается по клику', async ({ browser }) => {
            await browser.setWindowSize(320, 320);
            await browser.url(url);   

            const toggler = await browser.$('.navbar-toggler');
            await toggler.click();

            const navbarCollapse = await browser.$('.navbar-toggler');
            const isDisplayed = await navbarCollapse.isDisplayed();
            assert.equal(isDisplayed, true);
        });

        it('меню закрывается при выборе элемента из меню (BUG_ID === 4)', async ({ browser }) => {
            await browser.setWindowSize(320, 320);
            await browser.url(url);   
            
            const toggler = await browser.$('.navbar-toggler');
            await toggler.click();

            const navbarCollapse = await browser.$('.navbar-collapse');
            const navLink = await navbarCollapse.$('.nav-link');
            await navLink.click();

            const isDisplayed = await navbarCollapse.isDisplayed();
            assert.equal(isDisplayed, false);
        });
    });
});

describe('Каталог', async () => {
    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре (BUG_ID === 1)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}`);   

        const productItem = await browser.$('.ProductItem');
        await productItem.waitForDisplayed({ timeout: 3000 });

        const name = productItem.$('.ProductItem-Name');
        const isDisplayedName = await name.isDisplayed();
        assert.equal(isDisplayedName, true);

        const price = productItem.$('.ProductItem-Price');
        const isDisplayedPrice = await price.isDisplayed();
        assert.equal(isDisplayedPrice, true);

        const link = productItem.$('.ProductItem-DetailsLink');
        const isDisplayedLink = await link.isDisplayed();
        assert.equal(isDisplayedLink, true);
    });
});

describe('Товар', async () => {
    it('выводится детальная страница на id 0 (BUG_ID === 9)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}/0`);

        const productDetails = await browser.$('.ProductDetails');
        await productDetails.waitForDisplayed({ timeout: 3000 });
        const isDisplayed = await productDetails.isDisplayed();
        assert.equal(isDisplayed, true);

        await browser.assertView('plain', '.ProductDetails-AddToCart');
    });

    it('выводится детальная страница на id 1 (BUG_ID === 3)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}/1`);

        const productDetails = await browser.$('.ProductDetails');
        await productDetails.waitForDisplayed({ timeout: 3000 });
        const isDisplayed = await productDetails.isDisplayed();
        assert.equal(isDisplayed, true);
    });
});

describe('Корзина', async () => {
    it('добавить в корзину (BUG_ID === 7)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}/0`);

        const btnAdd = await browser.$('.ProductDetails-AddToCart');
        const cartBadge = await browser.$('.CartBadge');
        
        btnAdd.click();
        await cartBadge.waitForDisplayed({ timeout: 3000 });
        const isDisplayed = await cartBadge.isDisplayed();
        assert.equal(isDisplayed, true);
    });

    it('валидация формы (BUG_ID === 10)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}/0`);

        const btnAdd = await browser.$('.ProductDetails-AddToCart');
        const cartBadge = await browser.$('.CartBadge');
        
        btnAdd.click();
        await cartBadge.waitForDisplayed({ timeout: 3000 });
        const isDisplayed = await cartBadge.isDisplayed();
        assert.equal(isDisplayed, true);



        await browser.url(`${url}${routes.cart}`);

        const name = await browser.$('#f-name');
        const phone = await browser.$('#f-phone');
        const address = await browser.$('#f-address');

        const nameFeedback = await browser.$('#f-name + .invalid-feedback');
        const phoneFeedback = await browser.$('#f-phone + .invalid-feedback');
        const addressFeedback = await browser.$('#f-address + .invalid-feedback');
        const btnSubmit = await browser.$('.Form-Submit');

        btnSubmit.click();

        await nameFeedback.waitForDisplayed({ timeout: 3000 });
        await phoneFeedback.waitForDisplayed({ timeout: 3000 });
        await addressFeedback.waitForDisplayed({ timeout: 3000 });

        let isDisplayedNameFeedback = await nameFeedback.isDisplayed();
        let isDisplayedPhoneFeedback = await phoneFeedback.isDisplayed();
        let isDisplayedAddressFeedback = await addressFeedback.isDisplayed();

        assert.equal(isDisplayedNameFeedback, true);
        assert.equal(isDisplayedPhoneFeedback, true);
        assert.equal(isDisplayedAddressFeedback, true);



        await name.setValue('test');
        await phone.setValue('1234567890');
        await address.setValue('test');

        await nameFeedback.waitForDisplayed({ timeout: 3000, reverse: true });
        await phoneFeedback.waitForDisplayed({ timeout: 3000, reverse: true });
        await addressFeedback.waitForDisplayed({ timeout: 3000, reverse: true });

        isDisplayedNameFeedback = await nameFeedback.isDisplayed();
        isDisplayedPhoneFeedback = await phoneFeedback.isDisplayed();
        isDisplayedAddressFeedback = await addressFeedback.isDisplayed();

        assert.equal(isDisplayedNameFeedback, false);
        assert.equal(isDisplayedPhoneFeedback, false);
        assert.equal(isDisplayedAddressFeedback, false);
    });

    it('успешная отправка формы (BUG_ID === 2 && BUG_ID === 5 && BUG_ID === 8)', async ({ browser }) => {
        await browser.url(`${url}${routes.catalog}/0`);

        const btnAdd = await browser.$('.ProductDetails-AddToCart');
        const cartBadge = await browser.$('.CartBadge');
        
        btnAdd.click();
        await cartBadge.waitForDisplayed({ timeout: 3000 });
        const isDisplayed = await cartBadge.isDisplayed();
        assert.equal(isDisplayed, true);



        await browser.url(`${url}${routes.cart}`);

        const name = await browser.$('#f-name');
        const phone = await browser.$('#f-phone');
        const address = await browser.$('#f-address');
        const btnSubmit = await browser.$('.Form-Submit');

        await name.setValue('test');
        await phone.setValue('1234567890');
        await address.setValue('test');

        btnSubmit.click();

        const successMessage = await browser.$('.Cart-SuccessMessage');
        await successMessage.waitForDisplayed({ timeout: 3000 });


        const cartNumber = await browser.$('.Cart-Number');
        const cartNumberText = await cartNumber.getText();
        assert.equal(cartNumberText.length < 13, true);

        await browser.assertView('plain', '.Cart-SuccessMessage', {
            ignoreElements: ['.Cart-SuccessMessage *'],
        });
    });
});
