import dva from 'dva';
import createLoading from 'dva-loading';
import { hashHistory } from 'dva/router';

import { message } from 'antd';
import './index.css';

// 1. Initialize
const app = dva({
    history: hashHistory,
    onError(e) {
        message.error(e.message, /* duration */3);
    },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/example'));
app.model(require("./models/proProcess"));
app.model(require("./models/searchInput"));
app.model(require("./models/houseApptMng"));
app.model(require("./models/signCstmMng.js"));
app.model(require("./models/handleApptCstmMng.js"));
app.model(require("./models/login.js"));
app.model(require("./models/mainLayout.js"));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
