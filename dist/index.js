"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const history_1 = __importDefault(require("./routes/history"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'TrueResume API' });
});
app.use('/api/analyze', analyze_1.default);
app.use('/api/history', history_1.default);
app.listen(PORT, () => {
    console.log(`TrueResume API running on port ${PORT}`);
});
exports.default = app;
