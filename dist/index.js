"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var analyze_1 = __importDefault(require("./routes/analyze"));
var history_1 = __importDefault(require("./routes/history"));
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.get('/health', function (req, res) {
    res.json({ status: 'ok', service: 'TrueResume API' });
});
app.use('/api/analyze', analyze_1.default);
app.use('/api/history', history_1.default);
app.listen(PORT, function () {
    console.log("TrueResume API running on port ".concat(PORT));
});
exports.default = app;
//# sourceMappingURL=index.js.map