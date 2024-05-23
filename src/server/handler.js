const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (!model) {
            throw new Error('Model tidak dimuat');
        }
        if (!image) {
            throw new Error('Gambar diperlukan');
        }

        const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            explanation,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: confidenceScore > 99 ? 'Model diprediksi dengan sukses.' : 'Model diprediksi dengan sukses tetapi di bawah ambang batas. Silakan gunakan gambar yang benar',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Kesalahan di postPredictHandler:', error);
        return h.response({
            status: 'fail',
            message: error.message
        }).code(500);
    }
}

module.exports = postPredictHandler;
