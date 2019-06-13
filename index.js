const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const express = require('express')
const router = express.Router()

module.exports = (config, callback) => {

    const {forwardingAddress, apiKey, apiSecret, scopes} = config;

    router.get('/shopify', (req, res) => {
        const shop = req.query.shop;
        if (shop) {
            const state = nonce();
            const redirectUri = `${forwardingAddress}/shopify/callback`;
            const installUrl =
                `https://${shop}/admin/oauth/authorize?client_id=${apiKey}` +
                `&scope=${scopes}&state=${state}&grant_options[]=per-user` +
                `&redirect_uri=${redirectUri}`;

            res.cookie('state', state);
            res.redirect(installUrl);
        } else {
            return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
        }
    });

    router.get('/shopify/callback', (req, res) => {

        const { shop, hmac, code, state } = req.query;
        const stateCookie = cookie.parse(req.headers.cookie).state;

        if (state !== stateCookie) {
            return res.status(403).send('Request origin cannot be verified');
        }

        if (shop && hmac && code) {
            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
                crypto
                    .createHmac('sha256', apiSecret)
                    .update(message)
                    .digest('hex'),
                'utf-8'
            );
            let hashEquals = false;
            try {
                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            } catch (e) {
                hashEquals = false;
            };

            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }

            const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };

            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then((accessTokenResponse) => {

                    const accessToken = accessTokenResponse.access_token;
                    const locale = accessTokenResponse.associated_user.locale;

                    res.cookie('accessToken', accessToken);
                    res.cookie('locale', locale);
                    res.cookie('shopOrigin', shop);

                    callback(shop, accessTokenResponse);

                    res.redirect('/');
                })
                .catch((error) => {
                    console.log(error);
                    res.status(error.statusCode).send(error.error_description);
                });

        } else {
            res.status(400).send('Required parameters missing');
        }
    });

    return router;
}
