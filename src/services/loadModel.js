const tf = require('@tensorflow/tfjs-node');
const fetch = require('node-fetch'); // Pastikan Anda memiliki node-fetch terinstal

async function loadModel() {
    try {
        console.log('Memulai pemuatan model dari URL:', process.env.MODEL_URL);

        const modelResponse = await fetch(process.env.MODEL_URL);
        if (!modelResponse.ok) {
            throw new Error(`Gagal mengunduh model: ${modelResponse.statusText}`);
        }

        const modelJson = await modelResponse.json();
        console.log('File model berhasil diunduh dan dibaca:', modelJson);

        // Ekstrak jalur bobot dari weightsManifest
        const weightManifest = modelJson.weightsManifest[0];
        const weightPaths = weightManifest.paths.map(path => {
            // Pastikan jalur bobot lengkap dengan URL basis
            return new URL(path, process.env.MODEL_URL).href;
        });

        // Verifikasi bahwa setiap jalur bobot dapat diakses
        for (const path of weightPaths) {
            console.log('Mengunduh bobot dari:', path);
            const weightsResponse = await fetch(path);
            if (!weightsResponse.ok) {
                throw new Error(`Gagal mengunduh bobot dari ${path}: ${weightsResponse.statusText}`);
            }

            const weightsBuffer = await weightsResponse.arrayBuffer();
            console.log('File bobot berhasil diunduh dan dibaca, panjang byte:', weightsBuffer.byteLength);
        }

        const model = await tf.loadGraphModel(process.env.MODEL_URL);
        console.log('Model berhasil dimuat');
        return model;
    } catch (error) {
        console.error('Kesalahan memuat model:', error);
        throw error;
    }
}

module.exports = loadModel;
