# shopify-oauth
ExpressJS router implementing Shopify OAuth flow authenticating user with online access. 

The code adapted from the Shopify help manual: https://help.shopify.com/en/api/tutorials/build-a-shopify-app-with-node-and-express

# Installation
Install with npm: ```npm install biscuitapps/shopify-oauth#v0.9.0```

Add directly to dependencies section of package.json: ```"shopify-oauth": "github:biscuitapps/shopify-oauth#v0.9.0"```

# Usage
    const shopifyOauth = require('shopify-oauth');

    server.use(shopifyOauth({
        forwardingAddress, apiKey, apiSecret, scopes
    }, (shop, accessTokenResponse) => {
        ...
      });
    }));


# Versioning
Release commits are available in ```master``` branch and marked with release tags vX.Y.Z 

# Roadmap
Not a lot is planned as this package is supposed to stay small but for the version 1.0.0 these little things will be done:
1. Adding unit tests
2. Removing cookie set up (it should be done in the callback)
3. Replacing promised based ```request``` HTTP calls with async/await based ```fetch``` HTTP calls
4. Adding offline access authentication as an option.

# License
    MIT License

    Copyright (c) [year] [fullname]

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
