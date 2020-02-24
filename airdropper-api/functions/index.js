const functions = require('firebase-functions');

const _ = require('lodash');
const axios = require('axios');

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.options('*', cors({origin: false}));

const newApp = express();

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    }
};

newApp.use(cors(corsOptions));

newApp.get('/chain/:chainId/wallet/tokens/:account', async (req, res, next) => {

    const {chainId, account} = req.params;

    let rootPath = '';

    if (chainId === "1") {
        rootPath = 'https://api.etherscan.io/api';
    } else if (chainId === "3") {
        rootPath = 'https://api-ropsten.etherscan.io/api';
    } else if (chainId === "4") {
        rootPath = 'https://api-rinkeby.etherscan.io/api';
    } else {
        return res
            .status(500)
            .json({
                error: 'Unknown error ID'
            });
    }

    const apiKey = 'XUIWNRDMA4PVMAWQWCUA1H5JFFH38VDQCN';

    const {data} = await axios.get(`${rootPath}?module=account&action=tokentx&address=${account}&startblock=0&endblock=999999999&sort=asc&apikey=${apiKey}`, {
        headers: {
            'x-api-key': apiKey,
            'Access-Control-Allow-Origin': '*'
        }
    });

    if (data && data.status === '1') {
        return res.json({
            tokens: data.result
        });
    }

    return res
        .status(500)
        .json({
            error: 'Failed to find account'
        });
});

const main = express();
main.use('/api', newApp);
main.use(cors(corsOptions));

exports.main = functions.https.onRequest(main);
